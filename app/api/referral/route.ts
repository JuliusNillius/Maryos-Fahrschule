import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('ref');
  if (!code) return NextResponse.json({ error: 'Missing ref' }, { status: 400 });
  const url = new URL(request.url);
  const origin = url.origin;
  const redirectUrl = `${origin}/anmelden?ref=${encodeURIComponent(code)}`;
  return NextResponse.redirect(redirectUrl, 302);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: validate referral code, credit referrer
    void body;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Referral failed' }, { status: 500 });
  }
}
