'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * §05 PREMIUM CURSOR SYSTEM (desktop only)
 * DOT: 8px, #5DC422, instant tracking
 * RING: 36px, border 1.5px #5DC422@60%, lerp 0.12
 * States: default, link (56px + VIEW), CTA (80px filled + LOS →), video (PLAY ▶), drag (oval), click (squish)
 * Magnetic: within 80px → button moves max 14px, ring shrinks; leave → elastic spring back
 */
const DOT_SIZE = 8;
const RING_SIZE = 36;
const RING_LERP = 0.12;
const RING_BORDER = '1.5px';
const GREEN = '#5DC422';
const GREEN_60 = 'rgba(93, 196, 34, 0.6)';
const MAGNETIC_RADIUS = 80;
const MAGNETIC_PULL = 14;

type CursorState = 'default' | 'link' | 'cta' | 'video' | 'drag' | 'click';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringLabelRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hideOverHero, setHideOverHero] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const stateRef = useRef<CursorState>('default');
  const magneticTargetRef = useRef<{ el: HTMLElement } | null>(null);
  const isPressedRef = useRef(false);
  const clickScaleRef = useRef(1);
  const animScale = useRef({ s: 1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Nur System-Cursor ausblenden, wenn unser Cursor sichtbar ist (nicht über Hero)
    if (visible && !hideOverHero) document.body.classList.add('custom-cursor-active');
    else document.body.classList.remove('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, [mounted, visible, hideOverHero]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const ringLabel = ringLabelRef.current;
    if (!dot || !ring) return;

    const getState = (target: EventTarget | null): CursorState => {
      const el = target as HTMLElement | null;
      if (!el) return 'default';
      const node = el.closest?.('a, button, [data-cursor], video, [data-video]');
      if (!node) return isPressedRef.current ? 'click' : 'default';
      const cursorAttr = (node as HTMLElement).getAttribute?.('data-cursor');
      if (cursorAttr === 'link' || cursorAttr === 'cta' || cursorAttr === 'video' || cursorAttr === 'drag') return cursorAttr;
      if (node.tagName === 'VIDEO' || (node as HTMLElement).getAttribute?.('data-video')) return 'video';
      if (node.closest?.('[data-drag]')) return 'drag';
      if (node.closest?.('.btn-primary') || (node as HTMLElement).getAttribute?.('data-cta')) return 'cta';
      if (node.tagName === 'A') return 'link';
      if (node.tagName === 'BUTTON') return 'cta';
      return isPressedRef.current ? 'click' : 'default';
    };

    const getMagneticTarget = (x: number, y: number): HTMLElement | null => {
      const magnetic = document.querySelectorAll<HTMLElement>('[data-magnetic], .btn-primary');
      for (let i = 0; i < magnetic.length; i++) {
        const el = magnetic[i];
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const d = Math.hypot(x - cx, y - cy);
        if (d < MAGNETIC_RADIUS) return el;
      }
      return null;
    };

    const handleMove = (e: MouseEvent) => {
      const overHero = (e.target as Element)?.closest?.('[data-hide-custom-cursor]');
      setHideOverHero(!!overHero);

      if (!visible) {
        setVisible(true);
        pos.current = { x: e.clientX, y: e.clientY };
        ringPos.current = { x: e.clientX, y: e.clientY };
      } else {
        pos.current = { x: e.clientX, y: e.clientY };
      }

      const state = getState(e.target);
      stateRef.current = state;

      const magEl = getMagneticTarget(e.clientX, e.clientY);
      if (magEl && !magneticTargetRef.current) {
        magneticTargetRef.current = { el: magEl };
      } else if (!magEl && magneticTargetRef.current) {
        const { el } = magneticTargetRef.current;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
          overwrite: true,
        });
        magneticTargetRef.current = null;
      }

      if (magneticTargetRef.current) {
        const { el } = magneticTargetRef.current;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy) || 1;
        const t = Math.min(1, 1 - d / MAGNETIC_RADIUS);
        const pull = t * MAGNETIC_PULL;
        const moveX = (dx / d) * pull;
        const moveY = (dy / d) * pull;
        gsap.to(el, { x: moveX, y: moveY, duration: 0.2, ease: 'power2.out', overwrite: true });
      }
    };

    const handleOver = (e: MouseEvent) => {
      stateRef.current = getState(e.target);
    };

    const handleOut = () => {
      stateRef.current = 'default';
      if (magneticTargetRef.current) {
        const { el } = magneticTargetRef.current;
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: true });
        magneticTargetRef.current = null;
      }
    };

    const handleDown = () => {
      isPressedRef.current = true;
      stateRef.current = 'click';
      animScale.current.s = 0.7;
      clickScaleRef.current = 0.7;
    };

    const handleUp = () => {
      isPressedRef.current = false;
      stateRef.current = getState(document.elementFromPoint(pos.current.x, pos.current.y));
      gsap.to(animScale.current, {
        s: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        onUpdate: () => {
          clickScaleRef.current = animScale.current.s;
        },
      });
    };

    let raf = 0;
    const animate = () => {
      const { x: px, y: py } = pos.current;
      ringPos.current.x += (px - ringPos.current.x) * RING_LERP;
      ringPos.current.y += (py - ringPos.current.y) * RING_LERP;
      const { x: rx, y: ry } = ringPos.current;

      dot.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
      dot.style.width = `${DOT_SIZE}px`;
      dot.style.height = `${DOT_SIZE}px`;
      dot.style.backgroundColor = GREEN;

      const state = stateRef.current;
      const isMagnetic = !!magneticTargetRef.current;

      let ringW = RING_SIZE;
      let ringH = RING_SIZE;
      let ringFilled = false;
      let label = '';
      let ringScale = state === 'click' ? clickScaleRef.current : 1;
      let oval = false;

      if (state === 'link') {
        ringW = 56;
        ringH = 56;
        label = 'VIEW';
      } else if (state === 'cta') {
        ringW = 80;
        ringH = 80;
        ringFilled = true;
        label = 'LOS →';
      } else if (state === 'video') {
        ringW = 56;
        ringH = 56;
        ringFilled = true;
        label = 'PLAY ▶';
      } else if (state === 'drag') {
        ringW = 48;
        ringH = 36;
        oval = true;
      }
      if (isMagnetic) {
        ringW *= 0.75;
        ringH *= 0.75;
      }

      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${ringScale}, 1)`;
      ring.style.width = `${ringW}px`;
      ring.style.height = `${ringH}px`;
      ring.style.borderWidth = RING_BORDER;
      ring.style.borderColor = ringFilled ? GREEN : GREEN_60;
      ring.style.backgroundColor = ringFilled ? GREEN : 'transparent';
      ring.style.borderRadius = oval ? '50%' : '50%';
      if (ringLabel) {
        ringLabel.textContent = label;
        ringLabel.style.opacity = label ? '1' : '0';
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    document.body.addEventListener('mouseover', handleOver, true);
    document.body.addEventListener('mouseout', handleOut, true);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    raf = requestAnimationFrame(animate);

    const handleLeave = () => setVisible(false);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseover', handleOver, true);
      document.body.removeEventListener('mouseout', handleOut, true);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      cancelAnimationFrame(raf);
    };
  }, [mounted, visible]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full md:block"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: visible && !hideOverHero ? 1 : 0,
          visibility: visible && !hideOverHero ? 'visible' : 'hidden',
          transition: 'opacity 0.15s ease-out',
        }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden flex items-center justify-center rounded-full border bg-transparent md:flex"
        style={{
          transform: 'translate(-50%, -50%)',
          opacity: visible && !hideOverHero ? 1 : 0,
          visibility: visible && !hideOverHero ? 'visible' : 'hidden',
          transition: 'opacity 0.15s ease-out',
        }}
        aria-hidden
      >
        <span
          ref={ringLabelRef}
          className="font-heading text-[10px] font-bold uppercase tracking-wider text-black"
          style={{ opacity: 0, pointerEvents: 'none' }}
        />
      </div>
    </>
  );
}
