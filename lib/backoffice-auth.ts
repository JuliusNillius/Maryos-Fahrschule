import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseUrl } from '@/lib/supabase';

export async function getBackofficeUser(request: Request): Promise<{ email: string } | NextResponse> {
  const url = resolveSupabaseUrl();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token || !url || !serviceRoleKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient(url, serviceRoleKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  const email = user?.email;
  if (error || !email) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  const { data: admins } = await supabase
    .from('backoffice_admins')
    .select('email');
  const isAdmin = admins?.some(
    (row) => row.email?.toLowerCase() === email.toLowerCase()
  );
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { email };
}

export function getSupabaseAdmin() {
  const url = resolveSupabaseUrl();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  if (!url || !key) return null;
  return createClient(url, key);
}
