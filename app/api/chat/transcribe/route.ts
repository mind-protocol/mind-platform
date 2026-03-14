import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const userId = auth.user_id;
  const rl = checkRateLimit(`transcribe:${userId}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many transcription requests. Please wait.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Transcription service not configured' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');
    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const whisperForm = new FormData();
    whisperForm.append('file', audioFile, 'audio.m4a');
    whisperForm.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: whisperForm,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Whisper API error:', response.status, err);
      return NextResponse.json({ error: 'Transcription failed' }, { status: 502 });
    }

    const result = await response.json() as { text: string };
    return NextResponse.json({ text: result.text });
  } catch (e) {
    console.error('Transcription error:', e);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
