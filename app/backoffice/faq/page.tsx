'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const FAQ_CATEGORIES = [
  { value: 'allgemein', label: 'Allgemein' },
  { value: 'preise', label: 'Preise' },
  { value: 'klassen', label: 'Klassen' },
  { value: 'foerderung', label: 'Förderung' },
  { value: 'anmeldung', label: 'Anmeldung' },
] as const;

type FaqRow = {
  id: string;
  sort_order: number;
  category?: string;
  question_de: string;
  answer_de: string;
  question_en: string | null;
  answer_en: string | null;
  question_tr: string | null;
  answer_tr: string | null;
  question_ar: string | null;
  answer_ar: string | null;
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

  useEffect(() => {
    if (!editing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [editing]);

  function openEdit(row: FaqRow) {
    setEditing(row);
    setForm({ ...row });
  }

  function openNew() {
    setEditing({
      id: '',
      sort_order: list.length,
      category: 'allgemein',
      question_de: '',
      answer_de: '',
      question_en: null,
      answer_en: null,
      question_tr: null,
      answer_tr: null,
      question_ar: null,
      answer_ar: null,
    });
    setForm({
      sort_order: list.length,
      category: 'allgemein',
      question_de: '',
      answer_de: '',
      question_en: '',
      answer_en: '',
      question_tr: '',
      answer_tr: '',
      question_ar: '',
      answer_ar: '',
    });
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
        if (res.ok) {
          setEditing(null);
          fetchList();
        }
      } else {
        const res = await fetch('/api/backoffice/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            sort_order: form.sort_order ?? 0,
            category: form.category || 'allgemein',
            question_de: form.question_de ?? '',
            answer_de: form.answer_de ?? '',
            question_en: form.question_en || null,
            answer_en: form.answer_en || null,
            question_tr: form.question_tr || null,
            answer_tr: form.answer_tr || null,
            question_ar: form.question_ar || null,
            answer_ar: form.answer_ar || null,
          }),
        });
        if (res.ok) {
          setEditing(null);
          fetchList();
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('FAQ-Eintrag löschen?')) return;
    const { data: { session } } = await supabase.auth.getSession();
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
          <div key={row.id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0F0F0F] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-text-muted">
                {row.category || 'allgemein'}
              </span>
              <p className="font-medium text-white">{row.question_de}</p>
              <p className="text-sm text-text-muted line-clamp-2">{row.answer_de}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => openEdit(row)} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10" data-testid={`backoffice-faq-edit-${row.id}`}>Bearbeiten</button>
              <button type="button" onClick={() => remove(row.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10" data-testid={`backoffice-faq-delete-${row.id}`}>Löschen</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div
          data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 md:p-6"
          role="presentation"
          onClick={() => setEditing(null)}
        >
          <div
            className="my-auto flex w-full max-w-2xl min-h-0 max-h-[min(92vh,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F] shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 border-b border-white/10 px-5 pt-5 pb-3">
              <h2 className="font-heading text-lg font-bold italic text-white">{editing.id ? 'FAQ bearbeiten' : 'Neuer FAQ-Eintrag'}</h2>
            </div>
            <div className="max-h-[min(72vh,calc(100dvh-11rem))] min-h-0 shrink overflow-y-auto overscroll-y-contain px-5 py-4 touch-pan-y [-webkit-overflow-scrolling:touch]">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-text-muted">Reihenfolge</label>
                    <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-text-muted">Kategorie (Filter auf der FAQ-Seite)</label>
                    <select
                      value={form.category ?? 'allgemein'}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className={inputClass}
                    >
                      {FAQ_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Frage (DE)</label>
                  <input value={form.question_de ?? ''} onChange={(e) => setForm((f) => ({ ...f, question_de: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Antwort (DE) — Zeilenumbrüche möglich</label>
                  <textarea value={form.answer_de ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer_de: e.target.value }))} className={inputClass} rows={5} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Frage (TR)</label>
                  <input value={form.question_tr ?? ''} onChange={(e) => setForm((f) => ({ ...f, question_tr: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Antwort (TR)</label>
                  <textarea value={form.answer_tr ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer_tr: e.target.value }))} className={inputClass} rows={4} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Frage (AR)</label>
                  <input value={form.question_ar ?? ''} onChange={(e) => setForm((f) => ({ ...f, question_ar: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Antwort (AR)</label>
                  <textarea value={form.answer_ar ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer_ar: e.target.value }))} className={inputClass} rows={4} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Frage (EN, optional)</label>
                  <input value={form.question_en ?? ''} onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-text-muted">Antwort (EN, optional)</label>
                  <textarea value={form.answer_en ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer_en: e.target.value }))} className={inputClass} rows={3} />
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 border-t border-white/10 bg-[#0F0F0F] px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10" data-testid="backoffice-faq-cancel">Abbrechen</button>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-sm" data-testid="backoffice-faq-save">{saving ? '…' : 'Speichern'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
