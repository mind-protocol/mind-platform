/**
 * API Route: Get graph data
 *
 * Calls Python backend to get nodes and links for a graph.
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.CONNECTOME_BACKEND_URL || 'http://localhost:8765';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const graph = searchParams.get('graph') || 'seed';

  try {
    const response = await fetch(`${BACKEND_URL}/graph?graph=${encodeURIComponent(graph)}`);
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text || 'Backend error' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to connect to backend' },
      { status: 503 }
    );
  }
}
