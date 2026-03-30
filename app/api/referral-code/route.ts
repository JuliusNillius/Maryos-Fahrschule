import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

/**
 * GET ?email=... — Gibt den Empfehlungscode (my_referral_code) für eine E-Mail zurück,
 * falls eine Anmeldung mit dieser E-Mail existiert. Für "Freunde werben – Code abrufen".
 */
export async function GET(request: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const { data, error } = await admin
    .from('registrations')
    .select('my_referral_code')
    .eq('email', email)
    .not('my_referral_code', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[referral-code]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.my_referral_code) {
    return NextResponse.json({ code: null, found: false }, { status: 200 });
  }
  return NextResponse.json({ code: data.my_referral_code, found: true });
}
