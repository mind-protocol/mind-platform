/**
 * Minimal Telegram Bot API client.
 * Uses raw fetch — no dependencies.
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

function apiUrl(method: string): string {
  return `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
}

export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  parseMode: 'Markdown' | 'HTML' | '' = 'Markdown',
): Promise<void> {
  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (parseMode) body.parse_mode = parseMode;

  const res = await fetch(apiUrl('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    // If Markdown parse fails, retry without formatting
    if (parseMode && err.includes("can't parse")) {
      return sendTelegramMessage(chatId, text, '');
    }
    throw new Error(`Telegram sendMessage failed ${res.status}: ${err}`);
  }
}

export async function setTelegramWebhook(webhookUrl: string): Promise<string> {
  const res = await fetch(apiUrl('setWebhook'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message'],
    }),
  });

  const data = await res.json();
  return data.description || (data.ok ? 'Webhook set' : 'Failed');
}

export async function deleteTelegramWebhook(): Promise<string> {
  const res = await fetch(apiUrl('deleteWebhook'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  const data = await res.json();
  return data.description || (data.ok ? 'Webhook deleted' : 'Failed');
}

/** Telegram Update object (subset we care about) */
export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: 'private' | 'group' | 'supergroup' | 'channel';
    };
    date: number;
    text?: string;
  };
}
