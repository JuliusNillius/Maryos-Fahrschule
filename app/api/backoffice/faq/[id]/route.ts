import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (typeof body.sort_order === 'number') updates.sort_order = body.sort_order;
  if (typeof body.question_de === 'string') updates.question_de = body.question_de;
  if (typeof body.answer_de === 'string') updates.answer_de = body.answer_de;
  if (body.question_en !== undefined) updates.question_en = body.question_en;
  if (body.answer_en !== undefined) updates.answer_en = body.answer_en;
  if (body.question_tr !== undefined) updates.question_tr = body.question_tr;
  if (body.answer_tr !== undefined) updates.answer_tr = body.answer_tr;
  if (body.question_ar !== undefined) updates.question_ar = body.question_ar;
  if (body.answer_ar !== undefined) updates.answer_ar = body.answer_ar;
  if (body.question_ru !== undefined) updates.question_ru = body.question_ru;
  if (body.answer_ru !== undefined) updates.answer_ru = body.answer_ru;
  const { data, error } = await supabase.from('faq').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
