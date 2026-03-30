'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

function getNextDays(count: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const next = new Date(d);
    next.setDate(d.getDate() + i);
    out.push(next);
  }
  return out;
}

export default function BookingCalendar() {
  const t = useTranslations('bookingCalendar');
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const days = getNextDays(14);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector('.booking-heading'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) return;
    setLoading(true);
    try {
      const payload: { date: string; time: string; name?: string; email?: string; phone?: string } = {
        date: selectedDate.toISOString().slice(0, 10),
        time: selectedTime,
      };
      if (name.trim()) payload.name = name.trim();
      if (email.trim()) payload.email = email.trim();
      if (phone.trim()) payload.phone = phone.trim();
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const dateStr = (d: Date) => d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <section
      id="termine"
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-16 md:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="booking-heading font-heading text-2xl font-bold italic uppercase tracking-tight text-white sm:text-3xl">
          {t('heading')}
        </h2>
        <p className="booking-heading mt-2 font-body text-text-muted">
          {t('subheading')}
        </p>

        {sent ? (
          <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="font-body text-green-500">{t('success')}</p>
          </div>
        ) : (
          <>
            <p className="booking-heading mt-6 font-body text-sm font-medium text-white">
              {t('contactOptional')}
            </p>
            <div className="booking-heading mt-2 grid gap-3 sm:grid-cols-1">
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-white/20 bg-card px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                maxLength={200}
              />
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/20 bg-card px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                maxLength={320}
              />
              <input
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-white/20 bg-card px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                maxLength={50}
              />
            </div>

            <p className="booking-heading mt-6 font-body text-sm font-medium text-white">
              {t('pickDate')}
            </p>
            <div className="booking-heading mt-2 flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                  className={`rounded-lg border px-3 py-2 text-sm font-body transition-colors ${
                    selectedDate?.toDateString() === d.toDateString()
                      ? 'border-green-500 bg-green-500/20 text-green-500'
                      : 'border-white/20 text-white hover:border-green-500/50'
                  }`}
                >
                  {dateStr(d)}
                </button>
              ))}
            </div>

            {selectedDate && (
              <>
                <p className="mt-6 font-body text-sm font-medium text-white">
                  {t('pickTime')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border px-4 py-2 text-sm font-body transition-colors ${
                        selectedTime === time
                          ? 'border-green-500 bg-green-500/20 text-green-500'
                          : 'border-white/20 text-white hover:border-green-500/50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || loading}
              className="btn-primary mt-8 w-full sm:w-auto"
              data-testid="booking-submit"
            >
              {loading ? '…' : t('cta')}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
