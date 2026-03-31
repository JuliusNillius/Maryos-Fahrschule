/** Aktuelle Kurs-Preise (inkl. MwSt., Stand Website) */
export const PRICING_REGISTRATION_EUR = 349;
export const PRICING_APP_EUR = 50;
export const PRICING_LESSON_HOUR_EUR = 65;

/** Einmalzahlung bei Online-Anmeldung: nur Anmeldung + Lern-App */
export const PRICING_CHECKOUT_TOTAL_EUR = PRICING_REGISTRATION_EUR + PRICING_APP_EUR;

/** Angebotsarten (Anmeldung) */
export const OFFER_STANDARD = 'standard' as const;
/** 10 Fahrstunden gesamt, 1 Stunde als Angebot (Abrechnung: 9 × Fahrstundenpreis + Standard-Anmeldung) */
export const OFFER_BUNDLE_10_PROMO = 'bundle_10_promo' as const;
export const OFFER_TYPES = [OFFER_STANDARD, OFFER_BUNDLE_10_PROMO] as const;
export type OfferType = (typeof OFFER_TYPES)[number];

export function parseOfferType(raw: unknown): OfferType {
  if (raw === OFFER_BUNDLE_10_PROMO) return OFFER_BUNDLE_10_PROMO;
  return OFFER_STANDARD;
}

export type OfferCheckout = {
  totalEur: number;
  /** Nur Paket: gezahlte Fahrstunden (ohne Promo) */
  paidLessonHours: number;
  /** Nur Paket: Fahrstunden gesamt */
  totalLessonHours: number;
  /** Nur Promo-Stunden im Paket */
  promoLessonHours: number;
  /** Nur Paket: Summe Fahrstunden (bezahlt) */
  lessonSubtotalEur: number;
};

export function getOfferCheckout(offer: OfferType): OfferCheckout {
  const base = PRICING_REGISTRATION_EUR + PRICING_APP_EUR;
  if (offer === OFFER_STANDARD) {
    return {
      totalEur: base,
      paidLessonHours: 0,
      totalLessonHours: 0,
      promoLessonHours: 0,
      lessonSubtotalEur: 0,
    };
  }
  const totalLessonHours = 10;
  const promoLessonHours = 1;
  const paidLessonHours = totalLessonHours - promoLessonHours;
  const lessonSubtotalEur = paidLessonHours * PRICING_LESSON_HOUR_EUR;
  return {
    totalEur: base + lessonSubtotalEur,
    paidLessonHours,
    totalLessonHours,
    promoLessonHours,
    lessonSubtotalEur,
  };
}

export function getStripeAmountCentsForOffer(offer: OfferType): number {
  return Math.round(getOfferCheckout(offer).totalEur * 100);
}

/** Legacy: Standard-Anmeldung (Anmeldung + App) */
export const STRIPE_AMOUNT_CENTS = getStripeAmountCentsForOffer(OFFER_STANDARD);

export function getOfferDbFields(offer: OfferType): {
  offer_type: OfferType;
  bundle_lesson_hours: number | null;
  promo_lesson_hours: number | null;
} {
  if (offer === OFFER_STANDARD) {
    return { offer_type: OFFER_STANDARD, bundle_lesson_hours: null, promo_lesson_hours: null };
  }
  return { offer_type: OFFER_BUNDLE_10_PROMO, bundle_lesson_hours: 10, promo_lesson_hours: 1 };
}

/** Preisrechner: TÜV Praxisprüfung (nicht in Anmeldung enthalten, Richtwert) */
export const PRICING_TUV_EUR = 250;
export const PRICING_OTHER_EUR = 270;
