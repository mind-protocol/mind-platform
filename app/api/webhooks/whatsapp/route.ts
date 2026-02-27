import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { relayChatMessage } from '@/lib/messaging/chat_relay_service';
import {
  sendWhatsAppMessage,
  markWhatsAppMessageRead,
  type WhatsAppWebhookPayload,
} from '@/lib/messaging/whatsapp_cloud_api_client';

export const dynamic = 'force-dynamic';

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || '';
const WHATSAPP_APP_SECRET =
  process.env.WHATSAPP_WEBHOOK_SECRET || process.env.WHATSAPP_APP_SECRET || '';

/**
 * Verify the X-Hub-Signature-256 HMAC header sent by Meta on every POST.
 * Returns the parsed body on success, or null if verification fails.
 */
function verifyWhatsAppSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!WHATSAPP_APP_SECRET) {
    console.warn(
      '[whatsapp-webhook] WHATSAPP_WEBHOOK_SECRET / WHATSAPP_APP_SECRET not set — skipping signature verification',
    );
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  // Header format: "sha256=<hex>"
  const expected = signatureHeader.startsWith('sha256=')
    ? signatureHeader.slice(7)
    : signatureHeader;

  const computed = createHmac('sha256', WHATSAPP_APP_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(expected, 'hex'),
    );
  } catch {
    return false;
  }
}

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
  // Read raw body for HMAC verification before parsing JSON
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Cannot read body' }, { status: 400 });
  }

  // Verify X-Hub-Signature-256 HMAC
  const signatureHeader = req.headers.get('x-hub-signature-256');
  if (!verifyWhatsAppSignature(rawBody, signatureHeader)) {
    console.error('[whatsapp-webhook] Signature verification failed');
    return NextResponse.json(
      { error: 'Signature verification failed' },
      { status: 401 },
    );
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
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
