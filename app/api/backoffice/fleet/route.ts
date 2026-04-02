import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function GET(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { data, error } = await supabase
    .from('fleet')
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
  const powerRaw = body.power_ps;
  const powerPs =
    powerRaw === '' || powerRaw === undefined || powerRaw === null
      ? null
      : Number(powerRaw);
  const { data, error } = await supabase
    .from('fleet')
    .insert({
      model: body.model ?? '',
      transmission: body.transmission === 'automatic' ? 'automatic' : 'manual',
      classes: Array.isArray(body.classes) ? body.classes : [],
      image: body.image ?? '',
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
      internal_note: body.internal_note ?? null,
      power_ps: Number.isFinite(powerPs) ? powerPs : null,
      has_driver_assistance: !!body.has_driver_assistance,
      has_apple_carplay: !!body.has_apple_carplay,
      steckbrief_notes:
        typeof body.steckbrief_notes === 'string' && body.steckbrief_notes.trim() ? body.steckbrief_notes.trim() : null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
