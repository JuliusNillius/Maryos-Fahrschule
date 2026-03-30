import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function GET(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { data, error } = await supabase
    .from('instructors')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const body = await request.json();
  const { data, error } = await supabase
    .from('instructors')
    .insert({
      name: body.name ?? '',
      title: body.title ?? '',
      languages: Array.isArray(body.languages) ? body.languages : [],
      classes: Array.isArray(body.classes) ? body.classes : [],
      specialty: body.specialty ?? null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      quote: body.quote ?? '',
      available: !!body.available,
      image: body.image ?? '',
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
      internal_note: body.internal_note ?? null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
