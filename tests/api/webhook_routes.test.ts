import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRelayChatMessage = vi.fn();
const mockSendTelegramMessage = vi.fn();
const mockSetTelegramWebhook = vi.fn();
const mockSendWhatsAppMessage = vi.fn();
const mockMarkWhatsAppMessageRead = vi.fn();

vi.mock('@/lib/messaging/chat_relay_service', () => ({
  relayChatMessage: (...args: unknown[]) => mockRelayChatMessage(...args),
}));

vi.mock('@/lib/messaging/telegram_bot_api_client', () => ({
  sendTelegramMessage: (...args: unknown[]) => mockSendTelegramMessage(...args),
  setTelegramWebhook: (...args: unknown[]) => mockSetTelegramWebhook(...args),
}));

vi.mock('@/lib/messaging/whatsapp_cloud_api_client', () => ({
  sendWhatsAppMessage: (...args: unknown[]) => mockSendWhatsAppMessage(...args),
  markWhatsAppMessageRead: (...args: unknown[]) => mockMarkWhatsAppMessageRead(...args),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      _data: data,
      _status: init?.status ?? 200,
      async json() { return data; },
      get status() { return this._status; },
    }),
  },
}));

// ---------------------------------------------------------------------------
// Telegram webhook
// ---------------------------------------------------------------------------

describe('GET /api/webhooks/telegram', () => {
  beforeEach(() => {
    vi.resetModules();
    mockSetTelegramWebhook.mockReset();
  });

  it('returns status message when no setup param', async () => {
    const { GET } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('Telegram webhook endpoint active');
  });

  it('returns 500 when setup=1 but no base URL configured', async () => {
    // Ensure env vars are not set
    const origBase = process.env.NEXT_PUBLIC_BASE_URL;
    const origVercel = process.env.VERCEL_URL;
    delete process.env.NEXT_PUBLIC_BASE_URL;
    delete process.env.VERCEL_URL;

    const { GET } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram?setup=1');
    const response = await GET(req);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('NEXT_PUBLIC_BASE_URL not set');

    // Restore env
    if (origBase !== undefined) process.env.NEXT_PUBLIC_BASE_URL = origBase;
    if (origVercel !== undefined) process.env.VERCEL_URL = origVercel;
  });
});

describe('POST /api/webhooks/telegram', () => {
  beforeEach(() => {
    vi.resetModules();
    mockRelayChatMessage.mockReset();
    mockSendTelegramMessage.mockReset();
    // Ensure no secret is set (all requests pass)
    delete process.env.TELEGRAM_WEBHOOK_SECRET;
  });

  it('returns 401 when secret token is wrong', async () => {
    process.env.TELEGRAM_WEBHOOK_SECRET = 'correct-secret';

    const { POST } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-bot-api-secret-token': 'wrong-secret',
      },
      body: JSON.stringify({ update_id: 1 }),
    });
    const response = await POST(req);
    expect(response.status).toBe(401);

    delete process.env.TELEGRAM_WEBHOOK_SECRET;
  });

  it('returns 400 for invalid JSON', async () => {
    const { POST } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json{{{',
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid JSON');
  });

  it('ignores non-text messages', async () => {
    const { POST } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        update_id: 1,
        message: {
          message_id: 1,
          from: { id: 100, is_bot: false, first_name: 'Test' },
          chat: { id: 100, type: 'private' },
          date: Date.now(),
          // no text field — e.g. sticker
        },
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(mockRelayChatMessage).not.toHaveBeenCalled();
  });

  it('handles /start command with welcome message', async () => {
    mockSendTelegramMessage.mockResolvedValueOnce(undefined);

    const { POST } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        update_id: 2,
        message: {
          message_id: 2,
          from: { id: 200, is_bot: false, first_name: 'Alice' },
          chat: { id: 200, type: 'private' },
          date: Date.now(),
          text: '/start',
        },
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockSendTelegramMessage).toHaveBeenCalledWith(
      200,
      expect.stringContaining('Mind'),
    );
    expect(mockRelayChatMessage).not.toHaveBeenCalled();
  });

  it('relays text message and sends reply', async () => {
    mockRelayChatMessage.mockResolvedValueOnce({ text: 'Bonjour!', source: 'mind-home' });
    mockSendTelegramMessage.mockResolvedValueOnce(undefined);

    const { POST } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        update_id: 3,
        message: {
          message_id: 3,
          from: { id: 300, is_bot: false, first_name: 'Bob', username: 'bob123' },
          chat: { id: 300, type: 'private' },
          date: Date.now(),
          text: 'Hello',
        },
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockRelayChatMessage).toHaveBeenCalledWith('tg_300', 'Hello', 'tg:bob123');
    expect(mockSendTelegramMessage).toHaveBeenCalledWith(300, 'Bonjour!');
  });

  it('sends error message when relay fails', async () => {
    mockRelayChatMessage.mockRejectedValueOnce(new Error('backend down'));
    mockSendTelegramMessage.mockResolvedValueOnce(undefined);

    const { POST } = await import('@/app/api/webhooks/telegram/route');
    const req = new Request('http://localhost/api/webhooks/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        update_id: 4,
        message: {
          message_id: 4,
          from: { id: 400, is_bot: false, first_name: 'Eve' },
          chat: { id: 400, type: 'private' },
          date: Date.now(),
          text: 'Test',
        },
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockSendTelegramMessage).toHaveBeenCalledWith(
      400,
      expect.stringContaining('erreur'),
      '',
    );
  });
});

