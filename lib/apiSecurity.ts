// Shared request-hardening helpers for API route handlers.

/** Max accepted JSON request body. Generous for CMS content, tight enough to
 * block memory-exhaustion payloads. Override per-route where a smaller cap fits
 * (e.g. lead forms). */
export const MAX_JSON_BYTES = 100_000; // 100 KB

/**
 * Parse a JSON request body with a hard size cap. Rejects oversized bodies
 * (via Content-Length when present, and again while reading) before parsing, so
 * a huge payload can't exhaust memory. Throws on oversize or invalid JSON —
 * callers already wrap `request.json()` in try/catch, so this is a drop-in
 * replacement that returns their existing 400 on failure.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number = MAX_JSON_BYTES
): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) {
    throw new Error("Request body too large.");
  }
  const text = await request.text();
  // Byte length (not string length) — multibyte chars count correctly.
  if (new TextEncoder().encode(text).length > maxBytes) {
    throw new Error("Request body too large.");
  }
  return JSON.parse(text);
}
