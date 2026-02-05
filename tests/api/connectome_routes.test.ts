import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally before importing routes
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Next.js server helpers need mocking
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

describe('GET /api/connectome/tick', () => {
  it('returns end_of_script', async () => {
    const { GET } = await import('@/app/api/connectome/tick/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/connectome/tick');
    const response = await GET(req);
    const data = await response.json();
    expect(data.status).toBe('end_of_script');
  });
});

describe('GET /api/connectome/search', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns 400 when query is empty', async () => {
    const { GET } = await import('@/app/api/connectome/search/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/connectome/search?q=');
    const response = await GET(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Query required');
  });

  it('returns 400 when query is whitespace', async () => {
    const { GET } = await import('@/app/api/connectome/search/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/connectome/search?q=%20%20');
    const response = await GET(req);
    expect(response.status).toBe(400);
  });

  it('forwards valid query to backend', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ matches: [{ id: 'n1', similarity: 0.9 }] }),
    });

    const { GET } = await import('@/app/api/connectome/search/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/connectome/search?q=test&graph=seed');
    const response = await GET(req);
    const data = await response.json();
    expect(data.matches).toBeDefined();
  });

  it('returns 503 when backend is unreachable', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/connectome/search/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/connectome/search?q=test');
    const response = await GET(req);
    expect(response.status).toBe(503);
  });
});

describe('GET /api/connectome/graphs', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns default graphs when backend is down', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/connectome/graphs/route');
    const response = await GET();
    const data = await response.json();
    expect(data.graphs).toEqual(['seed']);
  });

  it('forwards backend response when available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ graphs: ['seed', 'test'] }),
    });

    const { GET } = await import('@/app/api/connectome/graphs/route');
    const response = await GET();
    const data = await response.json();
    expect(data.graphs).toEqual(['seed', 'test']);
  });
});

describe('GET /api/connectome/graph', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns 503 when backend is down', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/connectome/graph/route');
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/connectome/graph?graph=seed');
    const response = await GET(req);
    expect(response.status).toBe(503);
  });
});
