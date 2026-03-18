import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

// Simple in-memory rate limit: 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const FAQ_SYSTEM_PROMPT = `You are Mind, the AI assistant of Mind Protocol. You answer questions about Mind Protocol accurately and concisely.

## About Mind Protocol
- Open-source infrastructure for personal AI agents that understand your body and mind
- Core product: Mind Home — always-on AI daemon that reads biometrics, manages conversations, dispatches tasks
- Duo Mode: co-regulation between two people sharing biometric data
- Tracks: stress, HRV, sleep, heart rate, Body Battery, steps, substances (caffeine, supplements, etc.)
- Integrations: Garmin Connect, Telegram, WhatsApp, web chat
- Token: $MIND on Solana (Token-2022), 1M supply, 1% transfer fee, LP locked until Feb 2027
- Stack: Python + Claude Code (backend), Next.js 14 (frontend), Supabase, Solana
- Privacy: data processed locally, open-source, self-hostable, no data sales
- Founded by Nicolas (NLR)

## Rules
- Be concise: 2-4 sentences per answer
- Cite sources when relevant: link to /whitepaper, /manifesto, /privacy, /token, /tokenomics, /tracker
- Auto-detect user language and respond in the same language
- If you don't know something specific, say so honestly
- Format sources as markdown links
- Do NOT make up features or promises that don't exist`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limited. Please wait a moment.' },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.question || typeof body.question !== 'string' || body.question.length > 500) {
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { answer: "I'm temporarily unavailable. Please try again later.", source: 'fallback' },
    );
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 512,
        system: FAQ_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: body.question }],
      }),
    });

    if (!res.ok) {
      throw new Error(`Claude API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "I couldn't generate an answer.";

    return NextResponse.json({ answer: text, source: 'ai' });
  } catch {
    return NextResponse.json(
      { answer: "I'm temporarily unavailable. Please try again later.", source: 'fallback' },
    );
  }
}
