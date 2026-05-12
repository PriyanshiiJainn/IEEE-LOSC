import { NextResponse } from "next/server";

/** Stub path: events page copy is static in `app/events/page.tsx`. Kept so tooling does not reference a missing file. */
export async function GET() {
  return NextResponse.json({ error: "Gone" }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({ error: "Gone" }, { status: 410 });
}
