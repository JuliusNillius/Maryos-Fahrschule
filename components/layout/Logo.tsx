'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK_SVG = '/logo.svg';
const LOGO_PNG = '/logo.png';

type LogoVariant = 'navbar' | 'footer';

const SIZES: Record<LogoVariant, { width: number; height: number; className: string }> = {
  navbar: { width: 180, height: 46, className: 'h-12 w-auto object-contain' },
  footer: { width: 200, height: 64, className: 'h-16 w-auto object-contain' },
};

const TEXT_FALLBACK = (
  <span className="font-heading text-xl font-bold italic text-white">
    MARYO&apos;S <span className="text-green-500">FAHRSCHULE</span>
  </span>
);

export default function Logo({ variant = 'navbar' }: { variant?: LogoVariant }) {
  const [useSvg, setUseSvg] = useState(false);
  const [useText, setUseText] = useState(false);
  const { width, height, className } = SIZES[variant];

  if (useText) {
    return TEXT_FALLBACK;
  }

  if (useSvg) {
    return (
      <img
        src={FALLBACK_SVG}
        alt="Maryo's Fahrschule"
        width={width}
        height={height}
        className={className}
        onError={() => setUseText(true)}
      />
    );
  }

  return (
    <Image
      src={LOGO_PNG}
      alt="Maryo's Fahrschule"
      width={width}
      height={height}
      className={className}
      priority={variant === 'navbar'}
      onError={() => setUseSvg(true)}
    />
  );
}
