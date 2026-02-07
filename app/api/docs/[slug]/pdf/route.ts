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

  // Return markdown as downloadable file (PDF generation can be added later)
  const filename = `${doc.slug}-v${doc.version}.md`;

  return new NextResponse(doc.rawMarkdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
