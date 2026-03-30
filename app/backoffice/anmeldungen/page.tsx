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
  payment_status: string;
  paid_at: string | null;
};

export default function BackofficeAnmeldungenPage() {
  const [list, setList] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

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
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps -- fetchList uses current filter

  const dateStr = (s: string) => s ? new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';

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
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-3 font-semibold text-white">Datum</th>
              <th className="p-3 font-semibold text-white">Name</th>
              <th className="p-3 font-semibold text-white">E-Mail</th>
              <th className="p-3 font-semibold text-white">Klasse</th>
              <th className="p-3 font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="p-3 text-text-muted">{dateStr(row.created_at)}</td>
                <td className="p-3 text-white">{row.first_name} {row.last_name}</td>
                <td className="p-3 text-text-muted">{row.email}</td>
                <td className="p-3 text-white">{row.licence_class}</td>
                <td className="p-3">
                  <span className={`rounded px-2 py-1 text-xs ${row.payment_status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-400'}`}>
                    {row.payment_status === 'paid' ? 'Bezahlt' : 'Offen'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="mt-4 text-text-muted">Keine Anmeldungen.</p>}
    </div>
  );
}
