import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { searchMessages } from '@/lib/messaging-store';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET /api/messaging/search — search messages across conversations
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const auth = await requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const query = url.searchParams.get('q');
  const conversationId = url.searchParams.get('conversation_id') ?? undefined;

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'q query parameter is required' },
      { status: 400 },
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      { error: 'Search query too long (max 200 characters)' },
      { status: 400 },
    );
  }

  const results = searchMessages(auth.user_id, query.trim(), conversationId);

  return NextResponse.json({ results });
}
