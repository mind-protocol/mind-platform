import { NextRequest, NextResponse } from 'next/server';
import registryData from '@/data/registry.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const verification = searchParams.get('verification') || 'all';
  const statusParam = searchParams.get('status') || 'all';
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '500') || 500, 1), 500);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0') || 0, 0);

  const VALID_STATUSES = ['all', 'active', 'pending', 'suspended'];
  const status = VALID_STATUSES.includes(statusParam) ? statusParam : 'all';

  let items = registryData.orgs;

  if (verification !== 'all') {
    items = items.filter((o) => o.verification === verification);
  }
  if (status !== 'all') {
    items = items.filter((o) => o.status === status);
  }

  const total = items.length;
  const paged = items.slice(offset, offset + limit);

  return NextResponse.json({
    items: paged,
    count: total,
    hasMore: total > offset + limit,
  });
}
