import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Liest und normalisiert die Supabase-URL (trim, muss http(s) sein). */
export function resolveSupabaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!raw) return '';
  try {
    const u = new URL(raw);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.origin;
  } catch {
    return '';
  }
}

const url = resolveSupabaseUrl();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

/** Client für Browser; nur erzeugen wenn URL + Anon-Key gültig. */
export const supabase =
  url && anonKey ? createClient(url, anonKey) : (null as unknown as SupabaseClient);

/** Server-only: für API-Routen mit Schreibrechten (z. B. Buchungen). */
export function getSupabaseAdmin(): SupabaseClient | null {
  const u = resolveSupabaseUrl();
  if (!u || !serviceRoleKey) return null;
  return createClient(u, serviceRoleKey);
}
