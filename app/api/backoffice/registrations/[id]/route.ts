import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

const BUCKET = 'registration-ids';

/** Nur pending-Anmeldungen löschen (z. B. Tests). */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { id } = await params;

  const { data: row, error: fetchErr } = await admin
    .from('registrations')
    .select('payment_status, id_document_front_path, id_document_back_path')
    .eq('id', id)
    .maybeSingle();

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!row) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

  if (row.payment_status !== 'pending') {
    return NextResponse.json(
      { error: 'Nur offene (unbezahlte) Anmeldungen können gelöscht werden.' },
      { status: 400 }
    );
  }

  const paths = [row.id_document_front_path, row.id_document_back_path].filter(
    (p): p is string => Boolean(p)
  );
  if (paths.length > 0) {
    const { error: rmErr } = await admin.storage.from(BUCKET).remove(paths);
    if (rmErr) console.error('registration delete: storage remove', rmErr);
  }

  const { error: delErr } = await admin.from('registrations').delete().eq('id', id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
