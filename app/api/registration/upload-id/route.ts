import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import {
  ID_DOCUMENT_MAX_BYTES,
  isAllowedIdMime,
  extensionForMime,
} from '@/lib/id-documents';

const BUCKET = 'registration-ids';

/**
 * Nach POST /api/registration: Ausweis vorne/hinten hochladen.
 * Absicherung: registrationId + E-Mail müssen zur Zeile passen (pending).
 */
export async function POST(request: Request) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

    const form = await request.formData();
    const registrationId = String(form.get('registrationId') ?? '').trim();
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const front = form.get('front');
    const back = form.get('back');

    if (!registrationId || !email) {
      return NextResponse.json({ error: 'registrationId und email erforderlich' }, { status: 400 });
    }
    if (!(front instanceof File) || !(back instanceof File)) {
      return NextResponse.json({ error: 'Vorder- und Rückseite als Datei erforderlich' }, { status: 400 });
    }

    for (const f of [front, back]) {
      if (f.size > ID_DOCUMENT_MAX_BYTES || !isAllowedIdMime(f.type)) {
        return NextResponse.json(
          { error: 'Ungültige Datei: nur JPEG/PNG/Webp, max. 5 MB pro Seite' },
          { status: 400 }
        );
      }
    }

    const { data: row, error: fetchErr } = await admin
      .from('registrations')
      .select('id, email, payment_status')
      .eq('id', registrationId)
      .maybeSingle();

    if (fetchErr || !row) {
      return NextResponse.json({ error: 'Anmeldung nicht gefunden' }, { status: 404 });
    }
    if (String(row.email).toLowerCase() !== email) {
      return NextResponse.json({ error: 'E-Mail stimmt nicht zur Anmeldung' }, { status: 403 });
    }

    const extF = extensionForMime(front.type);
    const extB = extensionForMime(back.type);
    const pathFront = `${registrationId}/id-front.${extF}`;
    const pathBack = `${registrationId}/id-back.${extB}`;

    const bufF = Buffer.from(await front.arrayBuffer());
    const bufB = Buffer.from(await back.arrayBuffer());

    const { error: upF } = await admin.storage.from(BUCKET).upload(pathFront, bufF, {
      contentType: front.type,
      upsert: true,
    });
    if (upF) {
      console.error('[upload-id] front', upF);
      return NextResponse.json({ error: 'Upload Vorderseite fehlgeschlagen' }, { status: 500 });
    }

    const { error: upB } = await admin.storage.from(BUCKET).upload(pathBack, bufB, {
      contentType: back.type,
      upsert: true,
    });
    if (upB) {
      console.error('[upload-id] back', upB);
      return NextResponse.json({ error: 'Upload Rückseite fehlgeschlagen' }, { status: 500 });
    }

    const { error: updErr } = await admin
      .from('registrations')
      .update({
        id_document_front_path: pathFront,
        id_document_back_path: pathBack,
      })
      .eq('id', registrationId);

    if (updErr) {
      console.error('[upload-id] db', updErr);
      return NextResponse.json({ error: 'Speichern der Pfade fehlgeschlagen' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pathFront, pathBack });
  } catch (e) {
    console.error('[upload-id]', e);
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 });
  }
}
