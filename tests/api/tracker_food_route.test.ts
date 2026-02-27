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
// GET /api/tracker/food
// ---------------------------------------------------------------------------

describe('GET /api/tracker/food', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockGetUserIdFromRequest.mockReset();
  });

  it('defaults to 7 days when no days param provided', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-1');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { entries: [] },
      status: 200,
    });

    const { GET } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food');
    const response = await GET(req);
    expect(response.status).toBe(200);

    // Should call backend with days=7 default
    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/api/tracker/food?days=7',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-User-Id': 'user-1' }),
      }),
    );
  });

  it('passes custom days param to backend', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-1');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { entries: [{ id: 'f1', food: 'Apple', calories: 95 }] },
      status: 200,
    });

    const { GET } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food?days=30');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.entries).toHaveLength(1);

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/api/tracker/food?days=30',
      expect.anything(),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-1');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracker/food
// ---------------------------------------------------------------------------

describe('POST /api/tracker/food', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockGetUserIdFromRequest.mockReset();
  });

  it('posts food entry with user_id injected', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-1');
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { id: 'f2', food: 'Banana', calories: 105 },
      status: 201,
    });

    const { POST } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food', {
      method: 'POST',
      body: JSON.stringify({ food: 'Banana', calories: 105 }),
    });
    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.food).toBe('Banana');

    // Verify user_id is injected into body
    const sentBody = JSON.parse(mockManemusFetchJson.mock.calls[0][1].body);
    expect(sentBody.user_id).toBe('user-1');
    expect(sentBody.food).toBe('Banana');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockGetUserIdFromRequest.mockResolvedValueOnce('user-1');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { POST } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food', {
      method: 'POST',
      body: JSON.stringify({ food: 'Test' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});
