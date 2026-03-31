'use client';

import { useTranslations } from 'next-intl';

/**
 * §11 TRUST BAR
 * CSS infinite marquee, 40s linear, pauses on hover.
 * Duplicate content for seamless loop.
 * Style: text #666, ◆ = #5DC422, Inter 13px uppercase tracking-wide
 */
const ITEM_KEYS = [
  'item1',  // ⭐ 5.0 Google
  'item3',  // Apple Pay
  'item4',  // Sofort & Klarna
  'item10', // B · BF17 · 65 € / Fahrstunde
  'item6',  // 3 Sprachen
  'item2',  // 18 Rezensionen
  'item8',  // WhatsApp Support
  'item9',  // Gegründet 2025
  'item7',  // Mönchengladbach
  'item11', // 100% Online
  'item12', // TÜV-Prüfung
] as const;

export default function TrustBar() {
  const t = useTranslations('trustBar');

  const items = ITEM_KEYS.map((key) => t(key)).filter(Boolean);

  const Separator = () => (
    <span className="mx-3 shrink-0 text-green-500" aria-hidden>◆</span>
  );

  const Row = () => (
    <span className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className="whitespace-nowrap px-1 font-body text-[13px] uppercase tracking-wide"
            style={{ color: '#666' }}
          >
            {item}
          </span>
          {i < items.length - 1 && <Separator />}
        </span>
      ))}
      <Separator />
    </span>
  );

  return (
    <section
      className="overflow-hidden border-b border-[rgba(93,196,34,0.18)] bg-surface/80 py-3 backdrop-blur-sm"
      aria-label="Vertrauen"
    >
      <div className="flex w-max animate-trust-marquee hover:[animation-play-state:paused]">
        <Row />
        <Row />
      </div>
    </section>
  );
}
