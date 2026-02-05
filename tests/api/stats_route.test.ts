import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      _data: data,
      _status: init?.status ?? 200,
      async json() { return data; },
      get status() { return this._status; },
    }),
  },
}));

describe('GET /api/stats', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns zeros when L4 API is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('Connection refused'));

    // Re-import to clear cache state
    vi.resetModules();
    const { GET } = await import('@/app/api/stats/route');
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({ citizens: 0, orgs: 0, nodes: 0 });
  });

  it('aggregates counts from L4 API', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ count: 42 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ count: 7 }) });

    vi.resetModules();
    const { GET } = await import('@/app/api/stats/route');
    const response = await GET();
    const data = await response.json();

    expect(data.citizens).toBe(42);
    expect(data.orgs).toBe(7);
    expect(data.nodes).toBe(0);
  });

  it('handles partial API failure gracefully', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ count: 10 }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    vi.resetModules();
    const { GET } = await import('@/app/api/stats/route');
    const response = await GET();
    const data = await response.json();

    expect(data.citizens).toBe(10);
    expect(data.orgs).toBe(0);
  });
});
