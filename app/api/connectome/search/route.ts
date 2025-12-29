/**
 * API Route: Semantic search
 *
 * Calls Python backend to search for nodes by query.
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.CONNECTOME_BACKEND_URL || 'http://localhost:8765';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';
  const threshold = searchParams.get('threshold') || '0.3';
  const hops = searchParams.get('hops') || '1';
  const graph = searchParams.get('graph') || 'seed';

  if (!q.trim()) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const url = `${BACKEND_URL}/search?q=${encodeURIComponent(q)}&threshold=${threshold}&hops=${hops}&graph=${encodeURIComponent(graph)}`;
    const response = await fetch(url);
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
