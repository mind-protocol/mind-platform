import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Shared mock classes
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
// GET /api/wallet/balance
// ---------------------------------------------------------------------------

describe('GET /api/wallet/balance', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
  });

  it('returns 400 when address is missing', async () => {
    const { GET } = await import('@/app/api/wallet/balance/route');
    const req = new Request('http://localhost/api/wallet/balance');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('address required');
  });

  it('returns balance from backend', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: { address: 'abc123', balance: 1000, token: 'MIND' },
      status: 200,
    });

    const { GET } = await import('@/app/api/wallet/balance/route');
    const req = new Request('http://localhost/api/wallet/balance?address=abc123');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.balance).toBe(1000);
    expect(data.address).toBe('abc123');

    expect(mockMindFetchJson).toHaveBeenCalledWith('/wallet/balance/abc123');
  });

  it('encodes address in URL', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: { balance: 0 },
      status: 200,
    });

    const { GET } = await import('@/app/api/wallet/balance/route');
    const req = new Request('http://localhost/api/wallet/balance?address=abc%2F123');
    const response = await GET(req);
    expect(response.status).toBe(200);

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      expect.stringContaining('abc'),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/wallet/balance/route');
    const req = new Request('http://localhost/api/wallet/balance?address=abc123');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// GET /api/wallet/price
// ---------------------------------------------------------------------------

describe('GET /api/wallet/price', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
  });

  it('returns price data from backend', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: { price_usd: 0.042, market_cap: 42000 },
      status: 200,
    });

    const { GET } = await import('@/app/api/wallet/price/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.price_usd).toBe(0.042);

    expect(mockMindFetchJson).toHaveBeenCalledWith('/wallet/price');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/wallet/price/route');
    const response = await GET();
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// POST /api/wallet/transfer/prepare
// ---------------------------------------------------------------------------

describe('POST /api/wallet/transfer/prepare', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/wallet/transfer/prepare/route');
    const req = makeNextRequest('http://localhost/api/wallet/transfer/prepare', {
      sender: 'a',
      recipient: 'b',
      amount: 100,
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 400 when sender is missing', async () => {
    const { POST } = await import('@/app/api/wallet/transfer/prepare/route');
    const req = makeNextRequest('http://localhost/api/wallet/transfer/prepare', {
      recipient: 'b',
      amount: 100,
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('sender, recipient, and amount required');
  });

  it('returns 400 when recipient is missing', async () => {
    const { POST } = await import('@/app/api/wallet/transfer/prepare/route');
    const req = makeNextRequest('http://localhost/api/wallet/transfer/prepare', {
      sender: 'a',
      amount: 100,
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('sender, recipient, and amount required');
  });

  it('returns 400 when amount is missing', async () => {
    const { POST } = await import('@/app/api/wallet/transfer/prepare/route');
    const req = makeNextRequest('http://localhost/api/wallet/transfer/prepare', {
      sender: 'a',
      recipient: 'b',
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('sender, recipient, and amount required');
  });

  it('prepares transfer via backend', async () => {
    mockMindFetchJson.mockResolvedValueOnce({
      data: { tx_id: 'tx123', serialized: 'base64...' },
      status: 200,
    });

    const { POST } = await import('@/app/api/wallet/transfer/prepare/route');
    const req = makeNextRequest('http://localhost/api/wallet/transfer/prepare', {
      sender: 'addr_a',
      recipient: 'addr_b',
      amount: 50,
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.tx_id).toBe('tx123');

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      '/wallet/transfer/prepare',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { POST } = await import('@/app/api/wallet/transfer/prepare/route');
    const req = makeNextRequest('http://localhost/api/wallet/transfer/prepare', {
      sender: 'a',
      recipient: 'b',
      amount: 1,
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});
