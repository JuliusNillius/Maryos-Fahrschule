import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/** Client für Browser; nur erzeugen wenn URL + Anon-Key gesetzt (sonst bricht Build ohne Env). */
export const supabase =
  url && anonKey ? createClient(url, anonKey) : (null as unknown as SupabaseClient);

/** Server-only: für API-Routen mit Schreibrechten (z. B. Buchungen). */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey);
}
