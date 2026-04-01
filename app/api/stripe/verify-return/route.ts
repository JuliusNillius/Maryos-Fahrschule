import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const PI_ID = /^pi_[a-zA-Z0-9]+$/;

/**
 * Nach Stripe-Redirect: PaymentIntent per Secret Key prüfen (nicht ?payment=success vertrauen).
 */
export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe nicht konfiguriert' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const rawId = typeof body.paymentIntentId === 'string' ? body.paymentIntentId.trim() : '';
    if (!rawId || !PI_ID.test(rawId)) {
      return NextResponse.json({ error: 'Ungültige paymentIntentId' }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(rawId);

    if (pi.status !== 'succeeded') {
      return NextResponse.json(
        { ok: false, error: 'Zahlung nicht abgeschlossen', status: pi.status },
        { status: 402 },
      );
    }

    const registrationId = pi.metadata?.registrationId?.trim() ?? '';
    const email = (pi.metadata?.email ?? '').trim().toLowerCase();
    if (!registrationId) {
      return NextResponse.json({ error: 'Anmeldung am Zahlungsvorgang nicht verknüpft' }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      registrationId,
      email,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Stripe-Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
