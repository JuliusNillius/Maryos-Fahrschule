'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Reg = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  licence_class: string;
  instructor_id: string | null;
  offer_type?: string | null;
  bundle_lesson_hours?: number | null;
  promo_lesson_hours?: number | null;
  payment_status: string;
  paid_at: string | null;
  id_document_front_path: string | null;
  id_document_back_path: string | null;
};

export default function BackofficeAnmeldungenPage() {
  const [list, setList] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchList() {
    const { data: { session } } = await supabase!.auth.getSession();
    const url = filter ? `/api/backoffice/registrations?payment_status=${filter}` : '/api/backoffice/registrations';
    const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
    if (res.ok) setList(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    if (supabase) fetchList();
    else setLoading(false);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const dateStr = (s: string) =>
    s
      ? new Date(s).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '–';

  async function openIdDoc(id: string, side: 'front' | 'back') {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      alert('Nicht angemeldet.');
      return;
    }
    const res = await fetch(`/api/backoffice/registrations/${id}/id-document?side=${side}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    let j: { url?: string; error?: string } = {};
    try {
      j = await res.json();
    } catch {
      alert('Antwort konnte nicht gelesen werden.');
      return;
    }
    if (!res.ok) {
      alert(j.error || `Fehler ${res.status}`);
      return;
    }
    if (!j.url) {
      alert('Keine Vorschau-URL erhalten.');
      return;
    }
    setPreview({
      url: j.url,
      label: side === 'front' ? 'Ausweis Vorderseite' : 'Ausweis Rückseite',
    });
  }

  async function deletePending(id: string) {
    if (!supabase) return;
    if (!confirm('Diese offene Anmeldung wirklich löschen? (inkl. Ausweis-Dateien, falls vorhanden)')) return;
    setDeletingId(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/backoffice/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(j.error || `Löschen fehlgeschlagen (${res.status})`);
        return;
      }
      await fetchList();
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <p className="text-text-muted">Lade …</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white">Anmeldungen</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white"
        >
          <option value="">Alle</option>
          <option value="pending">Offen</option>
          <option value="paid">Bezahlt</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-3 font-semibold text-white">Datum</th>
              <th className="p-3 font-semibold text-white">Name</th>
              <th className="p-3 font-semibold text-white">E-Mail</th>
              <th className="p-3 font-semibold text-white">Klasse</th>
              <th className="p-3 font-semibold text-white">Angebot</th>
              <th className="p-3 font-semibold text-white">Status</th>
              <th className="p-3 font-semibold text-white">Ausweis</th>
              <th className="p-3 font-semibold text-white">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="p-3 text-text-muted">{dateStr(row.created_at)}</td>
                <td className="p-3 text-white">
                  {row.first_name} {row.last_name}
                </td>
                <td className="p-3 text-text-muted">{row.email}</td>
                <td className="p-3 text-white">{row.licence_class}</td>
                <td className="max-w-[14rem] p-3 text-xs text-text-muted">
                  {row.offer_type === 'bundle_10_promo'
                    ? `10 Fahrstunden (davon ${row.promo_lesson_hours ?? 1} Angebot)`
                    : 'Standard'}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${row.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-400'}`}
                  >
                    {row.payment_status === 'paid' ? 'Bezahlt' : 'Offen'}
                  </span>
                </td>
                <td className="p-3">
                  {!row.id_document_front_path && !row.id_document_back_path ? (
                    <span className="text-xs text-text-muted">–</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {row.id_document_front_path ? (
                        <button
                          type="button"
                          onClick={() => openIdDoc(row.id, 'front')}
                          className="rounded bg-white/10 px-2 py-1 text-xs text-green-400 hover:bg-white/20"
                        >
                          Vorderseite
                        </button>
                      ) : null}
                      {row.id_document_back_path ? (
                        <button
                          type="button"
                          onClick={() => openIdDoc(row.id, 'back')}
                          className="rounded bg-white/10 px-2 py-1 text-xs text-green-400 hover:bg-white/20"
                        >
                          Rückseite
                        </button>
                      ) : null}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  {row.payment_status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => deletePending(row.id)}
                      disabled={deletingId === row.id}
                      className="rounded border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deletingId === row.id ? '…' : 'Löschen'}
                    </button>
                  ) : (
                    <span className="text-xs text-text-muted">–</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="mt-4 text-text-muted">Keine Anmeldungen.</p>}

      {preview && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/90 p-4"
          role="presentation"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-h-[95vh] w-full max-w-4xl rounded-xl border border-white/10 bg-[#0F0F0F] p-4 shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-semibold text-white">{preview.label}</p>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm text-white hover:bg-white/10"
              >
                Schließen
              </button>
            </div>
            <img src={preview.url} alt="" className="mx-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain" />
            <p className="mt-2 text-center text-xs text-text-muted">
              Tipp: Rechtsklick zum Speichern oder in neuem Tab öffnen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
