import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function GET(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { data, error } = await supabase.from('pricing').select('*').order('class_id');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const body = await request.json();
  const updates = Array.isArray(body) ? body : [body];
  for (const u of updates) {
    const { error } = await supabase
      .from('pricing')
      .update({
        price: u.price,
        popular: !!u.popular,
        note: u.note ?? null,
      })
      .eq('class_id', u.class_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data } = await supabase.from('pricing').select('*').order('class_id');
  return NextResponse.json(data ?? []);
}
