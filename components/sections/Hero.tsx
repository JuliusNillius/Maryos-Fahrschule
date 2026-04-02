'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * §10 HERO — Video läuft, „Fahr in dein Glück“ + Buttons sofort sichtbar (keine Scroll-Einblendung).
 * Pin + Scrub nur ab lg (1024px) und ohne prefers-reduced-motion — Telefon & Tablet port. = natives Scrollen.
 */
// Pin-Distanz: zu hoch = viel Scroll ohne sichtbare Bewegung (Lenis + Pin). ~18–22% wirkt flüssiger.
const PIN_SCROLL = 20; // % viewport-Höhe als Scroll-Strecke während Pin

// Desktop: `public/videos/hero.mp4` (16:9, max. 1920×1080 empfohlen).
// Mobil: `public/videos/hero-mobile.mp4` (9:16, z. B. 1080×1920, Mittelstreifen aus derselben Quelle).
const HERO_VIDEO_DESKTOP = '/videos/hero.mp4';
const HERO_VIDEO_MOBILE = '/videos/hero-mobile.mp4';

const DEFAULT_STATS = [5, 18, 4, 4] as const; // Google, Reviews, Sprachen, PKW-Angebote (B, BF17, B197, BE)

type HeroProps = {
  stats?: { googleRating?: number; googleReviews?: number; languages?: number; classes?: number } | null;
};

