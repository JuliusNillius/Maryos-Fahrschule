'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * §08 SPEED LINES CANVAS — persistent, z-index 0
 * Green lines shoot from center at 0.04 opacity.
 * 200 lines recycled in requestAnimationFrame loop.
 * Accelerate during: page load (initial burst), section wipes, CTA clicks.
 *
 * Trigger acceleration from anywhere:
 *   window.dispatchEvent(new CustomEvent('speedlines-accelerate'));
 */
const LINE_COUNT = 200;
const BASE_SPEED = 2.5;
const MAX_LINE_LENGTH = 1200;
const GREEN = 'rgba(93, 196, 34, 0.04)';

interface Line {
  angle: number;
  length: number;
  distance: number;
  speed: number;
}

function createLine(): Line {
  return {
    angle: Math.random() * Math.PI * 2,
    length: 80 + Math.random() * 200,
    distance: Math.random() * MAX_LINE_LENGTH,
    speed: BASE_SPEED * (0.6 + Math.random() * 0.8),
  };
}

export default function SpeedLinesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
  const rafRef = useRef<number>(0);
  const speedMultiplierRef = useRef(1.5); // §08: accelerate on page load
  const lastTimeRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    resize();
    window.addEventListener('resize', resize);

    // Initialize 200 lines
    if (linesRef.current.length === 0) {
      linesRef.current = Array.from({ length: LINE_COUNT }, createLine);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.8;

    const onAccelerate = () => {
      speedMultiplierRef.current = Math.min(3, speedMultiplierRef.current + 0.8);
    };
    window.addEventListener('speedlines-accelerate', onAccelerate);

    const tick = (time: number) => {
      const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 16.67 : 1;
      lastTimeRef.current = time;

      // Decay page-load acceleration over ~3s
      const mult = speedMultiplierRef.current;
      if (mult > 1) {
        speedMultiplierRef.current = Math.max(1, mult - 0.002 * delta);
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.strokeStyle = GREEN;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      const currentMult = speedMultiplierRef.current;

      for (let i = 0; i < linesRef.current.length; i++) {
        const line = linesRef.current[i];
        line.distance += line.speed * delta * currentMult;

        if (line.distance > maxDist || line.distance > MAX_LINE_LENGTH) {
          Object.assign(line, createLine());
          line.distance = 0;
        }

        const startX = cx + Math.cos(line.angle) * (line.distance - line.length);
        const startY = cy + Math.sin(line.angle) * (line.distance - line.length);
        const endX = cx + Math.cos(line.angle) * line.distance;
        const endY = cy + Math.sin(line.angle) * line.distance;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('speedlines-accelerate', onAccelerate);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 1 }}
    />
  );
}
