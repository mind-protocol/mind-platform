import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockManemusFetchJson = vi.fn();
vi.mock('@/lib/api-fetch', () => ({
  manemusFetchJson: (...args: unknown[]) => mockManemusFetchJson(...args),
}));

vi.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: URL;
    url: string;
    constructor(url: string) {
      this.url = url;
      this.nextUrl = new URL(url);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (data: unknown, init?: { status?: number }) => ({
        _data: data,
        _status: init?.status ?? 200,
        async json() { return data; },
        get status() { return this._status; },
      }),
    },
  };
});

/** Build a fake Request with JSON body. */
function makeRequest(url: string, body?: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// ---------------------------------------------------------------------------
// GET /api/garmin/status
// ---------------------------------------------------------------------------

describe('GET /api/garmin/status', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
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

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/garmin/verify/route');
    const req = makeRequest('http://localhost/api/garmin/verify', { code: '000' });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});
