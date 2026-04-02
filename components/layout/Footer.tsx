'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Logo from '@/components/layout/Logo';
import PaymentMethodsBar from '@/components/layout/PaymentMethodsBar';
import { socialHref, type SocialLinks } from '@/lib/social-links';

type FooterProps = {
  contact?: { phone?: string; street?: string; zip?: string; city?: string } | null;
  impressum?: { company?: string; street?: string; zip?: string; city?: string; register?: string; owner?: string } | null;
  social?: SocialLinks | null;
};

export default function Footer({ contact, impressum, social }: FooterProps) {
  const t = useTranslations('footer');
  const address = contact?.street && contact?.zip && contact?.city
    ? `${contact.street}, ${contact.zip} ${contact.city}`
    : 'Bahnhofstraße 25, 41236 Mönchengladbach';
  const phone = contact?.phone ?? '0178 4557528';
  const company = impressum?.company ?? "Maryo's Fahrschule GmbH";
  const register = impressum?.register ?? 'HRB 23787 Mönchengladbach';
  const owner = impressum?.owner ?? 'Yaako Maryo Asoo';

  return (
    <footer className="border-t border-[rgba(93,196,34,0.15)] bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link prefetch href="/" className="inline-flex items-center">
              <Logo variant="footer" />
            </Link>
            <p className="font-heading text-sm font-bold italic uppercase tracking-wide text-text-muted">
              {t('tagline')}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={socialHref('instagram', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-green-primary"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href={socialHref('tiktok', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-green-primary"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a
                href={socialHref('facebook', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-green-primary"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href={socialHref('youtube', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted transition-colors hover:text-green-primary"
                aria-label="YouTube"
              >
                YouTube
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-green-primary">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2 font-body text-sm text-text-muted">
              <li><Link prefetch href="/" className="transition-colors hover:text-green-primary">{t('home')}</Link></li>
              <li><Link prefetch href="/preise" className="transition-colors hover:text-green-primary">{t('prices')}</Link></li>
              <li><Link prefetch href="/lehrer" className="transition-colors hover:text-green-primary">{t('teachers')}</Link></li>
              <li><Link prefetch href="/team" className="transition-colors hover:text-green-primary">{t('aboutUs')}</Link></li>
              <li><Link prefetch href="/anmelden" className="transition-colors hover:text-green-primary">{t('register')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-green-primary">
              {t('licenseClasses')}
            </h3>
            <p className="font-body text-sm text-text-muted">
              {t('classOffer')}
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-green-primary">
              {t('contact')}
            </h3>
            <p className="font-body text-sm text-text-muted">
              {address.includes(', ') ? (
                <>{(address as string).split(', ')[0]}<br />{(address as string).split(', ')[1]}</>
              ) : (
                address
              )}
            </p>
            <a href={`tel:${phone.replace(/\s/g, '').replace(/^0/, '+49')}`} className="mt-1 block text-text transition-colors hover:text-green-primary">
              {phone}
            </a>
            <p className="mt-2 text-sm text-text-muted">{t('hours')}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[rgba(93,196,34,0.15)] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-xs text-text-muted">
            © 2025 {company} — {address}
          </p>
          <p className="font-body text-xs text-text-muted">
            {register} | {t('owner')}: {owner}
          </p>
          <div className="flex gap-6 font-body text-xs">
            <Link prefetch href="/impressum" className="text-text-muted transition-colors hover:text-green-primary">
              {t('imprint')}
            </Link>
            <Link prefetch href="/datenschutz" className="text-text-muted transition-colors hover:text-green-primary">
              {t('privacy')}
            </Link>
            <Link prefetch href="/agb" className="text-text-muted transition-colors hover:text-green-primary">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
      <PaymentMethodsBar />
    </footer>
  );
}
