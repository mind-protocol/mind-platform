// DOCS: docs/registry/PATTERNS_Registry_Rules.md
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const L4_REGISTRY_URL = process.env.L4_REGISTRY_URL || 'http://localhost:8766';

export async function GET() {
  try {
    const response = await fetch(`${L4_REGISTRY_URL}/health`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: 'error', detail: `L4 backend returned ${response.status}` },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('L4 registry health check failed:', error);
    return NextResponse.json(
      { status: 'error', detail: 'L4 registry backend unreachable' },
      { status: 503 }
    );
  }
}
