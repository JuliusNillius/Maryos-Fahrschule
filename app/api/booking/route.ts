import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { bookingRequestSchema } from '@/lib/validations';
import { getSupabaseAdmin } from '@/lib/supabase';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { date, time, name, email, phone } = parsed.data;

    const admin = getSupabaseAdmin();
    if (admin) {
      const { error } = await admin.from('bookings').insert({
        date,
        time,
        name: name ?? null,
        email: email ?? null,
        phone: phone ?? null,
      });
      if (error) {
        console.error('[booking] Supabase insert error:', error);
        return NextResponse.json(
          { error: 'Booking could not be saved' },
          { status: 500 }
        );
      }
    }

    const resend = getResend();
    const contactTo = process.env.CONTACT_EMAIL;
    if (resend && contactTo) {
      const lines = [`Termin: ${date} um ${time}`, name && `Name: ${name}`, email && `E-Mail: ${email}`, phone && `Tel: ${phone}`].filter(Boolean);
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "Maryo's Fahrschule <onboarding@resend.dev>",
        to: contactTo,
        reply_to: email ?? undefined,
        subject: `Terminanfrage: ${date} ${time}`,
        text: lines.join('\n'),
      }).catch((err) => console.error('[booking] Resend error:', err));
    }

    return NextResponse.json({
      ok: true,
      message: 'Terminanfrage erhalten. Wir melden uns zeitnah.',
    });
  } catch (e) {
    console.error('[booking]', e);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
