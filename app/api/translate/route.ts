import { NextRequest, NextResponse } from 'next/server';

// ── In-memory cache: hash(text+from+to) → translated ─────────────────
const cache = new Map<string, { text: string; ts: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_SIZE = 200;

function cacheKey(text: string, from: string, to: string): string {
  // Simple hash — good enough for dedup
  let h = 0;
  const s = `${from}:${to}:${text}`;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

function pruneCache() {
  if (cache.size <= MAX_CACHE_SIZE) return;
  const now = Date.now();
  for (const [k, v] of cache) {
    if (now - v.ts > CACHE_TTL_MS) cache.delete(k);
  }
  // If still too big, drop oldest
  if (cache.size > MAX_CACHE_SIZE) {
    const entries = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts);
    const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    for (const [k] of toDelete) cache.delete(k);
  }
}

// ── Google Translate (free, no key) ───────────────────────────────────
async function googleTranslateFree(text: string, from: string, to: string): Promise<string> {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', from);
  url.searchParams.set('tl', to);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Google Translate HTTP ${res.status}`);
  }

  const data = await res.json();
  // Response format: [[["translated","original",null,null,n],...],null,"detected_lang"]
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error('Unexpected response format');
  }

  return data[0]
    .filter((segment: unknown) => Array.isArray(segment) && segment.length > 0)
    .map((segment: unknown[]) => segment[0])
    .join('');
}

// ── LRC-aware translation ─────────────────────────────────────────────
// Preserves [mm:ss.xx] timestamps while translating the text portions
async function translateLyrics(lyrics: string, from: string, to: string): Promise<string> {
  const lrcLineRegex = /^(\[\d{2}:\d{2}\.\d{2,3}\])\s*(.*)$/;
  const lines = lyrics.split('\n');

  // Separate LRC timestamps from text
  const textLines: string[] = [];
  const lineMap: { idx: number; tag: string | null; text: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(lrcLineRegex);
    if (match) {
      lineMap.push({ idx: i, tag: match[1], text: match[2] });
      if (match[2].trim()) textLines.push(match[2]);
    } else {
      lineMap.push({ idx: i, tag: null, text: lines[i] });
      if (lines[i].trim()) textLines.push(lines[i]);
    }
  }

  // Batch translate all text lines at once (more efficient, better context)
  const batchText = textLines.join('\n');
  const translated = await googleTranslateFree(batchText, from, to);
  const translatedLines = translated.split('\n');

  // Reconstruct with timestamps
  let tIdx = 0;
  const result: string[] = [];
  for (const entry of lineMap) {
    if (!entry.text.trim()) {
      result.push(entry.tag ? `${entry.tag} ` : '');
      continue;
    }
    const translatedLine = tIdx < translatedLines.length ? translatedLines[tIdx] : entry.text;
    tIdx++;
    result.push(entry.tag ? `${entry.tag} ${translatedLine}` : translatedLine);
  }

  return result.join('\n');
}

// ── POST /api/translate ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, from = 'auto', to = 'en' } = body as {
      text?: string;
      from?: string;
      to?: string;
    };

    if (!text || !to) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 });
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text too long (max 10000 chars)' }, { status: 400 });
    }

    // Check cache
    const key = cacheKey(text, from, to);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({ translated: cached.text, cached: true });
    }

    // Detect if LRC format
    const isLRC = /^\[\d{2}:\d{2}\.\d{2,3}\]/m.test(text);
    const translated = isLRC
      ? await translateLyrics(text, from, to)
      : await googleTranslateFree(text, from, to);

    // Cache result
    cache.set(key, { text: translated, ts: Date.now() });
    pruneCache();

    return NextResponse.json({ translated, cached: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Translation failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
