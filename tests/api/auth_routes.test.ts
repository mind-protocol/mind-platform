import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Shared mock classes (defined before vi.mock so they can be referenced)
// ---------------------------------------------------------------------------

class MockNextResponse {
  _data: unknown;
  _status: number;
  cookies: { set: ReturnType<typeof vi.fn> };
  constructor(data: unknown, status: number) {
    this._data = data;
    this._status = status;
    this.cookies = { set: vi.fn() };
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

const mockMindFetch = vi.fn();
vi.mock('@/lib/api-fetch', () => ({
  mindFetch: (...args: unknown[]) => mockMindFetch(...args),
  mindFetchJson: vi.fn(),
}));

const mockGetSession = vi.fn();
const mockSetSession = vi.fn();
const mockClearSession = vi.fn();
vi.mock('@/lib/auth', () => ({
  getSession: mockGetSession,
  setSession: mockSetSession,
  clearSession: mockClearSession,
  getUserIdFromRequest: vi.fn(),
  requireSession: vi.fn(),
}));

vi.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: URL;
    url: string;
    cookies: { get: (name: string) => ({ value: string } | undefined) };
    constructor(url: string, init?: { method?: string }) {
      this.url = url;
      this.nextUrl = new URL(url);
      this.cookies = { get: () => undefined };
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

/** Build a fake Request with JSON body. */
function makeRequest(url: string, body?: unknown): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetch.mockReset();
    mockSetSession.mockReset();
  });

  it('returns 400 when email is missing', async () => {
    const { POST } = await import('@/app/api/auth/login/route');
    const req = makeRequest('http://localhost/api/auth/login', { password: 'pw' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Email and password are required');
  });

  it('returns 400 when password is missing', async () => {
    const { POST } = await import('@/app/api/auth/login/route');
    const req = makeRequest('http://localhost/api/auth/login', { email: 'a@b.com' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Email and password are required');
  });

  it('returns user data and sets session on success', async () => {
    mockMindFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ user_id: 'u1', name: 'Test', trust: 'citizen', token: 'tok123' }),
    });

    const { POST } = await import('@/app/api/auth/login/route');
    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'a@b.com',
      password: 'secret',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user_id).toBe('u1');
    expect(data.name).toBe('Test');
    expect(mockSetSession).toHaveBeenCalledWith(expect.anything(), 'tok123');
  });

  it('forwards backend error status', async () => {
    mockMindFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    const { POST } = await import('@/app/api/auth/login/route');
    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'a@b.com',
      password: 'wrong',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const { POST } = await import('@/app/api/auth/login/route');
    const req = makeRequest('http://localhost/api/auth/login', {
      email: 'a@b.com',
      password: 'secret',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.resetModules();
    mockMindFetch.mockReset();
    mockSetSession.mockReset();
  });

  it('returns user data and sets session on success', async () => {
    mockMindFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ user_id: 'u2', name: 'New', trust: 'visitor', token: 'tok456' }),
    });

    const { POST } = await import('@/app/api/auth/register/route');
    const req = makeRequest('http://localhost/api/auth/register', {
      name: 'New',
      email: 'new@test.com',
      password: 'pw123',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.user_id).toBe('u2');
    expect(data.name).toBe('New');
    expect(mockSetSession).toHaveBeenCalledWith(expect.anything(), 'tok456');
  });

  it('forwards backend 409 conflict', async () => {
    mockMindFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: 'Email already registered' }),
    });

    const { POST } = await import('@/app/api/auth/register/route');
    const req = makeRequest('http://localhost/api/auth/register', {
      name: 'Dup',
      email: 'dup@test.com',
      password: 'pw',
    });
    const response = await POST(req);
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toBe('Email already registered');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockMindFetch.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/auth/register/route');
    const req = makeRequest('http://localhost/api/auth/register', {
      name: 'X',
      email: 'x@y.com',
      password: 'pw',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// GET /api/auth/session
// ---------------------------------------------------------------------------

describe('GET /api/auth/session', () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetSession.mockReset();
  });

  it('returns authenticated:false when no session', async () => {
    mockGetSession.mockResolvedValue(null);

    const { GET } = await import('@/app/api/auth/session/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/auth/session');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.authenticated).toBe(false);
    expect(data.user_id).toBeUndefined();
  });

  it('returns session data when authenticated', async () => {
    mockGetSession.mockResolvedValue({
      user_id: 'u1',
      name: 'Alice',
      trust: 'citizen',
    });

    const { GET } = await import('@/app/api/auth/session/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/auth/session');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.authenticated).toBe(true);
    expect(data.user_id).toBe('u1');
    expect(data.name).toBe('Alice');
    expect(data.trust).toBe('citizen');
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.resetModules();
    mockClearSession.mockReset();
  });

  it('returns ok and clears session', async () => {
    const { POST } = await import('@/app/api/auth/logout/route');
    const response = await POST();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(mockClearSession).toHaveBeenCalled();
  });
});
