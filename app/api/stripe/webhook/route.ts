import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const registrationId = pi.metadata?.registrationId;
      if (registrationId) {
        const { getSupabaseAdmin } = await import('@/lib/supabase');
        const admin = getSupabaseAdmin();
        if (admin) {
          await admin
            .from('registrations')
            .update({ payment_status: 'paid', paid_at: new Date().toISOString(), stripe_payment_intent_id: pi.id })
            .eq('id', registrationId);
        }
      }
      break;
    }
    default:
      break;
  }
  return NextResponse.json({ received: true });
}
