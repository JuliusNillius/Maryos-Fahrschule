'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** Gleiche Grün-Werte wie Brand — Glow + Kleeblatt wirken aus einem Guss */
const G = '93,196,34';
/** 320px-Breite WebP nur für Ladescreen (2× für 160px-Box); Navbar nutzt weiter /kleeblatt-logo.png */
const LOADER_CLOVER = '/kleeblatt-loader.webp';
const CLOVER_MASK = `url('${LOADER_CLOVER}')`;

/**
 * Schwarze Kontur nur um die Form (kein Rechteck-Rahmen): filter drop-shadow entlang der Alpha-Kante.
 * Zusätzlich mask-image luminance: schwarze Fläche im PNG blendet aus → nur grünes Kleeblatt + Glow dahinter.
 */
const CLOVER_FILTERS = [
  'drop-shadow(1px 0 0 #000)',
  'drop-shadow(-1px 0 0 #000)',
  'drop-shadow(0 1px 0 #000)',
  'drop-shadow(0 -1px 0 #000)',
  'drop-shadow(1px 1px 0 #000)',
  'drop-shadow(-1px -1px 0 #000)',
  'drop-shadow(1px -1px 0 #000)',
  'drop-shadow(-1px 1px 0 #000)',
  `drop-shadow(0 0 10px rgba(${G},0.5))`,
  `drop-shadow(0 0 22px rgba(${G},0.28))`,
].join(' ');

/** Vendor-Mask-Props fehlen teils in React.CSSProperties */
const cloverImgStyle = {
  WebkitMaskImage: CLOVER_MASK,
  maskImage: CLOVER_MASK,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
  WebkitMaskMode: 'luminance',
  maskMode: 'luminance',
  filter: CLOVER_FILTERS,
  WebkitBackfaceVisibility: 'hidden',
  backfaceVisibility: 'hidden',
} as React.CSSProperties;

