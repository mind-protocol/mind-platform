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
// GET /api/tracker/log
// ---------------------------------------------------------------------------

describe('GET /api/tracker/log', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
  });

  it('forwards request to backend with user id header', async () => {
    mockAuthenticated('user-42');
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
    mockAuthenticated('user-42');
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
    mockAuthenticated('user-42');
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

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { GET } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log');
    const response = await GET(req);
    expect(response.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracker/log
// ---------------------------------------------------------------------------

describe('POST /api/tracker/log', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
  });

  it('posts log entry with user id injected', async () => {
    mockAuthenticated('user-42');
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
    mockAuthenticated('user-42');
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

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/tracker/log/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/log', {
      method: 'POST',
      body: JSON.stringify({ substance: 'X' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
