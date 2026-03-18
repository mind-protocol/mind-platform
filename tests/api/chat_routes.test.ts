import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Shared mock classes (defined before vi.mock so they can be referenced)
// ---------------------------------------------------------------------------

class MockNextResponse {
  _data: unknown;
  _status: number;
  constructor(data: unknown, status: number) {
    this._data = data;
    this._status = status;
  }
  async json() { return this._data; }
  get status() { return this._status; }

  static json(data: unknown, init?: { status?: number }) {
    return new MockNextResponse(data, init?.status ?? 200);
  }
}

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockMindFetchJson = vi.fn();
vi.mock('@/lib/api-fetch', () => ({
  mindFetchJson: (...args: unknown[]) => mockMindFetchJson(...args),
}));

const mockRequireSession = vi.fn();
vi.mock('@/lib/auth', () => ({
  requireSession: (...args: unknown[]) => mockRequireSession(...args),
}));

vi.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: URL;
    url: string;
    cookies: { get: () => undefined };
    headers: Headers;
    method: string;
    _body: string | undefined;

    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.nextUrl = new URL(url);
      this.cookies = { get: () => undefined };
      this.headers = new Headers(init?.headers);
      this.method = init?.method ?? 'GET';
      this._body = init?.body as string | undefined;
    }

    async json() {
      return this._body ? JSON.parse(this._body) : {};
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeNextRequest(url: string, body?: unknown) {
  const { NextRequest } = require('next/server');
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function makeGetRequest(url: string) {
  const { NextRequest } = require('next/server');
  return new NextRequest(url);
}

function mockAuthenticated() {
  mockRequireSession.mockResolvedValue({
    user_id: 'test-user',
    name: 'Test',
    trust: 'citizen',
  });
}

function mockUnauthenticated() {
  mockRequireSession.mockResolvedValue(
    MockNextResponse.json({ error: 'Authentication required' }, { status: 401 })
  );
}

// ---------------------------------------------------------------------------
// POST /api/chat/send
// ---------------------------------------------------------------------------

describe('POST /api/chat/send', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/chat/send/route');
    const req = makeNextRequest('http://localhost/api/chat/send', {
      message: 'hello',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('forwards message to backend with user_id', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: { id: 'msg1', text: 'reply' },
      status: 200,
    });

    const { POST } = await import('@/app/api/chat/send/route');
    const req = makeNextRequest('http://localhost/api/chat/send', {
      message: 'hello',
      thread_id: 't1',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe('msg1');

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      '/chat/send',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-User-Id': 'test-user' }),
      }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { POST } = await import('@/app/api/chat/send/route');
    const req = makeNextRequest('http://localhost/api/chat/send', {
      message: 'hello',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// GET /api/chat/messages
// ---------------------------------------------------------------------------

describe('GET /api/chat/messages', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { GET } = await import('@/app/api/chat/messages/route');
    const req = makeGetRequest('http://localhost/api/chat/messages?thread_id=t1');
    const response = await GET(req);
    expect(response.status).toBe(401);
  });

  it('returns 400 when thread_id is missing', async () => {
    const { GET } = await import('@/app/api/chat/messages/route');
    const req = makeGetRequest('http://localhost/api/chat/messages');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('thread_id required');
  });

  it('returns messages from backend', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: [{ id: 'm1', text: 'hi' }, { id: 'm2', text: 'hello' }],
      status: 200,
    });

    const { GET } = await import('@/app/api/chat/messages/route');
    const req = makeGetRequest('http://localhost/api/chat/messages?thread_id=t1');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(2);
    expect(data[0].id).toBe('m1');
  });

  it('passes since param to backend', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: [],
      status: 200,
    });

    const { GET } = await import('@/app/api/chat/messages/route');
    const req = makeGetRequest('http://localhost/api/chat/messages?thread_id=t1&since=2026-01-01');
    const response = await GET(req);
    expect(response.status).toBe(200);

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      expect.stringContaining('since='),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/chat/messages/route');
    const req = makeGetRequest('http://localhost/api/chat/messages?thread_id=t1');
    const response = await GET(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/chat/tts
// ---------------------------------------------------------------------------

describe('POST /api/chat/tts', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/chat/tts/route');
    const req = makeNextRequest('http://localhost/api/chat/tts', {
      text: 'Bonjour',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('forwards TTS request to backend', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: { audio_url: 'https://example.com/audio.mp3' },
      status: 200,
    });

    const { POST } = await import('@/app/api/chat/tts/route');
    const req = makeNextRequest('http://localhost/api/chat/tts', {
      text: 'Bonjour le monde',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.audio_url).toBeDefined();

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      '/chat/tts',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { POST } = await import('@/app/api/chat/tts/route');
    const req = makeNextRequest('http://localhost/api/chat/tts', {
      text: 'test',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});
