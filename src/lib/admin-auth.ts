/**
 * Admin authentication for /api/admin/*.
 *
 * Reads `TRGT_ADMIN_SECRET` (or legacy `ADMIN_SECRET`) from the Edge env
 * and constant-time compares against the `X-Admin-Secret` request header.
 * Used by every Edge-runtime admin route. The secret never crosses to
 * the browser — LaunchOps is the only caller.
 */
import { NextResponse } from "next/server";

export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Returns null on success, or a 401 NextResponse the caller must return.
 */
export function requireAdmin(request: Request): NextResponse | null {
  const expected =
    (typeof process !== "undefined" && process.env?.TRGT_ADMIN_SECRET) ||
    (typeof process !== "undefined" && process.env?.ADMIN_SECRET) ||
    "";
  if (!expected) return unauthorized();
  const provided = request.headers.get("x-admin-secret") || "";
  if (!provided || !safeEqual(provided, expected)) return unauthorized();
  return null;
}
