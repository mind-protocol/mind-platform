/**
 * Chat relay service: forwards messages to MANEMUS backend,
 * falls back to Claude API (Anthropic) if MANEMUS is unreachable.
 */

import { MANEMUS_URL } from '../api-fetch';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
const MANEMUS_TIMEOUT_MS = 8_000;

interface RelayResult {
  text: string;
  source: 'manemus' | 'claude';
}

export async function relayChatMessage(
  threadId: string,
  content: string,
  senderId: string,
): Promise<RelayResult> {
  // 1. Try MANEMUS first
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), MANEMUS_TIMEOUT_MS);

    const res = await fetch(`${MANEMUS_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        thread_id: threadId,
        content,
        sender_id: senderId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const reply = data.response || data.content || data.message || '';
      if (reply) {
        return { text: reply, source: 'manemus' };
      }
    }
  } catch {
    // MANEMUS unreachable — fall through to Claude
  }

  // 2. Fallback: call Claude API directly
  if (!ANTHROPIC_API_KEY) {
    return {
      text: "Je suis temporairement indisponible. Réessaie dans quelques minutes.",
      source: 'claude',
    };
  }

  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: "You are Mind, the AI agent of Mind Protocol. Reply concisely and helpfully. Auto-detect the user's language and respond in the same language (English, French, Chinese, etc.). 你是Mind Protocol的AI智能体。如果用户用中文交流，请用中文回复。",
      messages: [{ role: 'user', content }],
    }),
  });

  if (!claudeRes.ok) {
    const err = await claudeRes.text();
    throw new Error(`Claude API error ${claudeRes.status}: ${err}`);
  }

  const claudeData = await claudeRes.json();
  const text = claudeData.content?.[0]?.text || 'Pas de réponse.';

  return { text, source: 'claude' };
}
