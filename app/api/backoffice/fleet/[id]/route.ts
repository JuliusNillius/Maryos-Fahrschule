import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { data, error } = await supabase.from('fleet').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const body = await request.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.model === 'string') updates.model = body.model;
  if (body.transmission === 'automatic' || body.transmission === 'manual') updates.transmission = body.transmission;
  if (Array.isArray(body.classes)) updates.classes = body.classes;
  if (typeof body.image === 'string') updates.image = body.image;
  if (body.power_ps !== undefined) {
    const powerRaw = body.power_ps;
    const n =
      powerRaw === '' || powerRaw === undefined || powerRaw === null ? null : Number(powerRaw);
    updates.power_ps = n != null && Number.isFinite(n) ? n : null;
  }
  if (body.has_driver_assistance !== undefined) updates.has_driver_assistance = !!body.has_driver_assistance;
  if (body.has_apple_carplay !== undefined) updates.has_apple_carplay = !!body.has_apple_carplay;
  if (body.steckbrief_notes !== undefined) {
    updates.steckbrief_notes =
      typeof body.steckbrief_notes === 'string' && body.steckbrief_notes.trim()
        ? body.steckbrief_notes.trim()
        : null;
  }
  if (typeof body.sort_order === 'number') updates.sort_order = body.sort_order;
  if (body.internal_note !== undefined) updates.internal_note = body.internal_note;
  const { data, error } = await supabase.from('fleet').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  const { error } = await supabase.from('fleet').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
