/**
 * API Route: List available graphs
 *
 * Calls Python backend to get list of graph names.
 */

import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.CONNECTOME_BACKEND_URL || 'http://localhost:8765';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/graphs`);
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text || 'Backend error' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    // If backend not running, return a default
    return NextResponse.json({ graphs: ['seed'] });
  }
}
