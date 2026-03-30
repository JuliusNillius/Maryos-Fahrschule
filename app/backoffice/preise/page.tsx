'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type PricingRow = { id: string; class_id: string; price: string; popular: boolean; note: string | null };

const CLASS_LABELS: Record<string, string> = {
  b: 'Klasse B',
  be: 'Klasse BE',
  a: 'Klasse A',
  a2: 'Klasse A2',
  a1: 'Klasse A1',
  am: 'Klasse AM',
};

export default function BackofficePreisePage() {
  const [list, setList] = useState<PricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchList() {
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch('/api/backoffice/pricing', {
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

  async function save() {
    setSaving(true);
    const { data: { session } } = await supabase!.auth.getSession();
    const res = await fetch('/api/backoffice/pricing', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify(list.map((r) => ({ class_id: r.class_id, price: r.price, popular: r.popular, note: r.note }))),
    });
    if (res.ok) {
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    }
    setSaving(false);
  }

  function updateRow(classId: string, field: keyof PricingRow, value: string | boolean) {
    setList((prev) =>
      prev.map((r) => (r.class_id === classId ? { ...r, [field]: value } : r))
    );
  }

  if (loading) return <p className="text-text-muted">Lade …</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white">Preise</h1>
        <button type="button" onClick={save} disabled={saving} className="btn-primary" data-testid="backoffice-preise-save">
          {saving ? '…' : 'Speichern'}
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-3 text-sm font-semibold text-white">Klasse</th>
              <th className="p-3 text-sm font-semibold text-white">Preis (€)</th>
              <th className="p-3 text-sm font-semibold text-white">Beliebt</th>
              <th className="p-3 text-sm font-semibold text-white">Hinweis</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="p-3 text-white">{CLASS_LABELS[row.class_id] ?? row.class_id}</td>
                <td className="p-3">
                  <input
                    value={row.price}
                    onChange={(e) => updateRow(row.class_id, 'price', e.target.value)}
                    className="w-24 rounded border border-white/10 bg-surface2 px-2 py-1.5 text-white"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={row.popular}
                    onChange={(e) => updateRow(row.class_id, 'popular', e.target.checked)}
                    className="rounded text-green-500"
                  />
                </td>
                <td className="p-3">
                  <input
                    value={row.note ?? ''}
                    onChange={(e) => updateRow(row.class_id, 'note', e.target.value)}
                    className="w-32 rounded border border-white/10 bg-surface2 px-2 py-1.5 text-white"
                    placeholder="z.B. addOn"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