export default function Hero({ stats }: HeroProps) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Part1Ref = useRef<HTMLSpanElement>(null);
  const h1Part2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const headline = t('headline');
  const highlightWord = t('headlineHighlight');
  const parts = headline.split(highlightWord);
  const part1 = (parts[0] ?? '').trim();
  const part2 = highlightWord;

  // Sichtbares Hero-Video abspielen (zwei Clips: mobil vs. desktop)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const playVisible = () => {
      section.querySelectorAll<HTMLVideoElement>('.hero-video-wrap video').forEach((vid) => {
        vid.muted = true;
        vid.playsInline = true;
        const cs = getComputedStyle(vid);
        const visible = cs.display !== 'none' && cs.visibility !== 'hidden';
        if (visible) vid.play().catch(() => {});
        else vid.pause();
      });
    };
    playVisible();
    window.addEventListener('resize', playVisible);
    return () => window.removeEventListener('resize', playVisible);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const eyebrow = eyebrowRef.current;
    const h1Part1 = h1Part1Ref.current;
    const h1Part2 = h1Part2Ref.current;
    const subtext = subtextRef.current;
    const cta = ctaRef.current;
    const vignette = vignetteRef.current;
    const streak = streakRef.current;

    // Ab Sekunde 1 sichtbar: Headline, Badge, Subtext, Buttons (keine Einblendung per Scroll)
    gsap.set(eyebrow, { opacity: 1, y: 0 });
    gsap.set(h1Part1, { opacity: 1, y: 0 });
    gsap.set(h1Part2, { opacity: 1, x: 0 });
    gsap.set(subtext, { opacity: 1 });
    gsap.set(cta, { opacity: 1, y: 0 });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const created: ScrollTrigger[] = [];
      const push = (t: ScrollTrigger) => {
        created.push(t);
        return t;
      };

      push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${PIN_SCROLL}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        }),
      );

      const st = (progress: number) => `${progress * PIN_SCROLL}%`;

      push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `top+=${st(0.75)} top`,
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
            if (h1Part1) gsap.set(h1Part1, { opacity: 1, y: 0, x: 0 });
            if (h1Part2) gsap.set(h1Part2, { opacity: 1, x: 0, scale: 1 });
            if (cta) gsap.set(cta, { opacity: 1, y: 0 });
            if (subtext) gsap.set(subtext, { opacity: Math.max(0, 1 - p * 1.2) });
          },
        }),
      );

      push(
        ScrollTrigger.create({
          trigger: section,
          start: `top+=${st(0.75)} top`,
          end: `top+=${st(0.95)} top`,
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            [eyebrow, h1Part1, h1Part2, cta].forEach((el) => el && gsap.set(el, { opacity: 1 - p }));
            if (subtext) gsap.set(subtext, { opacity: 0 });
            if (vignette) gsap.set(vignette, { opacity: 0.4 + p * 0.5 });
            if (streak && p > 0.3 && p < 0.45) {
              gsap.set(streak, { opacity: 1 });
              gsap.to(streak, { opacity: 0, duration: 0.3, delay: 0.15 });
            }
          },
        }),
      );

      push(
        ScrollTrigger.create({
          trigger: section,
          start: `top+=${st(0.95)} top`,
          end: `top+=${st(1)} top`,
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            if (section) gsap.set(section.querySelector('.hero-video-wrap'), { filter: `blur(${p * 2}px)` });
          },
        }),
      );

      return () => {
        created.forEach((t) => t.kill());
      };
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
    };
  }, []);

  // Stats count-up when in view (Zahlen aus Backoffice oder Fallback)
  const numbers: [number, number, number, number] = [
    stats?.googleRating ?? DEFAULT_STATS[0],
    stats?.googleReviews ?? DEFAULT_STATS[1],
    stats?.languages ?? DEFAULT_STATS[2],
    stats?.classes ?? DEFAULT_STATS[3],
  ];
  const decimals = [1, 0, 0, 0]; // erste Zahl mit Nachkomma (5.0)

  useEffect(() => {
    const targets = statsRef.current.filter(Boolean) as HTMLSpanElement[];
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: () => {
        targets.forEach((el, i) => {
          if (!el) return;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: numbers[i],
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = decimals[i] ? obj.v.toFixed(1) : String(Math.round(obj.v));
            },
          });
        });
      },
    });
    return () => st.kill();
  }, [numbers[0], numbers[1], numbers[2], numbers[3]]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[100dvh] w-full overflow-hidden"
      data-hide-custom-cursor
    >
      {/* Hero-Video: public/videos/hero.mp4 (Desktop) + hero-mobile.mp4 (Mobil) */}
      <div
        className="absolute inset-0 bg-[#0a0a0a]"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, #1a1f1a 0%, #0a0a0a 70%)',
        }}
        aria-hidden
      />
      <div
        className="hero-video-wrap absolute inset-0 isolate min-h-full min-w-full overflow-hidden [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
        style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
      >
        <video
          className="absolute inset-0 hidden h-full min-h-full w-full min-w-full object-cover object-center md:block [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
          style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          width={1920}
          height={1080}
          src={HERO_VIDEO_DESKTOP}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          onLoadedData={(e) => {
            const v = e.currentTarget;
            if (getComputedStyle(v).display !== 'none') v.play().catch(() => {});
          }}
        />
        <video
          className="absolute inset-0 h-full min-h-full w-full min-w-full object-cover object-center md:hidden [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
          style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          width={1080}
          height={1920}
          src={HERO_VIDEO_MOBILE}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          onLoadedData={(e) => {
            const v = e.currentTarget;
            if (getComputedStyle(v).display !== 'none') v.play().catch(() => {});
          }}
        />
      </div>

      {/* Overlays §10 */}
      {/* Filmkorn: auf schmalen Viewports aus — wirkt oft wie weiche Unschärfe über dem Video (WebKit). */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] max-md:hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div
        ref={vignetteRef}
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background: 'linear-gradient(to top, #080808 0%, transparent 20%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] max-md:hidden"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
        }}
        aria-hidden
      />
      <div
        ref={streakRef}
        className="pointer-events-none absolute inset-0 h-1 w-full bg-gradient-to-t from-transparent via-green-500/60 to-transparent opacity-0"
        style={{ bottom: 0, transform: 'translateY(-50%)' }}
        aria-hidden
      />

      {/* Content – mobil symmetrisch zentriert; max-width lässt rechts Platz für FABs (ohne einseitiges pr-20) */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pb-28 pt-28 text-center md:pt-36 lg:pt-40">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center max-md:max-w-[min(42rem,calc(100vw-6rem))]">
          <p
            ref={eyebrowRef}
            className="mb-6 max-w-full rounded-full border border-green-400/50 bg-black/40 px-4 py-1.5 text-center font-display text-[10px] uppercase leading-snug tracking-[0.18em] text-green-400 backdrop-blur-sm [text-shadow:0_0_12px_rgba(0,0,0,0.9)] sm:text-[11px] sm:tracking-[0.2em]"
          >
            🍀 {t('badge')}
          </p>
          <h1 className="sr-only">{t('seoH1')}</h1>
          <div
            className="max-w-full font-heading text-[clamp(3.5rem,10vw,8rem)] font-bold italic leading-[0.95] tracking-tight md:max-w-5xl"
            aria-hidden
          >
            <span
              ref={h1Part1Ref}
              className="block text-white [text-shadow:0_0_30px_rgba(0,0,0,0.95),0_0_60px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,1)]"
            >
              {part1}
            </span>
            <span
              ref={h1Part2Ref}
              className="block text-green-400 [text-shadow:0_0_25px_rgba(0,0,0,0.9),0_0_50px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,1)]"
              style={{ transformOrigin: 'center center' }}
            >
              {part2}
            </span>
          </div>
          <p
            ref={subtextRef}
            className="mt-6 max-w-xl font-body text-lg text-white/95 [text-shadow:0_0_20px_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,1)]"
          >
            {t.rich('subheadlineRich', {
              prices: (chunks) => (
                <Link
                  href="/preise"
                  className="font-medium text-green-400 underline decoration-green-400/50 underline-offset-2 transition-colors hover:text-green-300"
                >
                  {chunks}
                </Link>
              ),
              teachers: (chunks) => (
                <Link
                  href="/lehrer"
                  className="font-medium text-green-400 underline decoration-green-400/50 underline-offset-2 transition-colors hover:text-green-300"
                >
                  {chunks}
                </Link>
              ),
              firstaid: (chunks) => (
                <Link
                  href="/erste-hilfe"
                  className="font-medium text-green-400 underline decoration-green-400/50 underline-offset-2 transition-colors hover:text-green-300"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/anmelden" className="btn-primary h-[52px] gap-2 px-8 text-base [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]" data-cta data-magnetic data-testid="hero-cta-primary">
              🏁 {t('ctaPrimary')}
            </Link>
            <Link href="/lehrer" className="btn-ghost h-[52px] px-8 text-base text-white [text-shadow:0_0_16px_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.9)]" data-testid="hero-cta-secondary">
              {t('ctaSecondary')}
            </Link>
          </div>
          <div className="mt-16 flex flex-col items-center gap-2">
            <span className="text-sm uppercase tracking-[0.3em] text-white/80 [text-shadow:0_0_12px_rgba(0,0,0,0.8)]">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-green-500/80 to-transparent animate-pulse" aria-hidden />
          </div>
        </div>
      </div>

      {/* Stats bar §10 — safe-area für Notch/Home-Indikator auf Mobil */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[rgba(93,196,34,0.25)] bg-surface/95 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-center font-body text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <span ref={(el) => { statsRef.current[0] = el; }} className="font-display font-bold text-white">0</span>
            {t('statGoogle')}
          </span>
          <span className="text-green-500" aria-hidden>◆</span>
          <span className="flex items-center gap-1.5">
            <span ref={(el) => { statsRef.current[1] = el; }} className="font-display font-bold text-white">0</span>
            {' '}{t('statReviews')}
          </span>
          <span className="text-green-500" aria-hidden>◆</span>
          <span className="flex items-center gap-1.5">
            <span ref={(el) => { statsRef.current[2] = el; }} className="font-display font-bold text-white">0</span>
            {' '}{t('statLanguages')}
          </span>
          <span className="text-green-500" aria-hidden>◆</span>
          <span className="flex items-center gap-1.5">
            <span ref={(el) => { statsRef.current[3] = el; }} className="font-display font-bold text-white">0</span>
            {' '}{t('statClasses')}
          </span>
          <span className="text-green-500" aria-hidden>◆</span>
          <span className="font-display text-white">100% Digital</span>
        </div>
      </div>
    </section>
  );
}
