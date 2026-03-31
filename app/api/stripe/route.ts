import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getStripeAmountCentsForOffer, parseOfferType } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email ?? '';
    const licenceClass = body.licenceClass ?? '';
    const registrationId = typeof body.registrationId === 'string' ? body.registrationId.trim() : '';

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId erforderlich' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Server nicht konfiguriert' }, { status: 503 });
    }

    const { data: reg, error: regErr } = await admin
      .from('registrations')
      .select('offer_type')
      .eq('id', registrationId)
      .single();

    if (regErr || !reg) {
      return NextResponse.json({ error: 'Anmeldung nicht gefunden' }, { status: 404 });
    }

    const offer = parseOfferType(reg.offer_type);
    const amount = getStripeAmountCentsForOffer(offer);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        email,
        licenceClass,
        registrationId,
        offer_type: offer,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
