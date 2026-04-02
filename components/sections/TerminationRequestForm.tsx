'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function TerminationRequestForm() {
  const t = useTranslations('terminationPage');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/termination-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof data.error === 'string' ? data.error : t('error'));
        return;
      }
      setDone(true);
    } catch {
      setErr(t('error'));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
        <p className="font-heading text-lg font-bold italic text-white">{t('successTitle')}</p>
        <p className="mt-2 font-body text-sm text-text-muted">{t('successBody')}</p>
        <Link href="/" className="btn-primary mt-6 inline-block">
          {t('backHome')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold italic uppercase tracking-tight text-white">{t('title')}</h1>
      <p className="mt-3 font-body text-sm text-text-muted">{t('intro')}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-text-muted" htmlFor="ku-first">{t('firstName')}</label>
            <input
              id="ku-first"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-white focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-muted" htmlFor="ku-last">{t('lastName')}</label>
            <input
              id="ku-last"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-white focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-muted" htmlFor="ku-phone">{t('phone')}</label>
          <input
            id="ku-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-white focus:border-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-muted" htmlFor="ku-email">{t('emailOptional')}</label>
          <input
            id="ku-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-white focus:border-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-muted" htmlFor="ku-msg">{t('messageOptional')}</label>
          <textarea
            id="ku-msg"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-white focus:border-green-500 focus:outline-none"
          />
        </div>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto" data-testid="termination-submit">
          {loading ? '…' : t('submit')}
        </button>
      </form>
    </div>
  );
}
