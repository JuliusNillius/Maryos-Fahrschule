import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const CODE_PREFIX = 'MARYO-';
const CODE_LENGTH = 6;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateReferralCode(): string {
  let code = CODE_PREFIX;
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const admin = getSupabaseAdmin();
    if (!admin) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const referrerCodeRaw = body.referrerCode ?? body.referrer_code ?? '';
    const referrerCode = typeof referrerCodeRaw === 'string' ? referrerCodeRaw.trim().toUpperCase() || null : null;

    const row = {
      first_name: body.firstName ?? body.first_name ?? '',
      last_name: body.lastName ?? body.last_name ?? '',
      email: body.email ?? '',
      phone: body.phone ?? '',
      birth_date: body.birthDate ?? body.birth_date ?? null,
      street: body.street ?? null,
      zip: body.zip ?? null,
      city: body.city ?? null,
      mother_tongue: body.motherTongue ?? body.mother_tongue ?? null,
      licence_class: body.licenceClass ?? body.licence_class ?? '',
      transmission: body.transmission ?? null,
      instructor_id: body.instructorId ?? body.instructor_id ?? null,
      lesson_language: body.lessonLanguage ?? body.lesson_language ?? '',
      has_licence: !!(body.hasLicence ?? body.has_licence),
      existing_licence_class: body.existingLicenceClass ?? body.existing_licence_class ?? null,
      existing_licence_country: body.existingLicenceCountry ?? body.existing_licence_country ?? null,
      bf17: !!body.bf17,
      time_slots: Array.isArray(body.timeSlots) ? body.timeSlots : (body.time_slots ?? null),
      source: body.source ?? null,
      referrer_code: referrerCode,
      payment_status: 'pending',
      stripe_payment_intent_id: null,
      paid_at: null,
    };

    const { data, error } = await admin.from('registrations').insert(row).select('id').single();
    if (error) {
      console.error('[registration]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let myReferralCode = generateReferralCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error: updateErr } = await admin
        .from('registrations')
        .update({ my_referral_code: myReferralCode })
        .eq('id', data.id);
      if (!updateErr) break;
      if (updateErr.code === '23505') {
        myReferralCode = generateReferralCode();
        continue;
      }
      console.error('[registration] update code', updateErr);
      break;
    }

    return NextResponse.json({ id: data.id, myReferralCode });
  } catch (e) {
    console.error('[registration]', e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
