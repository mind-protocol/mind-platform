import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { fetchCitizens, fetchOrgs } from '@/app/(public)/registry/lib/api';

describe('fetchCitizens', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls /api/registry/citizens without filters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchCitizens();
    expect(mockFetch).toHaveBeenCalledWith('/api/registry/citizens?');
  });

  it('includes verification filter when not "all"', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchCitizens({ verification: 'verified' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('verification=verified');
  });

  it('includes status filter when not "all"', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchCitizens({ status: 'active' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('status=active');
  });

  it('includes org filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchCitizens({ org: 'org-123' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('org=org-123');
  });

  it('skips "all" values for verification and status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchCitizens({ verification: 'all', status: 'all' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).not.toContain('verification=');
    expect(url).not.toContain('status=');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchCitizens()).rejects.toThrow('Failed to fetch citizens');
  });
});

describe('fetchOrgs', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('calls /api/registry/orgs without filters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchOrgs();
    expect(mockFetch).toHaveBeenCalledWith('/api/registry/orgs?');
  });

  it('includes verification filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], count: 0, hasMore: false }),
    });

    await fetchOrgs({ verification: 'pending' });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('verification=pending');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchOrgs()).rejects.toThrow('Failed to fetch orgs');
  });
});
