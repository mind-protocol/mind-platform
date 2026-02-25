/**
 * Meta WhatsApp Cloud API client.
 * Uses the official Cloud API (graph.facebook.com).
 */

const WA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WA_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WA_API_VERSION = 'v21.0';

function apiUrl(path: string): string {
  return `https://graph.facebook.com/${WA_API_VERSION}/${path}`;
}

export async function sendWhatsAppMessage(
  recipientPhone: string,
  text: string,
): Promise<void> {
  const res = await fetch(apiUrl(`${WA_PHONE_NUMBER_ID}/messages`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientPhone,
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp sendMessage failed ${res.status}: ${err}`);
  }
}

export async function markWhatsAppMessageRead(messageId: string): Promise<void> {
  await fetch(apiUrl(`${WA_PHONE_NUMBER_ID}/messages`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }),
  });
}

/** Subset of the WhatsApp Cloud API webhook payload */
export interface WhatsAppWebhookPayload {
  object: string;
  entry?: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}
