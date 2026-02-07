import { NextResponse } from 'next/server';
import { getDoc } from '@/lib/docs';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const doc = await getDoc(params.slug);

  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(doc);
}