/**
 * Ladebildschirm: grünes Kleeblatt auf stimmigem Grün-Glow, schwarze Linienführung nur um die Form (kein Kasten-Rahmen).
 * GSAP-Cleanup in try/catch.
 */

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const loadSnapTweenRef = useRef<gsap.core.Tween | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideLoader = () => setVisible(false);

    const safetyTimer = setTimeout(hideLoader, 5000);

    const overlay = overlayRef.current;
    const progressBar = progressRef.current;
    const img = imgRef.current;

    if (!overlay || !burstRef.current || !glowRef.current || !progressBar || !img) {
      const fallback = setTimeout(hideLoader, 400);
      return () => {
        clearTimeout(safetyTimer);
        clearTimeout(fallback);
      };
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      try {
        gsap.set(burstRef.current, { scale: 1, opacity: 0.4 });
        gsap.set(glowRef.current, { scale: 1, opacity: 0.9 });
        gsap.set(img, { opacity: 1 });
        gsap.set(progressBar, { scaleX: 1, transformOrigin: 'left center' });
      } catch {
        hideLoader();
        return () => clearTimeout(safetyTimer);
      }
      const t = window.setTimeout(() => {
        try {
          gsap.to(overlay, {
            y: '-100%',
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: hideLoader,
          });
        } catch {
          hideLoader();
        }
      }, 280);
      return () => {
        clearTimeout(safetyTimer);
        clearTimeout(t);
        try {
          gsap.killTweensOf(overlay);
        } catch {
          /* ignore */
        }
      };
    }

    let cancelled = false;
    let hideAfterCurtainTimer: number | undefined;

    try {
      gsap.set(burstRef.current, { scale: 0.3, opacity: 0 });
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(img, { opacity: 0 });
      gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });

      const progress = { value: 0 };

      const applyProgress = (p: number) => {
        if (cancelled || !progressBar) return;
        const clamped = Math.min(1, Math.max(0, p));
        progressBar.style.transform = `scaleX(${clamped})`;
      };

      const tl = gsap.timeline();

      tl.to(burstRef.current, {
        scale: 1,
        opacity: 0.38,
        duration: 0.5,
        ease: 'power2.out',
      });

      tl.to(
        glowRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        },
        0.2,
      );

      tl.to(
        img,
        {
          opacity: 1,
          duration: 1.15,
          ease: 'power2.out',
        },
        0.15,
      );

      tl.to(
        glowRef.current,
        {
          scale: 1.12,
          opacity: 0.72,
          duration: 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
        0.5,
      );
      tl.to(
        burstRef.current,
        {
          scale: 1.06,
          opacity: 0.48,
          duration: 1.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
        0.5,
      );

      tl.to(
        progress,
        {
          value: 1,
          duration: 1.35,
          ease: 'none',
          onUpdate: () => applyProgress(progress.value),
        },
        0.4,
      );

      const onComplete = () => {
        if (cancelled) return;
        try {
          loadSnapTweenRef.current?.kill();
          loadSnapTweenRef.current = gsap.to(progress, {
            value: 1,
            duration: 0.2,
            onUpdate: () => applyProgress(progress.value),
          });
        } catch {
          applyProgress(1);
        }
      };
      if (typeof document !== 'undefined') {
        if (document.readyState === 'complete') onComplete();
        else window.addEventListener('load', onComplete);
      }

      const curtainAt = 1.75;
      const curtainDur = 0.58;
      tl.to(overlay, { y: '-100%', duration: curtainDur, ease: 'expo.inOut' }, curtainAt);
      tl.add(() => {
        if (!cancelled) {
          hideAfterCurtainTimer = window.setTimeout(hideLoader, 100);
        }
      }, curtainAt + curtainDur);

      return () => {
        cancelled = true;
        clearTimeout(safetyTimer);
        if (hideAfterCurtainTimer !== undefined) clearTimeout(hideAfterCurtainTimer);
        try {
          tl.kill();
          loadSnapTweenRef.current?.kill();
          loadSnapTweenRef.current = null;
          gsap.killTweensOf([glowRef.current, burstRef.current, img]);
        } catch {
          /* ignore */
        }
        if (typeof window !== 'undefined') window.removeEventListener('load', onComplete);
      };
    } catch {
      hideLoader();
      return () => clearTimeout(safetyTimer);
    }
  }, []);

  return (
    <>
      {visible && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg will-change-transform"
          aria-hidden="true"
        >
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* kein bg / keine rounded border — nur Glow + Bild, kein Kasten-Rahmen */}
            <div className="relative isolate flex h-[160px] w-[160px] shrink-0 items-center justify-center overflow-visible">
              <div
                ref={burstRef}
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 'min(300px, 88vw)',
                  height: 'min(300px, 88vw)',
                  background: `radial-gradient(circle closest-side, rgba(${G},0.44) 0%, rgba(${G},0.12) 52%, transparent 100%)`,
                }}
                aria-hidden
              />
              <div
                ref={glowRef}
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 'min(260px, 82vw)',
                  height: 'min(260px, 82vw)',
                  background: `radial-gradient(circle closest-side, rgba(${G},0.52) 0%, rgba(${G},0.16) 48%, transparent 100%)`,
                  filter: 'blur(20px)',
                }}
                aria-hidden
              />
              <img
                ref={imgRef}
                src={LOADER_CLOVER}
                alt=""
                width={320}
                height={272}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="relative z-10 block h-full w-full max-h-[160px] max-w-[160px] object-contain"
                style={cloverImgStyle}
                draggable={false}
              />
            </div>
            <p className="font-heading text-sm font-bold italic uppercase tracking-wider text-white/90 [text-shadow:0_0_24px_rgba(0,0,0,0.85),0_2px_8px_rgba(0,0,0,0.9)]">
              MARYO&apos;S FAHRSCHULE
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              ref={progressRef}
              className="h-full w-full bg-green-500"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      )}
      <div>{children}</div>
    </>
  );
}
