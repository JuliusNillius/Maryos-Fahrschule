import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function GET(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { data, error } = await supabase.from('faq').select('*').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const body = await request.json();
  const { data, error } = await supabase
    .from('faq')
    .insert({
      sort_order: body.sort_order ?? 0,
      question_de: body.question_de ?? '',
      answer_de: body.answer_de ?? '',
      question_en: body.question_en ?? null,
      answer_en: body.answer_en ?? null,
      question_tr: body.question_tr ?? null,
      answer_tr: body.answer_tr ?? null,
      question_ar: body.question_ar ?? null,
      answer_ar: body.answer_ar ?? null,
      question_ru: body.question_ru ?? null,
      answer_ru: body.answer_ru ?? null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
