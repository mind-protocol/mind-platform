// DOCS: docs/registry/ALGORITHM_Registry_Flows.md
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const L4_REGISTRY_URL = process.env.L4_REGISTRY_URL || 'http://localhost:8766';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams();

  searchParams.forEach((value, key) => {
    params.set(key, value);
  });

  if (!params.has('limit')) params.set('limit', '500');
  if (!params.has('offset')) params.set('offset', '0');

  try {
    const response = await fetch(
      `${L4_REGISTRY_URL}/registry/orgs?${params.toString()}`,
      {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `L4 backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('L4 registry proxy error (orgs):', error);
    return NextResponse.json(
      { error: 'L4 registry backend unavailable' },
      { status: 503 }
    );
  }
}
