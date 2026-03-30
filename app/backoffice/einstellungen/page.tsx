'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Settings = {
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    street?: string;
    zip?: string;
    city?: string;
    mapUrl?: string;
  };
  opening_hours?: { text?: string };
  stats?: { googleRating?: number; googleReviews?: number; languages?: number; classes?: number };
  impressum?: { company?: string; street?: string; zip?: string; city?: string; register?: string; owner?: string };
  social?: { instagram?: string; tiktok?: string; facebook?: string };
  email_welcome?: { subject?: string; body?: string };
};

export default function BackofficeEinstellungenPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchSettings() {
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch('/api/backoffice/settings', {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (res.ok) setSettings(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    if (supabase) fetchSettings();
    else setLoading(false);
  }, []);

  function update(key: keyof Settings, value: Settings[keyof Settings]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const { data: { session } } = await supabase!.auth.getSession();
    await fetch('/api/backoffice/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  }

  if (loading) return <p className="text-text-muted">Lade …</p>;

  const c = settings.contact ?? {};
  const oh = settings.opening_hours ?? {};
  const st = settings.stats ?? {};
  const imp = settings.impressum ?? {};
  const soc = settings.social ?? {};
  const ew = settings.email_welcome ?? {};

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white">Einstellungen</h1>
        <button type="button" onClick={save} disabled={saving} className="btn-primary" data-testid="backoffice-einstellungen-save">
          {saving ? '…' : 'Speichern'}
        </button>
      </div>

      <div className="space-y-8">
        <section className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="font-heading text-lg font-bold italic text-green-500 mb-4">Kontakt</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-text-muted mb-1">Telefon (Anzeige)</label>
              <input value={c.phone ?? ''} onChange={(e) => update('contact', { ...c, phone: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">WhatsApp (Nummer ohne +)</label>
              <input value={c.whatsapp ?? ''} onChange={(e) => update('contact', { ...c, whatsapp: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" placeholder="491784557528" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">E-Mail</label>
              <input type="email" value={c.email ?? ''} onChange={(e) => update('contact', { ...c, email: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Straße</label>
              <input value={c.street ?? ''} onChange={(e) => update('contact', { ...c, street: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">PLZ</label>
              <input value={c.zip ?? ''} onChange={(e) => update('contact', { ...c, zip: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Ort</label>
              <input value={c.city ?? ''} onChange={(e) => update('contact', { ...c, city: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Google-Maps-Embed-URL</label>
              <input value={c.mapUrl ?? ''} onChange={(e) => update('contact', { ...c, mapUrl: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" placeholder="https://maps.google.com/..." />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="font-heading text-lg font-bold italic text-green-500 mb-4">Öffnungszeiten</h2>
          <div>
            <label className="block text-sm text-text-muted mb-1">Text (z.B. Mo–Fr 12:00–18:00)</label>
            <input value={oh.text ?? ''} onChange={(e) => update('opening_hours', { text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="font-heading text-lg font-bold italic text-green-500 mb-4">Statistiken (Startseite)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Google-Bewertung</label>
              <input type="number" step="0.1" value={st.googleRating ?? ''} onChange={(e) => update('stats', { ...st, googleRating: parseFloat(e.target.value) || 0 })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Anzahl Bewertungen</label>
              <input type="number" value={st.googleReviews ?? ''} onChange={(e) => update('stats', { ...st, googleReviews: parseInt(e.target.value, 10) || 0 })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Sprachen</label>
              <input type="number" value={st.languages ?? ''} onChange={(e) => update('stats', { ...st, languages: parseInt(e.target.value, 10) || 0 })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Klassen</label>
              <input type="number" value={st.classes ?? ''} onChange={(e) => update('stats', { ...st, classes: parseInt(e.target.value, 10) || 0 })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="font-heading text-lg font-bold italic text-green-500 mb-4">Soziale Medien (Footer)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Instagram-URL</label>
              <input value={soc.instagram ?? ''} onChange={(e) => update('social', { ...soc, instagram: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" placeholder="https://instagram.com/maryos_fahrschule" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">TikTok-URL</label>
              <input value={soc.tiktok ?? ''} onChange={(e) => update('social', { ...soc, tiktok: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" placeholder="https://tiktok.com/@maryos_fahrschule" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Facebook-URL</label>
              <input value={soc.facebook ?? ''} onChange={(e) => update('social', { ...soc, facebook: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" placeholder="https://facebook.com/maryosfahrschule" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="font-heading text-lg font-bold italic text-green-500 mb-4">Impressum</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Firma</label>
              <input value={imp.company ?? ''} onChange={(e) => update('impressum', { ...imp, company: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Straße</label>
              <input value={imp.street ?? ''} onChange={(e) => update('impressum', { ...imp, street: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">PLZ</label>
              <input value={imp.zip ?? ''} onChange={(e) => update('impressum', { ...imp, zip: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Ort</label>
              <input value={imp.city ?? ''} onChange={(e) => update('impressum', { ...imp, city: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Register (z.B. HRB 23787)</label>
              <input value={imp.register ?? ''} onChange={(e) => update('impressum', { ...imp, register: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-text-muted mb-1">Geschäftsführer / Inhaber</label>
              <input value={imp.owner ?? ''} onChange={(e) => update('impressum', { ...imp, owner: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="font-heading text-lg font-bold italic text-green-500 mb-4">E-Mail Willkommen (nach Anmeldung)</h2>
          <p className="text-sm text-text-muted mb-2">Platzhalter: &#123;&#123;firstName&#125;&#125;, &#123;&#123;licenceClass&#125;&#125;, &#123;&#123;phone&#125;&#125;</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Betreff</label>
              <input value={ew.subject ?? ''} onChange={(e) => update('email_welcome', { ...ew, subject: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">HTML-Body</label>
              <textarea value={ew.body ?? ''} onChange={(e) => update('email_welcome', { ...ew, body: e.target.value })} className="w-full min-h-[200px] rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none" rows={10} />
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
