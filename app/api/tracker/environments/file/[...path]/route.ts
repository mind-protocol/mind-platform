import { NextRequest, NextResponse } from 'next/server';
import { manemusFetch } from '@/lib/api-fetch';

export const dynamic = 'force-dynamic';

/**
 * Proxy for environment files (panoramas, meshes, splats).
 * GET /api/tracker/environments/file/panoramas/filename.jpg
 *   -> proxies to MANEMUS_URL/uploads/environments/panoramas/filename.jpg
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const subpath = path.join('/');

    // Sanitize: only allow expected subpaths (panoramas/, meshes/, splats/, audio/)
    const allowed = /^(panoramas|meshes|splats|audio)\/[^/]+$/;
    if (!allowed.test(subpath)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const res = await manemusFetch(`/uploads/environments/${subpath}`);

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, immutable',
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
