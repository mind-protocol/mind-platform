import { NextRequest, NextResponse } from 'next/server';
import { getRawMarkdown } from '@/lib/blog';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const md = getRawMarkdown(params.slug);
  if (!md) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
