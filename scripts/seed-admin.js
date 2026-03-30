/**
 * Einmal ausführen: Legt den Backoffice-Admin juliusa.engels@icloud.com an.
 * Voraussetzung: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Aufruf: node scripts/seed-admin.js
 *
 * Das generierte Passwort wird in der Konsole ausgegeben – bitte nach dem ersten Login ändern.
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// .env.local / .env laden (Node lädt sie nicht automatisch)
const projectRoot = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(projectRoot, '.env.local') });
require('dotenv').config({ path: path.join(projectRoot, '.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Fehler: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein.');
  console.error('Dateien geprüft:', path.join(projectRoot, '.env.local'), 'und', path.join(projectRoot, '.env'));
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = 'juliusa.engels@icloud.com';
const DEFAULT_PASSWORD = 'MaryosBackoffice2025!';

async function main() {
  // 1) E-Mail in backoffice_admins eintragen (sonst: "Account hat keinen Backoffice-Zugang")
  const { error: adminErr } = await supabase
    .from('backoffice_admins')
    .upsert({ email: ADMIN_EMAIL }, { onConflict: 'email' });
  if (adminErr) {
    console.error('Fehler beim Eintragen in backoffice_admins:', adminErr.message);
    process.exit(1);
  }
  console.log('Backoffice-Berechtigung gesetzt:', ADMIN_EMAIL);

  // 2) Auth-User anlegen (falls noch nicht vorhanden)
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === ADMIN_EMAIL);
  if (found) {
    console.log('Auth-User existiert bereits:', ADMIN_EMAIL);
    console.log('Du kannst dich jetzt einloggen. Passwort zurücksetzen: Supabase Dashboard → Authentication → Users.');
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: DEFAULT_PASSWORD,
    email_confirm: true,
  });

  if (error) {
    console.error('Fehler beim Anlegen des Auth-Users:', error.message);
    process.exit(1);
  }

  console.log('Auth-User angelegt:', ADMIN_EMAIL);
  console.log('Passwort:', DEFAULT_PASSWORD);
  console.log('Bitte nach dem ersten Login das Passwort ändern.');
}

main();
