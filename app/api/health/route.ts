import { NextResponse } from 'next/server';

/** Einfacher Test: Erreichbar unter GET /api/health – wenn das antwortet, läuft der Server. */
export async function GET() {
  return NextResponse.json({ ok: true, t: Date.now() });
}
