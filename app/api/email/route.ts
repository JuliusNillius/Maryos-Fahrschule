import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: Request) {
  try {
    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
    }
    const body = await request.json();
    const { to, firstName, licenceClass } = body;

    if (!to || !firstName) {
      return NextResponse.json({ error: 'Missing to or firstName' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'Maryos Fahrschule <onboarding@resend.dev>',
      to: [to],
      subject: "Willkommen bei Maryo's Fahrschule 🍀",
      html: `
        <h1>Willkommen bei Maryo's, ${firstName}!</h1>
        <p>Wir haben deine Anmeldung für die Führerscheinklasse <strong>${licenceClass ?? '–'}</strong> erhalten.</p>
        <p>Wir melden uns innerhalb von 24 Stunden unter <strong>0178 4557528</strong> bei dir.</p>
        <p>Fahr in dein Glück! 🍀</p>
        <p>— Maryo's Fahrschule GmbH</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Email error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
