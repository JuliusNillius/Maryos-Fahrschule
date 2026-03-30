import { redirect } from 'next/navigation';

/**
 * /documents → Weiterleitung zur statischen Übersicht (ohne App-Layout/„Anmelden“).
 */
export default function DocumentsPage() {
  redirect('/documents/index.html');
}
