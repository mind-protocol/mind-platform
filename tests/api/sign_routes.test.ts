import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Shared mock classes
// ---------------------------------------------------------------------------

class MockNextResponse {
  _data: unknown;
  _status: number;
  _headers: Record<string, string>;
  constructor(data: unknown, init?: { status?: number; headers?: Record<string, string> }) {
    this._data = data;
    this._status = init?.status ?? 200;
    this._headers = init?.headers ?? {};
  }
  async json() { return typeof this._data === 'string' ? JSON.parse(this._data) : this._data; }
  get status() { return this._status; }

  static json(data: unknown, init?: { status?: number }) {
    return new MockNextResponse(data, { status: init?.status ?? 200 });
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
// GET /api/sign/[id]
// ---------------------------------------------------------------------------

describe('GET /api/sign/[id]', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
  });

  it('returns contract details by id', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { id: 'contract1', title: 'Test Contract', status: 'pending' },
      status: 200,
    });

    const { GET } = await import('@/app/api/sign/[id]/route');
    const req = new Request('http://localhost/api/sign/contract1');
    const response = await GET(req, { params: Promise.resolve({ id: 'contract1' }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe('contract1');
    expect(data.title).toBe('Test Contract');

    expect(mockManemusFetchJson).toHaveBeenCalledWith('/sign/contract1');
  });

  it('forwards backend error status', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { error: 'Not found' },
      status: 404,
    });

    const { GET } = await import('@/app/api/sign/[id]/route');
    const req = new Request('http://localhost/api/sign/nonexistent');
    const response = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { GET } = await import('@/app/api/sign/[id]/route');
    const req = new Request('http://localhost/api/sign/c1');
    const response = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});

// ---------------------------------------------------------------------------
// POST /api/sign/create
// ---------------------------------------------------------------------------

describe('POST /api/sign/create', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/sign/create/route');
    const req = makeNextRequest('http://localhost/api/sign/create', {
      title: 'My Contract',
    });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('creates contract via backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { id: 'contract_new', status: 'created' },
      status: 201,
    });

    const { POST } = await import('@/app/api/sign/create/route');
    const req = makeNextRequest('http://localhost/api/sign/create', {
      title: 'New Contract',
      signers: ['alice', 'bob'],
    });
    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBe('contract_new');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/sign/create',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('Connection refused'));

    const { POST } = await import('@/app/api/sign/create/route');
    const req = makeNextRequest('http://localhost/api/sign/create', {
      title: 'X',
    });
    const response = await POST(req);
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// POST /api/sign/[id]/execute
// ---------------------------------------------------------------------------

describe('POST /api/sign/[id]/execute', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetchJson.mockReset();
    mockRequireSession.mockReset();
    mockAuthenticated();
  });

  it('returns 401 when not authenticated', async () => {
    mockUnauthenticated();

    const { POST } = await import('@/app/api/sign/[id]/execute/route');
    const req = makeNextRequest('http://localhost/api/sign/c1/execute', {
      signature: 'sig123',
    });
    const response = await POST(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(401);
  });

  it('executes signing via backend', async () => {
    mockManemusFetchJson.mockResolvedValueOnce({
      data: { status: 'executed', tx_hash: 'tx_abc' },
      status: 200,
    });

    const { POST } = await import('@/app/api/sign/[id]/execute/route');
    const req = makeNextRequest('http://localhost/api/sign/c1/execute', {
      signature: 'sig123',
    });
    const response = await POST(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('executed');

    expect(mockManemusFetchJson).toHaveBeenCalledWith(
      '/sign/c1/execute',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetchJson.mockRejectedValueOnce(new Error('timeout'));

    const { POST } = await import('@/app/api/sign/[id]/execute/route');
    const req = makeNextRequest('http://localhost/api/sign/c1/execute', {
      signature: 'sig',
    });
    const response = await POST(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// GET /api/sign/[id]/pdf
// ---------------------------------------------------------------------------

describe('GET /api/sign/[id]/pdf', () => {
  beforeEach(() => {
    vi.resetModules();
    mockManemusFetch.mockReset();
  });

  it('returns PDF when backend succeeds', async () => {
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
    mockManemusFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      arrayBuffer: async () => pdfBytes.buffer,
    });

    const { GET } = await import('@/app/api/sign/[id]/pdf/route');
    const req = new Request('http://localhost/api/sign/c1/pdf');
    const response = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(200);

    expect(mockManemusFetch).toHaveBeenCalledWith('/sign/c1/pdf');
  });

  it('forwards backend error status', async () => {
    mockManemusFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Contract not found' }),
    });

    const { GET } = await import('@/app/api/sign/[id]/pdf/route');
    const req = new Request('http://localhost/api/sign/nonexistent/pdf');
    const response = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('returns 502 when backend is unreachable', async () => {
    mockManemusFetch.mockRejectedValueOnce(new Error('Connection refused'));

    const { GET } = await import('@/app/api/sign/[id]/pdf/route');
    const req = new Request('http://localhost/api/sign/c1/pdf');
    const response = await GET(req, { params: Promise.resolve({ id: 'c1' }) });
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBe('Service unavailable');
  });
});
