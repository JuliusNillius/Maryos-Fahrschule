'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Ladebildschirm: Exakt das Kleeblatt aus dem Logo (Bild),
 * setzt sich in 4 Schritten zusammen (Maske pro „Blatt“), dann Vorhang hoch.
 */

const MASK_ID = 'clover-reveal-mask';

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const maskRectRefs = [
    useRef<SVGRectElement>(null),
    useRef<SVGRectElement>(null),
    useRef<SVGRectElement>(null),
    useRef<SVGRectElement>(null),
  ];
  const progressRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideLoader = () => setVisible(false);

    const safetyTimer = setTimeout(hideLoader, 5000);

    const overlay = overlayRef.current;
    const progressBar = progressRef.current;
    const rects = maskRectRefs.map((r) => r.current).filter(Boolean) as SVGRectElement[];

    if (!overlay || !burstRef.current || !glowRef.current || !progressBar || rects.length !== 4) {
      const fallback = setTimeout(hideLoader, 400);
      return () => {
        clearTimeout(safetyTimer);
        clearTimeout(fallback);
      };
    }

    let cancelled = false;
    try {
      gsap.set(burstRef.current, { scale: 0.3, opacity: 0 });
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });
      rects.forEach((r) => gsap.set(r, { opacity: 0 }));

      const progress = { value: 0 };

      const applyProgress = (p: number) => {
        if (cancelled || !progressBar) return;
        const clamped = Math.min(1, Math.max(0, p));
        rects.forEach((rect, i) => {
          const segmentStart = i / 4;
          const segmentEnd = (i + 1) / 4;
          const t =
            clamped <= segmentStart ? 0 : clamped >= segmentEnd ? 1 : (clamped - segmentStart) / (segmentEnd - segmentStart);
          rect.style.opacity = String(t);
        });
        progressBar.style.transform = `scaleX(${clamped})`;
      };

      const tl = gsap.timeline();

      tl.to(burstRef.current, {
        scale: 1,
        opacity: 0.35,
        duration: 0.5,
        ease: 'power2.out',
      });

      tl.to(glowRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.2);

      // Dynamisches Pulsieren des grünen Lichts (Endlosschleife bis Vorhang)
      tl.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.7,
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      }, 0.5);
      tl.to(burstRef.current, {
        scale: 1.08,
        opacity: 0.5,
        duration: 1.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      }, 0.5);

      tl.to(progress, {
        value: 1,
        duration: 2.2,
        ease: 'none',
        onUpdate: () => applyProgress(progress.value),
      }, 0.4);

      const onComplete = () => {
        if (cancelled) return;
        gsap.to(progress, { value: 1, duration: 0.2, onUpdate: () => applyProgress(progress.value) });
      };
      if (typeof document !== 'undefined') {
        if (document.readyState === 'complete') onComplete();
        else window.addEventListener('load', onComplete);
      }

      tl.to(overlay, { y: '-100%', duration: 0.7, ease: 'expo.inOut' }, 2.9);
      tl.add(() => {
        if (!cancelled) setTimeout(hideLoader, 100);
      }, 2.9 + 0.7);

      return () => {
        cancelled = true;
        clearTimeout(safetyTimer);
        tl.kill();
        gsap.killTweensOf([glowRef.current, burstRef.current]);
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black will-change-transform"
          aria-hidden="true"
        >
          {/* Weicher grüner Burst nur hinter dem Kleeblatt (Mitte) */}
          <div
            ref={burstRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{
              width: '320px',
              height: '320px',
              maxWidth: '90vw',
              maxHeight: '90vw',
              background:
                'radial-gradient(circle, rgba(93,196,34,0.4) 0%, rgba(93,196,34,0.12) 40%, transparent 70%)',
            }}
            aria-hidden
          />
          {/* Grünes Licht hinter dem Kleeblatt – pulsierend */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{
              width: '280px',
              height: '280px',
              maxWidth: '85vw',
              maxHeight: '85vw',
              background:
                'radial-gradient(circle, rgba(93,196,34,0.5) 0%, rgba(93,196,34,0.2) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Exakt das Kleeblatt-Bild – Maske blendet es in 4 Schritten ein (oben, rechts, unten, links) */}
            <div className="relative h-[160px] w-[160px] flex-shrink-0">
              <svg width="0" height="0" aria-hidden>
                <defs>
                  <mask id={MASK_ID} maskContentUnits="objectBoundingBox">
                    <rect x="0" y="0" width="1" height="1" fill="black" />
                    <rect ref={maskRectRefs[0]} x="0.2" y="0" width="0.6" height="0.4" fill="white" />
                    <rect ref={maskRectRefs[1]} x="0.6" y="0.2" width="0.4" height="0.6" fill="white" />
                    <rect ref={maskRectRefs[2]} x="0.2" y="0.6" width="0.6" height="0.4" fill="white" />
                    <rect ref={maskRectRefs[3]} x="0" y="0.2" width="0.4" height="0.6" fill="white" />
                  </mask>
                </defs>
              </svg>
              <img
                src="/kleeblatt-logo.png"
                alt=""
                width={160}
                height={160}
                className="h-full w-full object-contain"
                style={{
                  mask: `url(#${MASK_ID})`,
                  WebkitMaskImage: `url(#${MASK_ID})`,
                  maskSize: 'cover',
                  WebkitMaskSize: 'cover',
                  mixBlendMode: 'lighten',
                }}
              />
            </div>
            <p className="font-heading text-sm font-bold italic uppercase tracking-wider text-white/80">
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
