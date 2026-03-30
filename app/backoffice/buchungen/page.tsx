'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Booking = { id: string; date: string; time: string; name: string | null; email: string | null; phone: string | null };

export default function BackofficeBuchungenPage() {
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase!.auth.getSession();
      const res = await fetch('/api/backoffice/bookings', { headers: { Authorization: `Bearer ${session?.access_token}` } });
      if (res.ok) setList(await res.json());
      setLoading(false);
    })();
  }, []);

  const byDate = list.reduce((acc, b) => {
    const d = b.date;
    if (!acc[d]) acc[d] = []; acc[d].push(b); return acc;
  }, {} as Record<string, Booking[]>);

  if (loading) return <p className="text-text-muted">Lade …</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold italic uppercase text-white mb-6">Buchungen / Terminanfragen</h1>
      <div className="space-y-6">
        {Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, bookings]) => (
            <div key={date} className="rounded-xl border border-white/10 bg-[#0F0F0F] overflow-hidden">
              <h2 className="p-4 font-heading font-bold italic text-green-500 bg-white/5">
                {new Date(date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </h2>
              <ul className="divide-y divide-white/5">
                {bookings
                  .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                  .map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center gap-4 p-4">
                      <span className="font-mono text-green-400">{b.time}</span>
                      <span className="text-white">{b.name || '–'}</span>
                      {b.email && <a href={`mailto:${b.email}`} className="text-text-muted hover:text-green-500">{b.email}</a>}
                      {b.phone && <a href={`tel:${b.phone}`} className="text-text-muted hover:text-green-500">{b.phone}</a>}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
      {list.length === 0 && <p className="text-text-muted">Keine Buchungen.</p>}
    </div>
  );
}
