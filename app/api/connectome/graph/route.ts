// DOCS: docs/connectome/graph_api/IMPLEMENTATION_Graph_API.md
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const graph = searchParams.get('graph') ?? 'seed';

  return NextResponse.json(
    {
      error: 'Connectome graph API is not wired to a graph backend yet.',
      graph,
      action: 'Connect app/api/connectome/graph/route.ts to the canonical graph source.',
    },
    { status: 501 },
  );
}