// ---------------------------------------------------------------------------
// WhatsApp webhook
// ---------------------------------------------------------------------------

describe('GET /api/webhooks/whatsapp', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns 403 when verification token is wrong', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'correct-token';

    const { GET } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request(
      'http://localhost/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=ch123',
    );
    const response = await GET(req);
    expect(response.status).toBe(403);

    delete process.env.WHATSAPP_VERIFY_TOKEN;
  });

  it('returns challenge when verification succeeds', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'my-token';

    const { GET } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request(
      'http://localhost/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=my-token&hub.challenge=challenge-abc',
    );
    const response = await GET(req);
    expect(response.status).toBe(200);

    delete process.env.WHATSAPP_VERIFY_TOKEN;
  });

  it('returns 403 when mode is not subscribe', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'my-token';

    const { GET } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request(
      'http://localhost/api/webhooks/whatsapp?hub.mode=unsubscribe&hub.verify_token=my-token&hub.challenge=ch',
    );
    const response = await GET(req);
    expect(response.status).toBe(403);

    delete process.env.WHATSAPP_VERIFY_TOKEN;
  });
});

describe('POST /api/webhooks/whatsapp', () => {
  beforeEach(() => {
    vi.resetModules();
    mockRelayChatMessage.mockReset();
    mockSendWhatsAppMessage.mockReset();
    mockMarkWhatsAppMessageRead.mockReset();
    // No HMAC secret — skip verification
    delete process.env.WHATSAPP_WEBHOOK_SECRET;
    delete process.env.WHATSAPP_APP_SECRET;
  });

  it('ignores non-whatsapp payloads', async () => {
    const { POST } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ object: 'instagram' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(mockRelayChatMessage).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid JSON', async () => {
    const { POST } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '<<<invalid>>>',
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('relays text message and sends reply', async () => {
    mockRelayChatMessage.mockResolvedValueOnce({ text: 'Salut!', source: 'mind-home' });
    mockSendWhatsAppMessage.mockResolvedValueOnce(undefined);
    mockMarkWhatsAppMessageRead.mockResolvedValueOnce(undefined);

    const { POST } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
          id: 'e1',
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+1234', phone_number_id: 'pn1' },
              contacts: [{ profile: { name: 'Charlie' }, wa_id: '+5551234' }],
              messages: [{
                from: '+5551234',
                id: 'msg1',
                timestamp: '1700000000',
                type: 'text',
                text: { body: 'Hello!' },
              }],
            },
            field: 'messages',
          }],
        }],
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockMarkWhatsAppMessageRead).toHaveBeenCalledWith('msg1');
    expect(mockRelayChatMessage).toHaveBeenCalledWith('wa_+5551234', 'Hello!', 'wa:Charlie');
    expect(mockSendWhatsAppMessage).toHaveBeenCalledWith('+5551234', 'Salut!');
  });

  it('skips non-text messages', async () => {
    const { POST } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
          id: 'e1',
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+1234', phone_number_id: 'pn1' },
              messages: [{
                from: '+5551234',
                id: 'msg2',
                timestamp: '1700000000',
                type: 'image',
                // no text field
              }],
            },
            field: 'messages',
          }],
        }],
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockRelayChatMessage).not.toHaveBeenCalled();
  });

  it('skips status updates (no messages array)', async () => {
    const { POST } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
          id: 'e1',
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+1234', phone_number_id: 'pn1' },
              statuses: [{ id: 's1', status: 'delivered', timestamp: '1700000000', recipient_id: '+555' }],
            },
            field: 'messages',
          }],
        }],
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockRelayChatMessage).not.toHaveBeenCalled();
  });

  it('sends error message when relay fails', async () => {
    mockRelayChatMessage.mockRejectedValueOnce(new Error('backend down'));
    mockSendWhatsAppMessage.mockResolvedValueOnce(undefined);
    mockMarkWhatsAppMessageRead.mockResolvedValueOnce(undefined);

    const { POST } = await import('@/app/api/webhooks/whatsapp/route');
    const req = new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        object: 'whatsapp_business_account',
        entry: [{
          id: 'e1',
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '+1234', phone_number_id: 'pn1' },
              contacts: [{ profile: { name: 'Dan' }, wa_id: '+5559999' }],
              messages: [{
                from: '+5559999',
                id: 'msg3',
                timestamp: '1700000000',
                type: 'text',
                text: { body: 'Test' },
              }],
            },
            field: 'messages',
          }],
        }],
      }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(mockSendWhatsAppMessage).toHaveBeenCalledWith(
      '+5559999',
      expect.stringContaining('erreur'),
    );
  });
});
