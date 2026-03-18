import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  getConversation,
  getMessages,
  addMessage,
} from '@/lib/messaging-store';
import type { Message, SendMessageBody } from '@/lib/messaging-types';

export const dynamic = 'force-dynamic';

// 30 messages per 60s per user
const SEND_RATE_LIMIT_MAX = 30;
const SEND_RATE_LIMIT_WINDOW_MS = 60_000;

type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET /api/messaging/conversations/[id]/messages — list messages
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest, ctx: RouteContext) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const conv = getConversation(id);

  if (!conv) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    );
  }

  const isParticipant = conv.participants.some(
    (p) => p.citizen_id === auth.user_id,
  );
  if (!isParticipant) {
    return NextResponse.json(
      { error: 'Not a member of this conversation' },
      { status: 403 },
    );
  }

  const url = new URL(req.url);
  const before = url.searchParams.get('before') ?? undefined;
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50;

  if (limitParam && (isNaN(limit) || limit < 1)) {
    return NextResponse.json(
      { error: 'limit must be a positive integer (max 100)' },
      { status: 400 },
    );
  }

  const messages = getMessages(id, { before, limit });
  return NextResponse.json({ messages });
}

// ---------------------------------------------------------------------------
// POST /api/messaging/conversations/[id]/messages — send a message
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest, ctx: RouteContext) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const rl = checkRateLimit(
    `msg-send:${auth.user_id}`,
    SEND_RATE_LIMIT_MAX,
    SEND_RATE_LIMIT_WINDOW_MS,
  );
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  const { id } = await ctx.params;
  const conv = getConversation(id);

  if (!conv) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    );
  }

  const participant = conv.participants.find(
    (p) => p.citizen_id === auth.user_id,
  );
  if (!participant) {
    return NextResponse.json(
      { error: 'Not a member of this conversation' },
      { status: 403 },
    );
  }

  let body: SendMessageBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
    return NextResponse.json(
      { error: 'content is required and must be a non-empty string' },
      { status: 400 },
    );
  }

  const msgType = body.type ?? 'text';
  if (!['text', 'voice', 'image'].includes(msgType)) {
    return NextResponse.json(
      { error: 'type must be text, voice, or image' },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const message: Message = {
    id: crypto.randomUUID(),
    conversation_id: id,
    sender_id: auth.user_id,
    sender_name: participant.display_name,
    sender_type: participant.citizen_type,
    type: msgType,
    content: body.content.trim(),
    reply_to_id: body.reply_to_id ?? null,
    reactions: {},
    created_at: now,
    edited_at: null,
  };

  const created = addMessage(message);
  return NextResponse.json({ message: created }, { status: 201 });
}
