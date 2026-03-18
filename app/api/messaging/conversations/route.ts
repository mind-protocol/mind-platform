import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  listConversations,
  createConversation,
} from '@/lib/messaging-store';
import type {
  Conversation,
  CreateConversationBody,
  Participant,
} from '@/lib/messaging-types';

export const dynamic = 'force-dynamic';

// 5 conversation creations per 60s per user
const CREATE_RATE_LIMIT_MAX = 5;
const CREATE_RATE_LIMIT_WINDOW_MS = 60_000;

// ---------------------------------------------------------------------------
// GET /api/messaging/conversations — list conversations for the current user
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const typeFilter = url.searchParams.get('type') as
    | 'dm'
    | 'group'
    | 'channel'
    | null;

  if (typeFilter && !['dm', 'group', 'channel'].includes(typeFilter)) {
    return NextResponse.json(
      { error: 'Invalid type filter. Must be dm, group, or channel.' },
      { status: 400 },
    );
  }

  const conversations = listConversations(
    auth.user_id,
    typeFilter ?? undefined,
  );

  return NextResponse.json({ conversations });
}

// ---------------------------------------------------------------------------
// POST /api/messaging/conversations — create a new conversation
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const rl = checkRateLimit(
    `msg-create:${auth.user_id}`,
    CREATE_RATE_LIMIT_MAX,
    CREATE_RATE_LIMIT_WINDOW_MS,
  );
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many conversations created. Please wait.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  let body: CreateConversationBody;
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

  if (!['dm', 'group', 'channel'].includes(body.type)) {
    return NextResponse.json(
      { error: 'type must be dm, group, or channel' },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  // Build creator participant
  const creator: Participant = {
    citizen_id: auth.user_id,
    display_name: auth.name,
    citizen_type: 'human',
    trust_tier: auth.trust ?? 'medium',
    role: 'owner',
    avatar_url: null,
    joined_at: now,
  };

  // Validate per conversation type
  if (body.type === 'dm') {
    if (
      !body.participant_ids ||
      body.participant_ids.length !== 1
    ) {
      return NextResponse.json(
        { error: 'DM requires exactly one target participant_id' },
        { status: 400 },
      );
    }
  }

  if (body.type === 'group') {
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group conversations require a name' },
        { status: 400 },
      );
    }
    if (!body.participant_ids || body.participant_ids.length < 1) {
      return NextResponse.json(
        { error: 'Group conversations require at least one other participant' },
        { status: 400 },
      );
    }
  }

  if (body.type === 'channel') {
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Channels require a name' },
        { status: 400 },
      );
    }
  }

  // Build participant list. For MVP, other participants get placeholder names
  // since we don't have a user lookup service yet.
  const participants: Participant[] = [creator];
  if (body.participant_ids) {
    for (const pid of body.participant_ids) {
      if (pid === auth.user_id) continue; // skip duplicating creator
      participants.push({
        citizen_id: pid,
        display_name: pid, // placeholder — no user lookup in MVP
        citizen_type: 'human',
        trust_tier: 'medium',
        role: body.type === 'channel' ? 'subscriber' : 'member',
        avatar_url: null,
        joined_at: now,
      });
    }
  }

  const conversation: Conversation = {
    id: crypto.randomUUID(),
    type: body.type,
    name: body.name?.trim() ?? null,
    description: body.description?.trim() ?? null,
    created_by: auth.user_id,
    created_at: now,
    updated_at: now,
    participants,
    last_message: null,
    unread_count: 0,
  };

  const created = createConversation(conversation);
  return NextResponse.json({ conversation: created }, { status: 201 });
}
