import { NextResponse } from 'next/server';
import { relayChatMessage } from '@/lib/messaging/chat_relay_service';
import {
  sendTelegramMessage,
  setTelegramWebhook,
  type TelegramUpdate,
} from '@/lib/messaging/telegram_bot_api_client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/webhooks/telegram?setup=1
 * Registers the webhook with Telegram. Call once after deploy.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get('setup') === '1') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_BASE_URL not set' },
        { status: 500 },
      );
    }

    const protocol = baseUrl.startsWith('http') ? '' : 'https://';
    const webhookUrl = `${protocol}${baseUrl}/api/webhooks/telegram`;
    const result = await setTelegramWebhook(webhookUrl);
    return NextResponse.json({ ok: true, webhook_url: webhookUrl, result });
  }

  return NextResponse.json({ status: 'Telegram webhook endpoint active' });
}

/**
 * POST /api/webhooks/telegram
 * Receives Telegram updates, relays to MANEMUS/Claude, sends reply.
 */
export async function POST(req: Request) {
  let update: TelegramUpdate;

  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const message = update.message;
  if (!message?.text) {
    // Ignore non-text messages (stickers, photos, etc.)
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const userId = message.from.id;
  const username = message.from.username || message.from.first_name;
  const text = message.text;

  // Skip bot commands we don't handle
  if (text === '/start') {
    await sendTelegramMessage(
      chatId,
      "Salut ! Je suis Mind, l'agent IA de Mind Protocol. Envoie-moi un message et je te réponds.",
    );
    return NextResponse.json({ ok: true });
  }

  const threadId = `tg_${userId}`;

  try {
    const result = await relayChatMessage(threadId, text, `tg:${username}`);
    await sendTelegramMessage(chatId, result.text);
  } catch (err) {
    console.error('[telegram-webhook] relay error:', err);
    await sendTelegramMessage(
      chatId,
      "Désolé, une erreur s'est produite. Réessaie dans un instant.",
      '',
    );
  }

  return NextResponse.json({ ok: true });
}
