/**
 * Fügt eine E-Mail als Backoffice-Admin hinzu (nur die Berechtigung, kein Passwort).
 * Der User muss in Supabase Auth existieren und sich mit dieser E-Mail einloggen.
 *
 * Aufruf: node scripts/add-backoffice-admin.js "deine@email.de"
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const projectRoot = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(projectRoot, '.env.local') });
require('dotenv').config({ path: path.join(projectRoot, '.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2]?.trim();

if (!url || !serviceRoleKey) {
  console.error('Fehler: .env.local mit NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY benötigt.');
  process.exit(1);
}
if (!email || !email.includes('@')) {
  console.error('Verwendung: node scripts/add-backoffice-admin.js "deine@email.de"');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { error } = await supabase
    .from('backoffice_admins')
    .upsert({ email }, { onConflict: 'email' });

  if (error) {
    console.error('Fehler:', error.message);
    process.exit(1);
  }
  console.log('Backoffice-Zugang aktiviert für:', email);
  console.log('Einloggen mit dieser E-Mail und deinem Supabase-Auth-Passwort.');
  console.log('Falls noch kein Auth-User existiert: npm run seed:admin (legt juliusa.engels@icloud.com an) oder User in Supabase Dashboard → Authentication → Users anlegen.');
}

main();
