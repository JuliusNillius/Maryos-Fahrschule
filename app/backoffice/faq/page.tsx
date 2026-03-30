'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type FaqRow = {
  id: string;
  sort_order: number;
  question_de: string;
  answer_de: string;
  question_en: string | null;
  answer_en: string | null;
};

export default function BackofficeFaqPage() {
  const [list, setList] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [form, setForm] = useState<Partial<FaqRow>>({});
  const [saving, setSaving] = useState(false);

  const inputClass = 'w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-white focus:border-green-500 focus:outline-none';

  async function fetchList() {
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch('/api/backoffice/faq', { headers: { Authorization: `Bearer ${session?.access_token}` } });
    if (res.ok) setList(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    if (supabase) fetchList();
    else setLoading(false);
  }, []);

  function openEdit(row: FaqRow) {
    setEditing(row);
    setForm({ ...row });
  }

  function openNew() {
    setEditing({ id: '', sort_order: list.length, question_de: '', answer_de: '', question_en: null, answer_en: null });
    setForm({ sort_order: list.length, question_de: '', answer_de: '', question_en: '', answer_en: '' });
  }

  async function save() {
    if (!editing || !supabase) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    try {
      if (editing.id) {
        const res = await fetch(`/api/backoffice/faq/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (res.ok) { setEditing(null); fetchList(); }
      } else {
        const res = await fetch('/api/backoffice/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            sort_order: form.sort_order ?? 0,
            question_de: form.question_de ?? '',
            answer_de: form.answer_de ?? '',
            question_en: form.question_en || null,
            answer_en: form.answer_en || null,
          }),
        });
        if (res.ok) { setEditing(null); fetchList(); }
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('FAQ-Eintrag löschen?')) return;
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch(`/api/backoffice/faq/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session?.access_token}` } });
    if (res.ok) fetchList();
  }

  if (loading) return <p className="text-text-muted">Lade …</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white">FAQ</h1>
        <button type="button" onClick={openNew} className="btn-primary" data-testid="backoffice-faq-new">+ Neu</button>
      </div>
      <div className="space-y-3">
        {list.map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F0F0F] p-4">
            <div>
              <p className="font-medium text-white">{row.question_de}</p>
              <p className="text-sm text-text-muted line-clamp-1">{row.answer_de}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(row)} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10" data-testid={`backoffice-faq-edit-${row.id}`}>Bearbeiten</button>
              <button type="button" onClick={() => remove(row.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10" data-testid={`backoffice-faq-delete-${row.id}`}>Löschen</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
            <h2 className="font-heading text-lg font-bold italic text-white mb-4">{editing.id ? 'FAQ bearbeiten' : 'Neuer FAQ-Eintrag'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Reihenfolge</label>
                <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Frage (DE)</label>
                <input value={form.question_de ?? ''} onChange={(e) => setForm((f) => ({ ...f, question_de: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Antwort (DE)</label>
                <textarea value={form.answer_de ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer_de: e.target.value }))} className={inputClass} rows={3} />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Frage (EN, optional)</label>
                <input value={form.question_en ?? ''} onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Antwort (EN, optional)</label>
                <textarea value={form.answer_en ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))} className={inputClass} rows={3} />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10" data-testid="backoffice-faq-cancel">Abbrechen</button>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-sm" data-testid="backoffice-faq-save">{saving ? '…' : 'Speichern'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
