import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MANEMUS_URL = process.env.MANEMUS_URL || 'https://trusted-magpie-social.ngrok-free.app';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const filename = path.join('/').replace(/[^a-zA-Z0-9._-]/g, '');
  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  try {
    const res = await fetch(`${MANEMUS_URL}/uploads/food/${filename}`, {
      headers: { 'ngrok-skip-browser-warning': '1' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
