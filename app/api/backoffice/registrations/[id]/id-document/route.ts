import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

const BUCKET = 'registration-ids';

/** Signierte URL zum Ansehen eines Ausweisfotos (nur Backoffice). */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const side = searchParams.get('side');
  if (side !== 'front' && side !== 'back') {
    return NextResponse.json({ error: 'side=front|back' }, { status: 400 });
  }

  const { data: row, error } = await admin
    .from('registrations')
    .select('id_document_front_path, id_document_back_path')
    .eq('id', id)
    .maybeSingle();

  if (error || !row) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

  const path = side === 'front' ? row.id_document_front_path : row.id_document_back_path;
  if (!path) return NextResponse.json({ error: 'Kein Dokument' }, { status: 404 });

  const { data: signed, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(path, 120);

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Link konnte nicht erstellt werden' }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl });
}
