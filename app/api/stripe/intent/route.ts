import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getStripeAmountCentsForOffer, parseOfferType } from '@/lib/pricing';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  try {
    const { email, licenceClass, offerType } = await request.json();
    const amount = getStripeAmountCentsForOffer(parseOfferType(offerType));
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { email: email ?? '', licenceClass: licenceClass ?? '' },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
