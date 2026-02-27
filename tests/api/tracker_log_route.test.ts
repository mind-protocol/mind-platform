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
// GET /api/tracker/log
// ---------------------------------------------------------------------------

describe('GET /api/tracker/log', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockGetUserIdFromRequest.mockReset();
  });

  it('forwards request to backend with user id header', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-42');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { entries: [{ id: 'e1', substance: 'Vitamin D' }] },
      status: 200,
    });

    const { GET } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log?days=7');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.entries).toHaveLength(1);
    expect(data.entries[0].substance).toBe('Vitamin D');

    // Verify backend was called with correct path and user header
    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/api/tracker/log?days=7',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-User-Id': 'user-42' }),
      }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-42');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });

  it('passes through backend error status', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-42');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { error: 'Not found' },
      status: 404,
    });

    const { GET } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log');
    const response = await GET(req);
    expect(response.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracker/log
// ---------------------------------------------------------------------------

describe('POST /api/tracker/log', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockGetUserIdFromRequest.mockReset();
  });

  it('posts log entry with user id injected', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-42');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { id: 'entry-1', substance: 'Melatonin', dose: '3mg' },
      status: 201,
    });

    const { POST } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log', {
      method: 'POST',
      body: JSON.stringify({ substance: 'Melatonin', dose: '3mg' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.substance).toBe('Melatonin');

    // Verify user_id is injected into the body
    const callArgs = mockManemusFetchJson.mock.calls[0];
    expect(callArgs[0]).toBe('/api/tracker/log');
    const sentBody = JSON.parse(callArgs[1].body);
    expect(sentBody.user_id).toBe('user-42');
    expect(sentBody.substance).toBe('Melatonin');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-42');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log', {
      method: 'POST',
      body: JSON.stringify({ substance: 'X' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});
