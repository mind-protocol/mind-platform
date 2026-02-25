import { NextResponse } from 'next/server';
import { relayChatMessage } from '@/lib/messaging/chat_relay_service';
import {
  sendWhatsAppMessage,
  markWhatsAppMessageRead,
  type WhatsAppWebhookPayload,
} from '@/lib/messaging/whatsapp_cloud_api_client';

export const dynamic = 'force-dynamic';

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || '';

/**
 * GET /api/webhooks/whatsapp
 * Meta webhook verification challenge (required during setup).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge || '', { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * POST /api/webhooks/whatsapp
 * Receives WhatsApp messages, relays to MANEMUS/Claude, sends reply.
 */
export async function POST(req: Request) {
  let payload: WhatsAppWebhookPayload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // WhatsApp Cloud API always sends { object: "whatsapp_business_account" }
  if (payload.object !== 'whatsapp_business_account') {
    return NextResponse.json({ ok: true });
  }

  for (const entry of payload.entry || []) {
    for (const change of entry.changes) {
      const value = change.value;

      // Skip status updates (delivered, read, etc.)
      if (!value.messages) continue;

      for (const msg of value.messages) {
        // Only handle text messages for now
        if (msg.type !== 'text' || !msg.text?.body) continue;

        const senderPhone = msg.from;
        const text = msg.text.body;
        const contactName =
          value.contacts?.[0]?.profile.name || senderPhone;
        const threadId = `wa_${senderPhone}`;

        // Mark as read immediately
        markWhatsAppMessageRead(msg.id).catch(() => {});

        try {
          const result = await relayChatMessage(
            threadId,
            text,
            `wa:${contactName}`,
          );
          await sendWhatsAppMessage(senderPhone, result.text);
        } catch (err) {
          console.error('[whatsapp-webhook] relay error:', err);
          await sendWhatsAppMessage(
            senderPhone,
            "Désolé, une erreur s'est produite. Réessaie dans un instant.",
          );
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
