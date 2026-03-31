import { NextResponse } from 'next/server';
import { getBackofficeUser, getSupabaseAdmin } from '@/lib/backoffice-auth';

function safeExtFromType(t: string): string {
  if (t === 'image/jpeg') return 'jpg';
  if (t === 'image/png') return 'png';
  if (t === 'image/webp') return 'webp';
  return 'bin';
}

export async function POST(request: Request) {
  const user = await getBackofficeUser(request);
  if (user instanceof NextResponse) return user;

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const fd = await request.formData();
  const file = fd.get('file');
  const scope = String(fd.get('scope') ?? '');
  const entityId = String(fd.get('id') ?? '');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file fehlt' }, { status: 400 });
  }
  if (scope !== 'instructors' && scope !== 'fleet') {
    return NextResponse.json({ error: 'scope ungültig' }, { status: 400 });
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: 'Datei zu groß (max 8MB)' }, { status: 400 });
  }

  const ext = safeExtFromType(file.type);
  const ts = Date.now();
  const baseName = entityId ? entityId : `new-${ts}`;
  const path = `${scope}/${baseName}-${ts}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from('site-images')
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  const publicUrl = data?.publicUrl ? `${data.publicUrl}?v=${ts}` : '';

  return NextResponse.json({ path, publicUrl });
}

