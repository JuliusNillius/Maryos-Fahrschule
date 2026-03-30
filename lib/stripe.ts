import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY ?? '';

export const stripe = secret
  ? new Stripe(secret, { apiVersion: '2023-10-16' })
  : (null as unknown as Stripe);

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
