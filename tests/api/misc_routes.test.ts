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

const mockManemusFetchJson = vi.fn();
const mockManemusFetch = vi.fn();
vi.mock('@/lib/api-fetch', () => ({
  manemusFetchJson: (...args: unknown[]) => mockManemusFetchJson(...args),
  manemusFetch: (...args: unknown[]) => mockManemusFetch(...args),
}));

const mockRequireSession = vi.fn();
vi.mock('@/lib/auth', () => ({
  requireSession: (...args: unknown[]) => mockRequireSession(...args),
}));

// Note: child_process is not mocked — version route uses real git commands

const mockGraphQuery = vi.fn();
vi.mock('@/lib/db/falkordb', () => ({
  graphQuery: (...args: unknown[]) => mockGraphQuery(...args),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

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

function makeGetRequest(url: string) {
  const { NextRequest } = require('next/server');
  return new NextRequest(url);
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
// GET /api/version
// ---------------------------------------------------------------------------

describe('GET /api/version', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns version info with expected shape', async () => {
    const { GET } = await import('@/app/api/version/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    // The route runs real git commands — we test the response shape
    expect(data).toHaveProperty('hash');
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('author');
    expect(data).toHaveProperty('date');
    expect(data).toHaveProperty('branch');
    expect(data).toHaveProperty('filesChanged');
    expect(data).toHaveProperty('ts');
    expect(typeof data.ts).toBe('number');
    // Since we're in a git repo, hash should be non-empty
    expect(data.hash.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// POST /api/translate
// ---------------------------------------------------------------------------

describe('POST /api/translate', () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  it('returns 400 when text is missing', async () => {
    const { POST } = await import('@/app/api/translate/route');
    const req = makeNextRequest('http://localhost/api/translate', { to: 'fr' });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing text or target language');
  });

  it('returns 400 when text exceeds max length', async () => {
    const { POST } = await import('@/app/api/translate/route');
    const req = makeNextRequest('http://localhost/api/translate', {
      text: 'a'.repeat(10001),
      to: 'fr',
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Text too long (max 10000 chars)');
  });

  it('translates text via Google Translate', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [[['Bonjour', 'Hello', null, null, 1]], null, 'en'],
    });

    const { POST } = await import('@/app/api/translate/route');
    const req = makeNextRequest('http://localhost/api/translate', {
      text: 'Hello',
      from: 'en',
      to: 'fr',
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.translated).toBe('Bonjour');
    expect(data.cached).toBe(false);
  });

  it('returns 502 when Google Translate fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const { POST } = await import('@/app/api/translate/route');
    const req = makeNextRequest('http://localhost/api/translate', {
      text: 'Hello',
      to: 'fr',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// GET /api/actif
// ---------------------------------------------------------------------------

describe('GET /api/actif', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns actif state from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: {
        ts: '2026-02-27T10:00:00Z',
        biometrics: { heart_rate: 72, stress: 25 },
        workouts: [{ type: 'run', duration: 3600 }],
        activity: { steps: 8000 },
      },
    });

    const { GET } = await import('@/app/api/actif/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.biometrics.heart_rate).toBe(72);
    expect(data.workouts).toHaveLength(1);
    expect(data.activity.steps).toBe(8000);
  });

  it('returns offline fallback when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/actif/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.offline).toBe(true);
    expect(data.biometrics).toEqual({});
    expect(data.workouts).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// GET /api/token/holders
// ---------------------------------------------------------------------------

describe('GET /api/token/holders', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns holder data from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { holders: [{ address: 'abc', balance: 1000 }], total: 1 },
      status: 200,
    });

    const { GET } = await import('@/app/api/token/holders/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.holders).toHaveLength(1);
    expect(data.total).toBe(1);

    expect(mockManemusFetchJson).toHaveBeenCalledWith('/api/token/holders');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/token/holders/route');
    const response = await GET();
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// GET /api/gmail/status
// ---------------------------------------------------------------------------

describe('GET /api/gmail/status', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns 400 when user_id is missing', async () => {
    const { GET } = await import('@/app/api/gmail/status/route');
    const req = new Request('http://localhost/api/gmail/status');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('user_id required');
  });

  it('returns gmail status from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { linked: true, email: 'test@gmail.com' },
      status: 200,
    });

    const { GET } = await import('@/app/api/gmail/status/route');
    const req = new Request('http://localhost/api/gmail/status?user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.linked).toBe(true);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/gmail/status/route');
    const req = new Request('http://localhost/api/gmail/status?user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// GET /api/gmail/auth/init
// ---------------------------------------------------------------------------

describe('GET /api/gmail/auth/init', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns 400 when link_code or user_id is missing', async () => {
    const { GET } = await import('@/app/api/gmail/auth/init/route');
    const req = new Request('http://localhost/api/gmail/auth/init');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('link_code and user_id required');
  });

  it('returns auth URL from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { auth_url: 'https://accounts.google.com/oauth2/...' },
      status: 200,
    });

    const { GET } = await import('@/app/api/gmail/auth/init/route');
    const req = new Request('http://localhost/api/gmail/auth/init?link_code=lc1&user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.auth_url).toBeDefined();
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/gmail/auth/init/route');
    const req = new Request('http://localhost/api/gmail/auth/init?link_code=lc1&user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/gmail/link/verify
// ---------------------------------------------------------------------------

describe('POST /api/gmail/link/verify', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('forwards verification to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'linked' },
      status: 200,
    });

    const { POST } = await import('@/app/api/gmail/link/verify/route');
    const req = new Request('http://localhost/api/gmail/link/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'auth_code_123', user_id: 'u1' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('linked');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/gmail/link/verify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/gmail/link/verify/route');
    const req = new Request('http://localhost/api/gmail/link/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'x' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/gmail/oauth/callback
// ---------------------------------------------------------------------------

describe('POST /api/gmail/oauth/callback', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('forwards OAuth callback to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'success', email: 'user@gmail.com' },
      status: 200,
    });

    const { POST } = await import('@/app/api/gmail/oauth/callback/route');
    const req = new Request('http://localhost/api/gmail/oauth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'oauth_code', state: 'state123' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('success');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/gmail/oauth/callback/route');
    const req = new Request('http://localhost/api/gmail/oauth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'x' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// GET /api/spotify/audio-analysis
// ---------------------------------------------------------------------------

describe('GET /api/spotify/audio-analysis', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetch.mockReset();
  });

  it('returns 400 when track_id is missing', async () => {
    const { GET } = await import('@/app/api/spotify/audio-analysis/route');
    const req = new Request('http://localhost/api/spotify/audio-analysis');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('track_id required');
  });

  it('returns analysis data from backend', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tempo: 120, key: 5, mode: 1 }),
    });

    const { GET } = await import('@/app/api/spotify/audio-analysis/route');
    const req = new Request('http://localhost/api/spotify/audio-analysis?track_id=t123');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.tempo).toBe(120);
  });

  it('returns error when backend returns not-ok', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { GET } = await import('@/app/api/spotify/audio-analysis/route');
    const req = new Request('http://localhost/api/spotify/audio-analysis?track_id=bad');
    const response = await GET(req);
    expect(response.status).toBe(404);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetch.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/spotify/audio-analysis/route');
    const req = new Request('http://localhost/api/spotify/audio-analysis?track_id=t1');
    const response = await GET(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// GET /api/spotify/now-playing
// ---------------------------------------------------------------------------

describe('GET /api/spotify/now-playing', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetch.mockReset();
  });

  it('returns now-playing data from backend', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        is_playing: true,
        track: 'Test Song',
        artist: 'Test Artist',
      }),
    });

    const { GET } = await import('@/app/api/spotify/now-playing/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.is_playing).toBe(true);
    expect(data.track).toBe('Test Song');
  });

  it('returns is_playing:false when backend returns not-ok', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { GET } = await import('@/app/api/spotify/now-playing/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.is_playing).toBe(false);
  });

  it('returns is_playing:false when backend is unreachable', async () => {
    mockManemusFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/spotify/now-playing/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.is_playing).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GET /api/spotify/auth/init
// ---------------------------------------------------------------------------

describe('GET /api/spotify/auth/init', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns 400 when link_code or user_id is missing', async () => {
    const { GET } = await import('@/app/api/spotify/auth/init/route');
    const req = new Request('http://localhost/api/spotify/auth/init');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('link_code and user_id required');
  });

  it('returns auth URL from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { auth_url: 'https://accounts.spotify.com/authorize?...' },
      status: 200,
    });

    const { GET } = await import('@/app/api/spotify/auth/init/route');
    const req = new Request('http://localhost/api/spotify/auth/init?link_code=lc1&user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.auth_url).toBeDefined();
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/spotify/auth/init/route');
    const req = new Request('http://localhost/api/spotify/auth/init?link_code=lc1&user_id=u1');
    const response = await GET(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/spotify/link/verify
// ---------------------------------------------------------------------------

describe('POST /api/spotify/link/verify', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('forwards verification to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'linked' },
      status: 200,
    });

    const { POST } = await import('@/app/api/spotify/link/verify/route');
    const req = new Request('http://localhost/api/spotify/link/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'auth_code', user_id: 'u1' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('linked');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/spotify/link/verify/route');
    const req = new Request('http://localhost/api/spotify/link/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'x' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/spotify/oauth/callback
// ---------------------------------------------------------------------------

describe('POST /api/spotify/oauth/callback', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('forwards OAuth callback to backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'success' },
      status: 200,
    });

    const { POST } = await import('@/app/api/spotify/oauth/callback/route');
    const req = new Request('http://localhost/api/spotify/oauth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'oauth_code', state: 'state123' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('success');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/spotify/oauth/callback/route');
    const req = new Request('http://localhost/api/spotify/oauth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'x' }),
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/register (FalkorDB-based)
// ---------------------------------------------------------------------------

describe('POST /api/register', () => {
  beforeEach(() => {
    vi.resetModules();
    mockGraphQuery.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'Alice',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 400 when name is too short', async () => {
    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'A',
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Name required');
  });

  it('returns 400 when name is too long', async () => {
    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'A'.repeat(65),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('returns 400 when purpose is too long', async () => {
    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'Alice',
      purpose: 'x'.repeat(281),
    });
    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Purpose');
  });

  it('returns 409 when name already exists', async () => {
    // First query (exist check) returns a match
    mockGraphQuery.mockResolvedValueOnce({
      result_set: [['existing_id']],
    });

    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'Alice',
    });
    const response = await POST(req);
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.error).toContain('already exists');
  });

  it('creates citizen successfully', async () => {
    // Exist check returns no match
    mockGraphQuery.mockResolvedValueOnce({ result_set: [] });
    // Create returns result
    mockGraphQuery.mockResolvedValueOnce({
      result_set: [['citizen_alice_123', 'Alice']],
    });

    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'Alice',
      purpose: 'Testing registration',
    });
    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Alice');
    expect(data.message).toBe('You exist now.');
  });

  it('returns 500 when graph query fails', async () => {
    mockGraphQuery.mockRejectedValueOnce(new Error('DB down'));

    const { POST } = await import('@/app/api/register/route');
    const req = makeNextRequest('http://localhost/api/register', {
      name: 'Alice',
    });
    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// GET /api/registry/citizens
// ---------------------------------------------------------------------------

describe('GET /api/registry/citizens', () => {
  beforeEach(() => {
    vi.resetModules();
    mockGraphQuery.mockReset();
  });

  it('returns citizen list from FalkorDB', async () => {
    mockGraphQuery
      .mockResolvedValueOnce({
        result_set: [
          ['c1', 'Alice', 'A description', 'active', 'SPACE_1', 'Org1'],
        ],
      })
      .mockResolvedValueOnce({
        result_set: [[5]],
      });

    const { GET } = await import('@/app/api/registry/citizens/route');
    const req = makeGetRequest('http://localhost/api/registry/citizens');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('Alice');
    expect(data.count).toBe(5);
  });

  it('returns empty list on DB error', async () => {
    mockGraphQuery.mockRejectedValueOnce(new Error('DB down'));

    const { GET } = await import('@/app/api/registry/citizens/route');
    const req = makeGetRequest('http://localhost/api/registry/citizens');
    const response = await GET(req);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.items).toEqual([]);
    expect(data.count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// GET /api/registry/orgs
// ---------------------------------------------------------------------------

describe('GET /api/registry/orgs', () => {
  beforeEach(() => {
    vi.resetModules();
    mockGraphQuery.mockReset();
  });

  it('returns org list from FalkorDB', async () => {
    mockGraphQuery
      .mockResolvedValueOnce({
        result_set: [
          ['SPACE_1', 'Engineering', 'Dev team', 'SPACE', 3],
        ],
      })
      .mockResolvedValueOnce({
        result_set: [[2]],
      });

    const { GET } = await import('@/app/api/registry/orgs/route');
    const req = makeGetRequest('http://localhost/api/registry/orgs');
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('Engineering');
    expect(data.items[0].citizen_count).toBe(3);
    expect(data.count).toBe(2);
  });

  it('returns empty list on DB error', async () => {
    mockGraphQuery.mockRejectedValueOnce(new Error('DB down'));

    const { GET } = await import('@/app/api/registry/orgs/route');
    const req = makeGetRequest('http://localhost/api/registry/orgs');
    const response = await GET(req);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.items).toEqual([]);
    expect(data.count).toBe(0);
  });
});
