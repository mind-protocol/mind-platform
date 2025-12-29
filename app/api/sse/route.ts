/**
 * API Route: Server-Sent Events for health telemetry
 *
 * Streams health updates to connected clients.
 */

import { NextRequest } from 'next/server';

// Force dynamic - SSE cannot be statically generated
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.CONNECTOME_BACKEND_URL || 'http://localhost:8765';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connectome_health\ndata: ${JSON.stringify({
          node_count: 0,
          link_count: 0,
          total_energy: 0,
          active_subentities: 0,
        })}\n\n`)
      );

      // Poll backend for health every 5 seconds
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/health`);
          if (response.ok) {
            const data = await response.json();
            controller.enqueue(
              encoder.encode(`event: connectome_health\ndata: ${JSON.stringify(data)}\n\n`)
            );
          }
        } catch {
          // Backend not available, continue with empty health
        }
      }, 5000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
