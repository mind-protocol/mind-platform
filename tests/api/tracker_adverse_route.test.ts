import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockManemusFetchJson = vi.fn();
vi.mock('@/lib/api-fetch', () => ({
  manemusFetchJson: (...args: unknown[]) => mockManemusFetchJson(...args),
}));

const mockGetUserIdFromRequest = vi.fn();
vi.mock('@/lib/auth', () => ({
  getUserIdFromRequest: (...args: unknown[]) => mockGetUserIdFromRequest(...args),
}));

vi.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: URL;
    url: string;
    _body: unknown;
    constructor(url: string, init?: { method?: string; body?: string }) {
      this.url = url;
      this.nextUrl = new URL(url);
      if (init?.body) this._body = JSON.parse(init.body);
    }
    async json() { return this._body; }
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

// ---------------------------------------------------------------------------
// GET /api/tracker/adverse
// ---------------------------------------------------------------------------

describe('GET /api/tracker/adverse', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockGetUserIdFromRequest.mockReset();
  });

  it('forwards request to backend with user id', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-5');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { events: [{ id: 'a1', symptom: 'Headache', severity: 3 }] },
      status: 200,
    });

    const { GET } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.events).toHaveLength(1);
    expect(data.events[0].symptom).toBe('Headache');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/api/tracker/adverse',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-User-Id': 'user-5' }),
      }),
    );
  });

  it('passes query params through to backend', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-5');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { events: [] },
      status: 200,
    });

    const { GET } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse?days=14&severity=high');
    const response = await GET(req);
    expect(response.status).toBe(200);

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/api/tracker/adverse?days=14&severity=high',
      expect.anything(),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-5');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const { GET } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracker/adverse
// ---------------------------------------------------------------------------

describe('POST /api/tracker/adverse', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockGetUserIdFromRequest.mockReset();
  });

  it('posts adverse event with user_id injected', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-5');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { id: 'a2', symptom: 'Nausea', severity: 2 },
      status: 201,
    });

    const { POST } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse', {
      method: 'POST',
      body: JSON.stringify({ symptom: 'Nausea', severity: 2 }),
    });
    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.symptom).toBe('Nausea');

    const sentBody = JSON.parse(mockManemusFetchJson.mock.calls[0][1].body);
    expect(sentBody.user_id).toBe('user-5');
    expect(sentBody.symptom).toBe('Nausea');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-5');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse', {
      method: 'POST',
      body: JSON.stringify({ symptom: 'Test' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});
