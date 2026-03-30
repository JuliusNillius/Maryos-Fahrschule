'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const LANGUAGES = ['de', 'ar', 'tr', 'ru', 'en', 'fr'];
const CLASSES = ['B', 'BE', 'A', 'A1', 'A2', 'AM'];

type Instructor = {
  id: string;
  name: string;
  title: string;
  languages: string[];
  classes: string[];
  specialty: string | null;
  tags: string[];
  quote: string;
  available: boolean;
  image: string;
  sort_order: number;
  internal_note: string | null;
};

export default function BackofficeLehrerPage() {
  const [list, setList] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [form, setForm] = useState<Partial<Instructor>>({});
  const [saving, setSaving] = useState(false);

  async function fetchList() {
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch('/api/backoffice/instructors', {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (supabase) fetchList();
    else setLoading(false);
  }, []);

  function openEdit(item: Instructor) {
    setEditing(item);
    setForm({
      name: item.name,
      title: item.title,
      languages: [...(item.languages || [])],
      classes: [...(item.classes || [])],
      specialty: item.specialty ?? '',
      tags: [...(item.tags || [])],
      quote: item.quote,
      available: item.available,
      image: item.image,
      sort_order: item.sort_order,
      internal_note: item.internal_note ?? '',
    });
  }

  function openNew() {
    setEditing({ id: '', name: '', title: '', languages: [], classes: [], tags: [], quote: '', available: true, image: '', sort_order: list.length, specialty: null, internal_note: null });
    setForm({
      name: '',
      title: '',
      languages: [],
      classes: [],
      specialty: '',
      tags: [],
      quote: '',
      available: true,
      image: '',
      sort_order: list.length,
      internal_note: '',
    });
  }

  async function save() {
    if (!editing || !supabase) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const body = {
      ...form,
      languages: form.languages ?? [],
      classes: form.classes ?? [],
      tags: form.tags ?? [],
    };
    try {
      if (editing.id) {
        const res = await fetch(`/api/backoffice/instructors/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setEditing(null);
          fetchList();
        } else {
          const err = await res.json();
          alert(err.error || 'Fehler');
        }
      } else {
        const res = await fetch('/api/backoffice/instructors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setEditing(null);
          fetchList();
        } else {
          const err = await res.json();
          alert(err.error || 'Fehler');
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Fahrlehrer wirklich entfernen?')) return;
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch(`/api/backoffice/instructors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (res.ok) fetchList();
  }

  function toggleArray(arr: string[], key: string, value: string) {
    const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
    setForm((f) => ({ ...f, [key]: next }));
  }

  if (loading) return <p className="text-text-muted">Lade …</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white">Fahrlehrer</h1>
        <button type="button" onClick={openNew} className="btn-primary" data-testid="backoffice-lehrer-new">
          + Neu
        </button>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-[#0F0F0F] p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/10">
              {item.image ? (
                <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
              ) : (
                <span className="flex h-full items-center justify-center text-2xl text-text-muted">👤</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-text-muted">{item.title} · {item.classes?.join(', ')}</p>
            </div>
            <span className={`rounded px-2 py-1 text-xs ${item.available ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-text-muted'}`}>
              {item.available ? 'Verfügbar' : 'Nicht buchbar'}
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={() => openEdit(item)} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10">
                Bearbeiten
              </button>
              <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#0F0F0F] p-6">
            <h2 className="font-heading text-lg font-bold italic text-white mb-4">
              {editing.id ? 'Fahrlehrer bearbeiten' : 'Neuer Fahrlehrer'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Name</label>
                <input
                  value={form.name ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Titel</label>
                <input
                  value={form.title ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Bild-URL</label>
                <input
                  value={form.image ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Sprachen</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleArray(form.languages ?? [], 'languages', lang)}
                      className={`rounded px-2 py-1 text-sm ${(form.languages ?? []).includes(lang) ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-text-muted'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Klassen</label>
                <div className="flex flex-wrap gap-2">
                  {CLASSES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleArray(form.classes ?? [], 'classes', c)}
                      className={`rounded px-2 py-1 text-sm ${(form.classes ?? []).includes(c) ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-text-muted'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Tags (kommagetrennt)</label>
                <input
                  value={(form.tags ?? []).join(', ')}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                  placeholder="Geduldig, Erfahren"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Spezialität</label>
                <input
                  value={form.specialty ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Zitat</label>
                <input
                  value={form.quote ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Reihenfolge</label>
                <input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.available ?? true}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  className="rounded text-green-500"
                />
                <span className="text-sm text-white">Verfügbar (buchbar)</span>
              </label>
              <div>
                <label className="block text-sm text-text-muted mb-1">Interne Notiz (nur Backoffice)</label>
                <input
                  value={form.internal_note ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, internal_note: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10" data-testid="backoffice-lehrer-cancel">
                Abbrechen
              </button>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-sm" data-testid="backoffice-lehrer-save">
                {saving ? '…' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
