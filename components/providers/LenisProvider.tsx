'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * §07 SMOOTH SCROLL ENGINE
 * Lenis config: duration 1.4, custom easing, smoothWheel, wheel/touch multipliers.
 * GSAP ScrollTrigger.scrollerProxy synced with Lenis RAF loop.
 * Every pixel of scroll feels weighted and intentional.
 */
const LENIS_OPTIONS = {
  // Kürzeres Smoothing = direktere Reaktion auf Rad/Touch (Hero-Pin fühlt sich sonst „schwer“ an)
  duration: 0.42,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.35,
  touchMultiplier: 2.4,
  syncTouch: true,
  autoResize: true,
};

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;

    // §07: ScrollTrigger reads/writes scroll via Lenis
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') lenis.scrollTo(value);
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        } as DOMRect;
      },
    });

    lenis.on('scroll', ScrollTrigger.update);

    // §07: Single RAF loop — Lenis runs on GSAP ticker (time in s → ms for Lenis)
    const gsapRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapRaf);
    gsap.ticker.lagSmoothing(0);

    // Recalculate ScrollTrigger after proxy is active (next frame so layout is ready)
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(gsapRaf);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return <>{children}</>;
}
