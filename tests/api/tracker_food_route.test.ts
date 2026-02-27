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
    NextResponse: MockNextResponse,
  };
});

/** Simulate an authenticated session with the given user_id. */
function mockAuthenticated(userId: string) {
  mockRequireSession.mockResolvedValue({
    user_id: userId,
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
// GET /api/tracker/food
// ---------------------------------------------------------------------------

describe('GET /api/tracker/food', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
  });

  it('defaults to 7 days when no days param provided', async () => {
    mockAuthenticated('user-1');
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
    mockAuthenticated('user-1');
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
    mockAuthenticated('user-1');
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { GET } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food');
    const response = await GET(req);
    expect(response.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracker/food
// ---------------------------------------------------------------------------

describe('POST /api/tracker/food', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
  });

  it('posts food entry with user_id injected', async () => {
    mockAuthenticated('user-1');
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
    mockAuthenticated('user-1');
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

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/tracker/food/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/food', {
      method: 'POST',
      body: JSON.stringify({ food: 'Test' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
