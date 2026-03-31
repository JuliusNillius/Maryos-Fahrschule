'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const topics = [
  { href: '/preise', key: 'prices' as const },
  { href: '/lehrer', key: 'teachers' as const },
  { href: '/team', key: 'more' as const },
  { href: '/anmelden', key: 'register' as const },
  { href: '/faq', key: 'faqContact' as const },
];

export default function StartTopics() {
  const t = useTranslations('nav');

  return (
    <section
      className="section-divider border-y border-white/10 bg-surface/20 py-12 md:py-16"
      aria-label="Themen"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center font-body text-sm font-medium uppercase tracking-wider text-text-muted">
          Wähle dein Thema
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {topics.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border-2 border-white/15 bg-card px-5 py-3 font-body text-sm font-medium uppercase tracking-wide text-white transition-all hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400"
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
