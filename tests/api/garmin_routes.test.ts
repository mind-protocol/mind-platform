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

const mockManemusFetchJson = vi.fn();
vi.mock('@/lib/api-fetch', () => ({
  manemusFetchJson: (...args: unknown[]) => mockManemusFetchJson(...args),
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

/** Build a fake NextRequest with JSON body. */
function makeRequest(url: string, body?: unknown) {
  const { NextRequest } = require('next/server');
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// ---------------------------------------------------------------------------
// Helpers: default mock to simulate authenticated session
// ---------------------------------------------------------------------------

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
// GET /api/garmin/status
// ---------------------------------------------------------------------------

describe('GET /api/garmin/status', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 400 when user_id is missing', async () => {
    const { GET } = await import('@/app/api/garmin/status/route');
    const req = new Request('http://localhost/api/garmin/status');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('user_id required');
  });

  it('returns garmin status from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { linked: true, last_sync: '2026-02-27T10:00:00Z' },
      status: 200,
    });

    const { GET } = await import('@/app/api/garmin/status/route');
    const req = new Request('http://localhost/api/garmin/status?user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.linked).toBe(true);

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/garmin/auth/status/u1',
    );
  });

  it('encodes user_id in the URL', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { linked: false },
      status: 200,
    });

    const { GET } = await import('@/app/api/garmin/status/route');
    const req = new Request('http://localhost/api/garmin/status?user_id=user%40email.com');
    const response = await GET(req);
    expect(response.status).toBe(200);

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/garmin/auth/status/user%40email.com',
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/garmin/status/route');
    const req = new Request('http://localhost/api/garmin/status?user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// POST /api/garmin/link
// ---------------------------------------------------------------------------

describe('POST /api/garmin/link', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('forwards credentials to backend init endpoint', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'mfa_required', session_id: 's1' },
      status: 200,
    });

    const { POST } = await import('@/app/api/garmin/link/route');
    const req = makeRequest('http://localhost/api/garmin/link', {
      email: 'gar@test.com',
      password: 'pw',
      user_id: 'u1',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('mfa_required');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/garmin/auth/init',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/garmin/link/route');
    const req = makeRequest('http://localhost/api/garmin/link', {
      email: 'x',
      password: 'y',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/garmin/link/route');
    const req = makeRequest('http://localhost/api/garmin/link', {
      email: 'x',
      password: 'y',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/garmin/link/verify
// ---------------------------------------------------------------------------

describe('POST /api/garmin/link/verify', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('forwards MFA code to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'linked', user_id: 'u1' },
      status: 200,
    });

    const { POST } = await import('@/app/api/garmin/link/verify/route');
    const req = makeRequest('http://localhost/api/garmin/link/verify', {
      session_id: 's1',
      mfa_code: '123456',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('linked');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/garmin/link/verify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/garmin/link/verify/route');
    const req = makeRequest('http://localhost/api/garmin/link/verify', {
      session_id: 's1',
      mfa_code: '000000',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/garmin/link/verify/route');
    const req = makeRequest('http://localhost/api/garmin/link/verify', {
      session_id: 's1',
      mfa_code: '000000',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/garmin/link/complete
// ---------------------------------------------------------------------------

describe('POST /api/garmin/link/complete', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('forwards completion request to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'complete', message: 'Garmin linked successfully' },
      status: 200,
    });

    const { POST } = await import('@/app/api/garmin/link/complete/route');
    const req = makeRequest('http://localhost/api/garmin/link/complete', {
      session_id: 's1',
      user_id: 'u1',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('complete');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/garmin/link/complete',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/garmin/link/complete/route');
    const req = makeRequest('http://localhost/api/garmin/link/complete', {});
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const { POST } = await import('@/app/api/garmin/link/complete/route');
    const req = makeRequest('http://localhost/api/garmin/link/complete', {});
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/garmin/verify (MFA)
// ---------------------------------------------------------------------------

describe('POST /api/garmin/verify', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('forwards MFA verification to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { verified: true },
      status: 200,
    });

    const { POST } = await import('@/app/api/garmin/verify/route');
    const req = makeRequest('http://localhost/api/garmin/verify', {
      user_id: 'u1',
      code: '654321',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.verified).toBe(true);

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/garmin/auth/mfa',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/garmin/verify/route');
    const req = makeRequest('http://localhost/api/garmin/verify', { code: '000' });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/garmin/verify/route');
    const req = makeRequest('http://localhost/api/garmin/verify', { code: '000' });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});
