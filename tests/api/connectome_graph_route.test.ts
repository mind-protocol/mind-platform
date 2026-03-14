import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/connectome/graph/route';

describe('GET /api/connectome/graph', () => {
  it('returns explicit 501 payload while backend is not wired', async () => {
    const request = new Request('http://localhost/api/connectome/graph?graph=test-graph');
    const response = await GET(request);

    expect(response.status).toBe(501);
    const data = await response.json();
    expect(data.error).toContain('not wired');
    expect(data.graph).toBe('test-graph');
  });

  it('defaults graph query param to seed', async () => {
    const request = new Request('http://localhost/api/connectome/graph');
    const response = await GET(request);

    expect(response.status).toBe(501);
    const data = await response.json();
    expect(data.graph).toBe('seed');
  });
});
