'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * §10 HERO — Video läuft, „Fahr in dein Glück“ + Buttons sofort sichtbar (keine Scroll-Einblendung).
 * Pin + Scrub nur ab lg (1024px) und ohne prefers-reduced-motion — Telefon & Tablet port. = natives Scrollen.
 */
// Pin-Distanz: zu hoch = viel Scroll ohne sichtbare Bewegung (Lenis + Pin). ~18–22% wirkt flüssiger.
const PIN_SCROLL = 20; // % viewport-Höhe als Scroll-Strecke während Pin

// Standard: `public/videos/*.mp4`. Optional: volle HTTPS-URLs (z. B. Supabase Storage) → schlankes Git, CDN-Caching.
const HERO_VIDEO_DESKTOP =
  process.env.NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL?.trim() || '/videos/hero.mp4';
const HERO_VIDEO_MOBILE =
  process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL?.trim() || '/videos/hero-mobile.mp4';

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

  // Sichtbares Hero-Video abspielen (zwei Clips: mobil vs. desktop); Retries über canplay / Tab-Sichtbarkeit / erste Geste
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isVisible = (vid: HTMLVideoElement) => {
      const cs = getComputedStyle(vid);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    };

    const tryPlayVideo = (vid: HTMLVideoElement) => {
      vid.muted = true;
      vid.playsInline = true;
      if (isVisible(vid)) void vid.play().catch(() => {});
      else vid.pause();
    };

    const playVisible = () => {
      section.querySelectorAll<HTMLVideoElement>('.hero-video-wrap video').forEach((vid) => tryPlayVideo(vid));
    };

    const onMediaReady = (e: Event) => {
      const vid = e.currentTarget as HTMLVideoElement;
      if (isVisible(vid) && vid.paused) tryPlayVideo(vid);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') playVisible();
    };

    const videos = section.querySelectorAll<HTMLVideoElement>('.hero-video-wrap video');
    videos.forEach((vid) => {
      vid.addEventListener('canplay', onMediaReady);
      vid.addEventListener('canplaythrough', onMediaReady);
    });

    window.addEventListener('resize', playVisible);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointerdown', playVisible, { once: true, capture: true });

    playVisible();

    return () => {
      window.removeEventListener('resize', playVisible);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerdown', playVisible, { capture: true });
      videos.forEach((vid) => {
        vid.removeEventListener('canplay', onMediaReady);
        vid.removeEventListener('canplaythrough', onMediaReady);
      });
    };
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
      once: true,
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
      className="relative w-full max-lg:h-auto max-lg:min-h-0 max-lg:overflow-visible lg:h-screen lg:min-h-[100dvh] lg:overflow-hidden"
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
          className="absolute inset-0 hidden h-full min-h-full w-full min-w-full object-cover object-center lg:block [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
          style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          width={1920}
          height={1080}
          src={HERO_VIDEO_DESKTOP}
          muted
          ref={(el) => {
            if (el) el.defaultMuted = true;
          }}
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
        />
        <video
          className="absolute inset-0 h-full min-h-full w-full min-w-full object-cover object-center lg:hidden [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
          style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          width={1080}
          height={1920}
          src={HERO_VIDEO_MOBILE}
          muted
          ref={(el) => {
            if (el) el.defaultMuted = true;
          }}
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
        />
      </div>

      {/* Overlays §10 */}
      {/* Filmkorn: auf schmalen Viewports aus — wirkt oft wie weiche Unschärfe über dem Video (WebKit). */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] max-lg:hidden"
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
        className="pointer-events-none absolute inset-0 opacity-[0.025] max-lg:hidden"
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

      {/* Content: Mobil unten bündig zur Stats-Zeile (kein „schwarzes Loch“ durch justify-center); Desktop zentriert wie zuvor */}
      <div className="relative z-10 flex min-h-0 w-full flex-col max-lg:min-h-[100dvh] lg:h-full">
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-[calc(env(safe-area-inset-top)+5.75rem)] text-center max-lg:justify-end max-lg:overflow-y-auto lg:absolute lg:inset-0 lg:flex lg:flex-col lg:items-center lg:justify-center lg:pb-28 lg:pt-40">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center max-lg:max-w-[min(36rem,calc(100vw-2rem))] lg:max-w-4xl">
          <p
            ref={eyebrowRef}
            className="mb-4 max-w-full rounded-full border border-green-400/50 bg-black/55 px-3.5 py-1.5 text-center font-display text-[10px] uppercase leading-snug tracking-[0.18em] text-green-400 backdrop-blur-sm [text-shadow:0_0_12px_rgba(0,0,0,0.9)] sm:mb-5 sm:px-4 sm:text-[11px] sm:tracking-[0.2em]"
          >
            🍀 {t('badge')}
          </p>
          <h1 className="max-w-full font-heading text-[clamp(1.5rem,4.2vw+0.35rem,2.35rem)] font-bold italic leading-[1.12] tracking-tight sm:text-[clamp(1.6rem,3.8vw+0.4rem,2.5rem)] lg:max-w-4xl lg:text-[clamp(1.85rem,2.4vw+0.75rem,3rem)] lg:leading-[1.1]">
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
          </h1>
          <p
            ref={subtextRef}
            className="mt-4 max-w-xl font-body text-sm leading-relaxed text-white/90 [text-shadow:0_0_20px_rgba(0,0,0,0.9),0_2px_4px_rgba(0,0,0,1)] sm:mt-5 sm:text-base lg:mt-5 lg:max-w-2xl lg:text-base"
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
          <div ref={ctaRef} className="mt-6 flex w-full max-w-sm flex-col items-stretch justify-center gap-2.5 max-lg:max-w-none sm:mt-8 sm:gap-3 lg:max-w-none lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
            <Link
              href="/anmelden"
              className="btn-primary inline-flex h-[48px] gap-2 px-6 text-sm sm:h-[50px] sm:px-8 sm:text-base [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]"
              data-cta
              data-magnetic
              data-testid="hero-cta-primary"
            >
              🏁 {t('ctaPrimary')}
            </Link>
            <Link href="/lehrer" className="btn-ghost h-[48px] px-6 text-sm text-white sm:h-[50px] sm:px-8 sm:text-base [text-shadow:0_0_16px_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.9)]" data-testid="hero-cta-secondary">
              {t('ctaSecondary')}
            </Link>
          </div>
          <div className="mt-6 flex flex-col items-center gap-1.5 max-lg:mt-5 max-lg:mb-1 lg:mt-10">
            <span className="text-xs uppercase tracking-[0.28em] text-white/75 [text-shadow:0_0_12px_rgba(0,0,0,0.8)] sm:text-sm">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-green-500/80 to-transparent animate-pulse sm:h-9 lg:h-10" aria-hidden />
          </div>
        </div>
        </div>

      {/* Stats: Mobil im Fluss unter dem Hero-Inhalt (bündig); Desktop absolut am unteren Rand */}
      <div className="relative z-10 shrink-0 border-t border-[rgba(93,196,34,0.25)] bg-surface py-2.5 backdrop-blur-md max-lg:border-b-0 max-lg:backdrop-blur-none lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:bg-surface/95 lg:py-4 lg:pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Mobil: feste max-Breite → gleiche Zeilenumbrüche auf iPhone 17 & Pro Max; Desktop: eine Zeile wie zuvor */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-y-2 px-4 text-center font-body text-sm text-[#C4C4C4] lg:flex-row lg:flex-wrap lg:justify-center lg:gap-x-6 lg:gap-y-2">
          <div className="flex w-full max-w-[19rem] flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:contents lg:max-w-none">
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
            <span className="w-full basis-full font-body text-sm font-medium tracking-wide text-[#E8E8E8] lg:w-auto lg:basis-auto">
              {t('statDigital')}
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
