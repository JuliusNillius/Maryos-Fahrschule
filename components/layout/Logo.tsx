'use client';

import Image from 'next/image';
import { useState } from 'react';

/** Navbar: Kleeblatt; Footer: fertiges Wortmarken-PNG (weißes MARYO'S, grüne Linie, Slogan). */
const NAVBAR_SRC = '/kleeblatt-logo.png';
/** Physische Assets nach Retina-Max (s. public/) — klein halten für schnelles LCP */
const NAVBAR_INTRINSIC = { width: 560, height: 477 } as const;
const FOOTER_SRC = '/maryos-logo-footer.png';
const FOOTER_INTRINSIC = { width: 800, height: 448 } as const;

type LogoVariant = 'navbar' | 'footer';

const NAVBAR_IMAGE_CLASS = 'h-12 w-auto max-h-12 object-contain';
const FOOTER_IMAGE_CLASS =
  'h-auto max-h-[7.5rem] w-auto max-w-[min(100%,min(96vw,26rem))] object-contain object-left sm:max-h-[8.5rem]';

const TEXT_FALLBACK = (
  <span className="font-heading text-xl font-bold italic text-white">
    MARYO&apos;S <span className="text-green-primary">FAHRSCHULE</span>
  </span>
);

export default function Logo({ variant = 'navbar' }: { variant?: LogoVariant }) {
  const [useText, setUseText] = useState(false);

  if (useText) {
    return TEXT_FALLBACK;
  }

  const isFooter = variant === 'footer';
  const src = isFooter ? FOOTER_SRC : NAVBAR_SRC;
  const intrinsic = isFooter ? FOOTER_INTRINSIC : NAVBAR_INTRINSIC;
  const className = isFooter ? FOOTER_IMAGE_CLASS : NAVBAR_IMAGE_CLASS;

  return (
    <Image
      src={src}
      alt="Maryo's Fahrschule — Logo"
      width={intrinsic.width}
      height={intrinsic.height}
      sizes={isFooter ? '(max-width: 640px) 90vw, 416px' : '(max-width: 1024px) 120px, 48px'}
      className={className}
      priority={variant === 'navbar'}
      fetchPriority={variant === 'navbar' ? 'high' : 'auto'}
      onError={() => setUseText(true)}
    />
  );
}
