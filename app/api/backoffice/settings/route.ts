import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function GET(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, unknown> = {};
  (data ?? []).forEach((r: { key: string; value: unknown }) => { map[r.key] = r.value; });
  return NextResponse.json(map);
}

export async function PATCH(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const body = await request.json();
  for (const key of Object.keys(body)) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value: body[key], updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data } = await supabase.from('site_settings').select('key, value');
  const map: Record<string, unknown> = {};
  (data ?? []).forEach((r: { key: string; value: unknown }) => { map[r.key] = r.value; });
  return NextResponse.json(map);
}
