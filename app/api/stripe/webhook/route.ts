import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Stripe Dashboard → Developers → Webhooks → Endpoint URL:
 * https://<deine-domain>/api/stripe/webhook
 * Events: payment_intent.succeeded (mindestens)
 * Signing secret → STRIPE_WEBHOOK_SECRET
 */
export async function POST(request: Request) {
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? '').trim();
  const secretKey = (process.env.STRIPE_SECRET_KEY ?? '').trim();
  if (!webhookSecret || !secretKey) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    const registrationId = pi.metadata?.registrationId?.trim();
    if (registrationId) {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 });
      }
      const { error } = await supabase
        .from('registrations')
        .update({
          payment_status: 'paid',
          stripe_payment_intent_id: pi.id,
          paid_at: new Date().toISOString(),
        })
        .eq('id', registrationId);

      if (error) {
        console.error('[stripe webhook] registrations update failed', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
