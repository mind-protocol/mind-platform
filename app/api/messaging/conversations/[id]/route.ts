import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import {
  getConversation,
  updateConversation,
  removeParticipant,
  deleteConversation,
} from '@/lib/messaging-store';
import type { UpdateConversationBody } from '@/lib/messaging-types';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET /api/messaging/conversations/[id] — get conversation details
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

  return NextResponse.json({ conversation: conv });
}

// ---------------------------------------------------------------------------
// PATCH /api/messaging/conversations/[id] — update conversation
// ---------------------------------------------------------------------------

export async function PATCH(req: NextRequest, ctx: RouteContext) {
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

  // Only owner or admin can update
  const participant = conv.participants.find(
    (p) => p.citizen_id === auth.user_id,
  );
  if (!participant || !['owner', 'admin'].includes(participant.role)) {
    return NextResponse.json(
      { error: 'Only owner or admin can update this conversation' },
      { status: 403 },
    );
  }

  let body: UpdateConversationBody;
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

  const updated = updateConversation(id, {
    name: body.name,
    description: body.description,
  });

  if (!updated) {
    return NextResponse.json(
      { error: 'Conversation not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ conversation: updated });
}

// ---------------------------------------------------------------------------
// DELETE /api/messaging/conversations/[id] — leave or delete conversation
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

  const participant = conv.participants.find(
    (p) => p.citizen_id === auth.user_id,
  );
  if (!participant) {
    return NextResponse.json(
      { error: 'Not a member of this conversation' },
      { status: 403 },
    );
  }

  // Owner deletes the whole conversation; others just leave
  if (participant.role === 'owner') {
    deleteConversation(id);
    return NextResponse.json({ deleted: true });
  }

  // Non-owner: remove self from participants
  removeParticipant(id, auth.user_id);
  return NextResponse.json({ left: true });
}
