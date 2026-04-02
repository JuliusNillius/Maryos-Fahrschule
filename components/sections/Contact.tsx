'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socialHref, type SocialLinks } from '@/lib/social-links';

gsap.registerPlugin(ScrollTrigger);

type ContactProps = {
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    street?: string;
    zip?: string;
    city?: string;
    mapUrl?: string;
  } | null;
  social?: SocialLinks | null;
};

export default function Contact({ contact, social }: ContactProps) {
  const phone = contact?.phone ?? '0178 4557528';
  const address = contact?.street && contact?.zip && contact?.city
    ? `${contact.street}, ${contact.zip} ${contact.city}`
    : 'Bahnhofstraße 25, 41236 Mönchengladbach';
  const mapUrl = contact?.mapUrl ?? 'https://maps.google.com/maps?q=Bahnhofstraße+25,+41236+Mönchengladbach&output=embed';
  const mapsQuery = contact?.street && contact?.city
    ? encodeURIComponent(`${contact.street}, ${contact.zip} ${contact.city}`)
    : 'Bahnhofstraße+25,+41236+Mönchengladbach';
  const telHref = `tel:${phone.replace(/\s/g, '').replace(/^0/, '+49')}`;

  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const left = leftRef.current;
    const map = mapRef.current;
    if (!section) return;

    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 88%', toggleActions: 'play none none none' },
      });
      if (heading) {
        tl.fromTo(heading, { y: 28 }, { y: 0, duration: 0.65, ease: 'power3.out' });
      }
      if (left) {
        tl.fromTo(left, { x: -28 }, { x: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45');
      }
      if (map) {
        tl.fromTo(map, { x: 28 }, { x: 0, duration: 0.65, ease: 'power3.out' }, '-=0.65');
      }
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="contact-heading"
          ref={headingRef}
          className="mb-12 font-heading text-3xl font-bold italic uppercase tracking-wide text-text md:text-4xl"
        >
          {t('heading')}
        </h2>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div ref={leftRef} className="space-y-6">
            <p className="flex items-start gap-3 font-body text-text-muted">
              <span aria-hidden>📍</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text underline decoration-green-primary/50 underline-offset-2 transition-colors hover:text-green-primary"
              >
                {address}
              </a>
            </p>
            <p className="flex items-center gap-3 font-body text-text-muted">
              <span aria-hidden>📞</span>
              <a href={telHref} className="text-text transition-colors hover:text-green-primary">
                {phone}
              </a>
            </p>
            <p className="flex items-start gap-3 font-body text-sm text-text-muted">
              <span aria-hidden>💬</span>
              <span>{t('floatActionsHint')}</span>
            </p>
            <p className="flex items-center gap-3 font-body text-text-muted">
              <span aria-hidden>🕐</span>
              {t('hours')}
            </p>
            <p className="flex items-center gap-3 font-body text-text-muted">
              <span aria-hidden>🔴</span>
              {t('closed')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={socialHref('instagram', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[rgba(93,196,34,0.2)] p-2 text-text-muted transition-colors hover:border-green-primary hover:text-green-primary"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href={socialHref('tiktok', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[rgba(93,196,34,0.2)] p-2 text-text-muted transition-colors hover:border-green-primary hover:text-green-primary"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a
                href={socialHref('facebook', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[rgba(93,196,34,0.2)] p-2 text-text-muted transition-colors hover:border-green-primary hover:text-green-primary"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href={socialHref('youtube', social)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[rgba(93,196,34,0.2)] p-2 text-text-muted transition-colors hover:border-green-primary hover:text-green-primary"
                aria-label="YouTube"
              >
                YouTube
              </a>
            </div>
          </div>

          <div ref={mapRef} className="overflow-hidden rounded-xl border border-[rgba(93,196,34,0.2)]">
            <iframe
              src={mapUrl}
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapTitle')}
              className="min-h-[280px] md:min-h-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
