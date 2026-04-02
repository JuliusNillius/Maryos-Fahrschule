'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { z } from 'zod';
import { Link } from '@/i18n/navigation';

gsap.registerPlugin(ScrollTrigger);

export default function Referral() {
  const t = useTranslations('referral');
  const tReg = useTranslations('registration');
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupCode, setLookupCode] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);
  const [lookupErr, setLookupErr] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const text = textRef.current;
    const cta = ctaRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
      if (heading) tl.fromTo(heading, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
      if (text) tl.fromTo(text, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.4');
      if (cta) tl.fromTo(cta, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.3');
    }, section);
    return () => ctx.revert();
  }, []);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const email = lookupEmail.trim();
    if (!email) {
      setLookupErr(tReg('referralLookupEmailRequired'));
      setLookupCode(null);
      setLookupDone(false);
      return;
    }
    if (!z.string().email().safeParse(email).success) {
      setLookupErr(tReg('referralLookupEmailInvalid'));
      setLookupCode(null);
      setLookupDone(false);
      return;
    }
    setLookupErr(null);
    setLookupLoading(true);
    setLookupCode(null);
    setLookupDone(false);
    try {
      const res = await fetch(`/api/referral-code?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      setLookupDone(true);
      setLookupCode(json.found ? json.code : null);
    } catch {
      setLookupDone(true);
      setLookupCode(null);
    } finally {
      setLookupLoading(false);
    }
  }

  function getShareUrl(code: string): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/anmelden?ref=${encodeURIComponent(code)}`;
  }

  async function handleCopyShareLink(code: string) {
    const url = getShareUrl(code);
    try {
      await navigator.clipboard.writeText(url);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // fallback: select and show
      setCopyFeedback(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      className="section-divider border-y border-white/10 bg-surface/30 py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          ref={headingRef}
          className="font-heading text-2xl font-bold italic uppercase tracking-tight text-white sm:text-3xl md:text-4xl"
        >
          {t('heading')}
        </h2>
        <p
          ref={textRef}
          className="mt-4 font-body text-text-muted md:text-lg"
        >
          {t('subheading')}
        </p>
        <div ref={ctaRef} className="mt-8 flex flex-col items-center gap-6">
          <Link
            href="/anmelden"
            className="btn-primary inline-flex h-12 items-center px-6"
          >
            {t('cta')}
          </Link>

          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-surface/50 p-4 text-left">
            <p className="font-body text-sm font-medium text-white">{tReg('referralLookupTitle')}</p>
            <form onSubmit={handleLookup} className="mt-3 flex flex-col gap-2">
              <input
                type="email"
                value={lookupEmail}
                onChange={(e) => {
                  setLookupEmail(e.target.value);
                  setLookupErr(null);
                }}
                placeholder={tReg('referralLookupEmail')}
                className="w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 font-body text-sm text-white placeholder:text-text-muted"
              />
              {lookupErr && (
                <p className="font-body text-sm text-red-500" role="alert">
                  {lookupErr}
                </p>
              )}
              <button
                type="submit"
                disabled={lookupLoading}
                className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 font-body text-sm font-medium text-green-400 hover:bg-green-500/20 disabled:opacity-50"
              >
                {lookupLoading ? '…' : tReg('referralLookupCta')}
              </button>
            </form>
            {lookupDone && (
              <div className="mt-3 border-t border-white/10 pt-3">
                {lookupCode ? (
                  <>
                    <p className="font-body text-sm text-text-muted">
                      {tReg('referralLookupFound')}: <span className="font-mono font-bold text-green-400">{lookupCode}</span>
                    </p>
                    <div className="mt-3">
                      <p className="font-body text-sm font-medium text-white mb-2">{t('shareLinkTitle')}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={getShareUrl(lookupCode)}
                          className="flex-1 rounded-lg border border-white/10 bg-surface2 px-3 py-2 font-mono text-xs text-text-muted"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyShareLink(lookupCode)}
                          className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 font-body text-sm font-medium text-green-400 hover:bg-green-500/20 whitespace-nowrap"
                        >
                          {copyFeedback ? t('copySuccess') : t('copyButton')}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="font-body text-sm text-text-muted">{tReg('referralLookupNotFound')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
