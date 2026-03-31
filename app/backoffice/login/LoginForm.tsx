'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/backoffice';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabaseMissing = !supabase;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (supabaseMissing) {
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Ungültige E-Mail oder Passwort.' : err.message);
      return;
    }
    const res = await fetch('/api/backoffice/me', {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    });
    const me = await res.json().catch(() => ({}));
    if (!me?.ok) {
      await supabase.auth.signOut();
      const emailHint = me?.email ? ` (${me.email})` : '';
      setError(
        `Dieser Account hat keinen Backoffice-Zugang${emailHint}. Zugang hinzufügen: im Projektordner „npm run seed:admin-add -- \\"deine@email.de\\"“ ausführen.`
      );
      return;
    }
    window.location.href = from;
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-[rgba(93,196,34,0.2)] bg-[#0F0F0F] p-8">
        <h1 className="font-heading text-2xl font-bold italic uppercase text-white mb-1">
          Maryo&apos;s Fahrschule
        </h1>
        <p className="text-text-muted text-sm mb-6">Backoffice Login</p>
        {supabaseMissing && (
          <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="font-medium mb-1">Supabase ist nicht konfiguriert</p>
            <p className="text-text-muted text-xs mb-2">
              Lokal: <code className="rounded bg-black/30 px-1">.env.local</code> mit{' '}
              <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code> und{' '}
              <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (Supabase → Settings → API).
            </p>
            <p className="text-xs text-text-muted mb-2">
              <strong className="text-amber-100/90">Vercel:</strong> dieselben Variablen unter Environment Variables setzen, dann{' '}
              <strong className="text-amber-100/90">Production erneut deployen</strong> – idealerweise „Redeploy“ ohne Build-Cache, damit{' '}
              <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_*</code> im Build landet.
            </p>
            <p className="text-xs text-text-muted">Danach lokal: Dev-Server neu starten (<code className="rounded bg-black/30 px-1">npm run dev</code>).</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-text-muted mb-1">E-Mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-surface2 px-4 py-3 text-white placeholder:text-text-muted focus:border-green-500 focus:outline-none"
              placeholder="deine@email.de"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-text-muted mb-1">Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-surface2 px-4 py-3 text-white placeholder:text-text-muted focus:border-green-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || supabaseMissing}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="backoffice-login-submit"
          >
            {loading ? '…' : 'Anmelden'}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-green-500 hover:underline">← Zur Website</Link>
        </p>
      </div>
    </main>
  );
}
