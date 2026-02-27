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

vi.mock('next/server', () => {
  class MockNextRequest {
    nextUrl: URL;
    url: string;
    cookies: { get: () => undefined };
    headers: Headers;
    method: string;

    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.nextUrl = new URL(url);
      this.cookies = { get: () => undefined };
      this.headers = new Headers(init?.headers);
      this.method = init?.method ?? 'GET';
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// ---------------------------------------------------------------------------
// GET /api/citizens
// ---------------------------------------------------------------------------

describe('GET /api/citizens', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns citizen data from backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: {
        citizens: [{ id: 'c1', name: 'Alice' }],
        organizations: [{ id: 'o1', name: 'Org1' }],
      },
    });

    const { GET } = await import('@/app/api/citizens/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.citizens).toHaveLength(1);
    expect(data.citizens[0].name).toBe('Alice');
    expect(data.organizations).toHaveLength(1);
  });

  it('returns offline fallback when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/citizens/route');
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.citizens).toEqual([]);
    expect(data.organizations).toEqual([]);
    expect(data.offline).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// GET /api/citizens/[id]
// ---------------------------------------------------------------------------

describe('GET /api/citizens/[id]', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetch.mockReset();
  });

  it('returns citizen details by id', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 'c1', name: 'Alice', trust: 'citizen' }),
    });

    const { GET } = await import('@/app/api/citizens/[id]/route');
    const req = new Request('http://localhost/api/citizens/c1');
    const response = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe('c1');
    expect(data.name).toBe('Alice');
  });

  it('returns 404 when citizen not found', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { GET } = await import('@/app/api/citizens/[id]/route');
    const req = new Request('http://localhost/api/citizens/nonexistent');
    const response = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('Citizen not found');
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetch.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/citizens/[id]/route');
    const req = new Request('http://localhost/api/citizens/c1');
    const response = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });

  it('returns 502 when backend returns non-404 error', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { GET } = await import('@/app/api/citizens/[id]/route');
    const req = new Request('http://localhost/api/citizens/c1');
    const response = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(502);
  });
});
