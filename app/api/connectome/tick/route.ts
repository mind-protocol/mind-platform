/**
 * API Route: Tick (next step)
 *
 * Returns the next event in stepper mode.
 * Currently returns end_of_script since there's no active script.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // For now, just return end of script - no active event stream
  return NextResponse.json({
    status: 'end_of_script',
    notes: 'No active event stream',
  });
}
