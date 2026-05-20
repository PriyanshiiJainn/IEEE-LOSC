import { NextResponse } from "next/server";

/** Prevent browsers and shared caches from serving stale HTML/API/data. */
export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
} as const;

export function applyNoCacheHeaders<T extends Response>(response: T): T {
  for (const [key, value] of Object.entries(NO_CACHE_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export function noCacheJson<T>(body: T, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(body, init);
  return applyNoCacheHeaders(res);
}
