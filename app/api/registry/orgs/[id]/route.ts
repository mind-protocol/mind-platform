// DOCS: docs/registry/ALGORITHM_Registry_Flows.md
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const L4_REGISTRY_URL = process.env.L4_REGISTRY_URL || 'http://localhost:8766';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${L4_REGISTRY_URL}/registry/orgs/${encodeURIComponent(id)}`,
      {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (response.status === 404) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `L4 backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('L4 registry proxy error (org detail):', error);
    return NextResponse.json(
      { error: 'L4 registry backend unavailable' },
      { status: 503 }
    );
  }
}
