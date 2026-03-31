'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const CLASSES = ['B', 'BF17'];

type FleetItem = {
  id: string;
  model: string;
  transmission: string;
  classes: string[];
  image: string;
  sort_order: number;
  internal_note: string | null;
};

export default function BackofficeFlottePage() {
  const [list, setList] = useState<FleetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FleetItem | null>(null);
  const [form, setForm] = useState<Partial<FleetItem>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function fetchList() {
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch('/api/backoffice/fleet', {
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

  useEffect(() => {
    if (!editing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [editing]);

  function openEdit(item: FleetItem) {
    setEditing(item);
    setForm({
      model: item.model,
      transmission: item.transmission,
      classes: [...(item.classes || [])],
      image: item.image,
      sort_order: item.sort_order,
      internal_note: item.internal_note ?? '',
    });
  }

  function openNew() {
    setEditing({
      id: '',
      model: '',
      transmission: 'manual',
      classes: [],
      image: '',
      sort_order: list.length,
      internal_note: null,
    });
    setForm({
      model: '',
      transmission: 'manual',
      classes: [],
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
      classes: form.classes ?? [],
      transmission: form.transmission === 'automatic' ? 'automatic' : 'manual',
    };
    try {
      if (editing.id) {
        const res = await fetch(`/api/backoffice/fleet/${editing.id}`, {
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
        const res = await fetch('/api/backoffice/fleet', {
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

  async function uploadImage(file: File) {
    if (!supabase) return;
    setUploadingImage(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const fd = new FormData();
      fd.set('file', file);
      fd.set('scope', 'fleet');
      if (editing?.id) fd.set('id', editing.id);

      const res = await fetch('/api/backoffice/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(json.error || 'Upload fehlgeschlagen');
        return;
      }
      setForm((f) => ({ ...f, image: json.publicUrl || '' }));
    } finally {
      setUploadingImage(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Fahrzeug wirklich aus der Flotte entfernen?')) return;
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch(`/api/backoffice/fleet/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (res.ok) fetchList();
  }

  function toggleClass(c: string) {
    const next = (form.classes ?? []).includes(c)
      ? (form.classes ?? []).filter((x) => x !== c)
      : [...(form.classes ?? []), c];
    setForm((f) => ({ ...f, classes: next }));
  }

  if (loading) return <p className="text-text-muted">Lade …</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white">Flotte</h1>
        <button type="button" onClick={openNew} className="btn-primary">
          + Neu
        </button>
      </div>

      <div className="space-y-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-[#0F0F0F] p-4"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-white/10">
              {item.image ? (
                <Image src={item.image} alt="" fill className="object-cover" sizes="96px" />
              ) : (
                <span className="flex h-full items-center justify-center text-2xl text-text-muted">🚗</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{item.model}</p>
              <p className="text-sm text-text-muted">
                {item.transmission === 'automatic' ? 'Automatik' : 'Schaltung'} · {item.classes?.join(', ') || '–'}
              </p>
            </div>
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
        <div
          data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 md:p-6"
          role="presentation"
          onClick={() => setEditing(null)}
        >
          <div
            className="my-auto flex w-full max-w-lg min-h-0 max-h-[min(92vh,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F] shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 border-b border-white/10 px-5 pt-5 pb-3">
              <h2 className="font-heading text-lg font-bold italic text-white">
                {editing.id ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
              </h2>
            </div>
            <div className="max-h-[min(72vh,calc(100dvh-11rem))] min-h-0 shrink overflow-y-auto overscroll-y-contain px-5 py-4 touch-pan-y [-webkit-overflow-scrolling:touch]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Modell / Bezeichnung</label>
                <input
                  value={form.model ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                  placeholder="z. B. VW Golf 8"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Getriebe</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, transmission: 'manual' }))}
                    className={`rounded px-3 py-2 text-sm ${(form.transmission ?? 'manual') === 'manual' ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-text-muted'}`}
                  >
                    Schaltung
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, transmission: 'automatic' }))}
                    className={`rounded px-3 py-2 text-sm ${form.transmission === 'automatic' ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-text-muted'}`}
                  >
                    Automatik
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Klassen</label>
                <div className="flex flex-wrap gap-2">
                  {CLASSES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleClass(c)}
                      className={`rounded px-2 py-1 text-sm ${(form.classes ?? []).includes(c) ? 'bg-green-500/30 text-green-400' : 'bg-white/10 text-text-muted'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Bild</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:text-white"
                />
                <div className="mt-2 text-xs text-text-muted">
                  {uploadingImage ? 'Lade Bild hoch …' : 'Oder alternativ eine Bild-URL einfügen:'}
                </div>
                <input
                  value={form.image ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                  placeholder="https://..."
                />
                {form.image && (
                  <div className="relative mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-white/10">
                    <Image src={form.image} alt="" fill className="object-cover" sizes="300px" />
                  </div>
                )}
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
              <div>
                <label className="block text-sm text-text-muted mb-1">Interne Notiz (nur Backoffice)</label>
                <input
                  value={form.internal_note ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, internal_note: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-white"
                />
              </div>
            </div>
            </div>
            <div className="shrink-0 flex gap-2 border-t border-white/10 bg-[#0F0F0F] px-5 py-4">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10">
                Abbrechen
              </button>
              <button type="button" onClick={save} disabled={saving} className="btn-primary px-4 py-2 text-sm">
                {saving ? '…' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
