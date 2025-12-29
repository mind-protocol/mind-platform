import { NextRequest, NextResponse } from 'next/server';

const L4_API_URL = process.env.L4_API_URL || 'http://localhost:8766';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const l4Response = await fetch(
      `${L4_API_URL}/registry/orgs?${searchParams}`,
    );

    if (!l4Response.ok) {
      return NextResponse.json({
        items: [],
        count: 0,
        hasMore: false,
      });
    }

    const data = await l4Response.json();
    return NextResponse.json({
      items: data.items || data.orgs || [],
      count: data.count || data.total || 0,
      hasMore: data.hasMore || false,
    });
  } catch {
    return NextResponse.json({
      items: [],
      count: 0,
      hasMore: false,
    });
  }
}
