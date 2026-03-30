import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: Request) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: 'E-Mail nicht konfiguriert' }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { name, email, message } = body as { name?: string; email?: string; message?: string };
    if (!email || !message) {
      return NextResponse.json({ error: 'E-Mail und Nachricht erforderlich' }, { status: 400 });
    }
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'Maryo\'s Fahrschule <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL ?? 'info@maryos-fahrschule.de',
      reply_to: email,
      subject: `Kontaktanfrage von ${name ?? 'Website'}`,
      text: message,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    return NextResponse.json({ error: 'Send failed' }, { status: 500 });
  }
}
