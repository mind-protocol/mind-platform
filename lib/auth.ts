import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MANEMUS_URL =
  process.env.MIND_API_URL ||
  process.env.MANEMUS_URL ||
  'https://trusted-magpie-social.ngrok-free.app';

const COOKIE_NAME = 'mind_session';

/** Max-age for the session cookie (7 days). */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

// ---------------------------------------------------------------------------
// Session types
// ---------------------------------------------------------------------------

export interface SessionPayload {
  user_id: string;
  name: string;
  trust: string;
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

/**
 * Read the `mind_session` cookie from an incoming request, verify it against
 * the manemus `/auth/verify` endpoint, and return the decoded session payload.
 * Returns `null` when the cookie is missing or the token is invalid/expired.
 */
export async function getSession(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${MANEMUS_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      user_id: data.user_id,
      name: data.name,
      trust: data.trust,
    };
  } catch {
    return null;
  }
}

/**
 * Set the `mind_session` httpOnly cookie on an outgoing response.
 */
export function setSession(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Clear the `mind_session` cookie (logout).
 */
export function clearSession(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// ---------------------------------------------------------------------------
// Request helpers
// ---------------------------------------------------------------------------

/**
 * Shorthand: extract the authenticated `user_id` from the request.
 * Falls back to `"nicolas"` when no valid session exists (backwards compat).
 */
export async function getUserIdFromRequest(
  request: NextRequest,
): Promise<string> {
  const session = await getSession(request);
  return session?.user_id ?? 'nicolas';
}
