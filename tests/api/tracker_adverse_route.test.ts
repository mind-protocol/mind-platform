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
// GET /api/tracker/adverse
// ---------------------------------------------------------------------------

describe('GET /api/tracker/adverse', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
    mockRequireSession.mockReset();
  });

  it('forwards request to backend with user id', async () => {
    mockAuthenticated('user-5');
    mockMindFetchJson.mockResolvedValueOnce({
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

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      '/api/tracker/adverse',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-User-Id': 'user-5' }),
      }),
    );
  });

  it('passes query params through to backend', async () => {
    mockAuthenticated('user-5');
    mockMindFetchJson.mockResolvedValueOnce({
      data: { events: [] },
      status: 200,
    });

    const { GET } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse?days=14&severity=high');
    const response = await GET(req);
    expect(response.status).toBe(200);

    expect(mockMindFetchJson).toHaveBeenCalledWith(
      '/api/tracker/adverse?days=14&severity=high',
      expect.anything(),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockAuthenticated('user-5');
    mockMindFetchJson.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const { GET } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse');
    const response = await GET(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { GET } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse');
    const response = await GET(req);
    expect(response.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/tracker/adverse
// ---------------------------------------------------------------------------

describe('POST /api/tracker/adverse', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetchJson.mockReset();
    mockRequireSession.mockReset();
  });

  it('posts adverse event with user_id injected', async () => {
    mockAuthenticated('user-5');
    mockMindFetchJson.mockResolvedValueOnce({
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

    const sentBody = JSON.parse(mockMindFetchJson.mock.calls[0][1].body);
    expect(sentBody.user_id).toBe('user-5');
    expect(sentBody.symptom).toBe('Nausea');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockAuthenticated('user-5');
    mockMindFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse', {
      method: 'POST',
      body: JSON.stringify({ symptom: 'Test' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/tracker/adverse/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/tracker/adverse', {
      method: 'POST',
      body: JSON.stringify({ symptom: 'Test' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
