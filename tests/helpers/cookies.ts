/**
 * Extracts the session cookie value from a Set-Cookie header string.
 * Returns the full cookie string suitable for passing in the Cookie header.
 *
 * Example input:  "session=abc123; Path=/; HttpOnly; SameSite=Lax"
 * Example output: "session=abc123"
 */
export function extractSessionCookie(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) {
    return null;
  }

  // Find session=... part (stops at first semicolon or end)
  const match = setCookieHeader.match(/session=([^;]*)/);
  if (!match) {
    return null;
  }

  return `session=${match[1]}`;
}

/**
 * Checks if a Set-Cookie header is clearing the session cookie (expired/empty).
 */
export function isSessionCleared(setCookieHeader: string | null): boolean {
  if (!setCookieHeader) {
    return false;
  }

  // Cookie is cleared if:
  // 1. Value is empty: session=;
  // 2. Expires is in the past
  const isEmpty = /session=;/.test(setCookieHeader) || /session="?";?/.test(setCookieHeader);
  const hasExpiredDate = /Expires=Thu, 01[- ]Jan[- ]1970/.test(setCookieHeader);

  return isEmpty || hasExpiredDate;
}
