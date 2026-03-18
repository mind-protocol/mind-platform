import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import {
  getConversation,
  addParticipants,
  removeParticipant,
} from '@/lib/messaging-store';
import type {
  AddMembersBody,
  RemoveMemberBody,
  Participant,
} from '@/lib/messaging-types';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET /api/messaging/conversations/[id]/members — list members
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

  return NextResponse.json({ members: conv.participants });
}

// ---------------------------------------------------------------------------
// POST /api/messaging/conversations/[id]/members — add member(s)
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest, ctx: RouteContext) {
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

  // Only owner or admin can add members
  const caller = conv.participants.find(
    (p) => p.citizen_id === auth.user_id,
  );
  if (!caller || !['owner', 'admin'].includes(caller.role)) {
    return NextResponse.json(
      { error: 'Only owner or admin can add members' },
      { status: 403 },
    );
  }

  if (conv.type === 'dm') {
    return NextResponse.json(
      { error: 'Cannot add members to a DM conversation' },
      { status: 400 },
    );
  }

  let body: AddMembersBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  if (!body?.citizen_ids || !Array.isArray(body.citizen_ids) || body.citizen_ids.length === 0) {
    return NextResponse.json(
      { error: 'citizen_ids must be a non-empty array of strings' },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const newParticipants: Participant[] = body.citizen_ids.map((cid) => ({
    citizen_id: cid,
    display_name: cid, // placeholder — no user lookup in MVP
    citizen_type: 'human' as const,
    trust_tier: 'medium',
    role: conv.type === 'channel' ? ('subscriber' as const) : ('member' as const),
    avatar_url: null,
    joined_at: now,
  }));

  const updated = addParticipants(id, newParticipants);
  if (!updated) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ members: updated.participants });
}

// ---------------------------------------------------------------------------
// DELETE /api/messaging/conversations/[id]/members — remove a member
// ---------------------------------------------------------------------------

export async function DELETE(req: NextRequest, ctx: RouteContext) {
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

  let body: RemoveMemberBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  if (!body?.citizen_id || typeof body.citizen_id !== 'string') {
    return NextResponse.json(
      { error: 'citizen_id is required' },
      { status: 400 },
    );
  }

  if (conv.type === 'dm') {
    return NextResponse.json(
      { error: 'Cannot remove members from a DM conversation' },
      { status: 400 },
    );
  }

  // Owner/admin can remove anyone; members can only remove themselves
  const caller = conv.participants.find(
    (p) => p.citizen_id === auth.user_id,
  );
  if (!caller) {
    return NextResponse.json(
      { error: 'Not a member of this conversation' },
      { status: 403 },
    );
  }

  const isSelfRemoval = body.citizen_id === auth.user_id;
  if (!isSelfRemoval && !['owner', 'admin'].includes(caller.role)) {
    return NextResponse.json(
      { error: 'Only owner or admin can remove other members' },
      { status: 403 },
    );
  }

  // Cannot remove the owner
  const target = conv.participants.find(
    (p) => p.citizen_id === body.citizen_id,
  );
  if (target?.role === 'owner' && !isSelfRemoval) {
    return NextResponse.json(
      { error: 'Cannot remove the conversation owner' },
      { status: 400 },
    );
  }

  const updated = removeParticipant(id, body.citizen_id);
  if (!updated) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ members: updated.participants });
}
