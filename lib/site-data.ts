import { getSupabaseAdmin } from '@/lib/supabase';
import type { Instructor } from '@/lib/instructors';
import type { FleetVehicle } from '@/lib/fleet';
import { mapFleetRow } from '@/lib/fleet';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';

export type PricingItem = { id: string; class_id: string; price: string; popular: boolean; note: string | null };

/** Zitate von Google-Bewertungen (manuell im Backoffice pflegen). */
export type GoogleReviewQuote = {
  author: string;
  rating: number;
  text_de: string;
  text_en?: string;
  text_tr?: string;
  text_ar?: string;
};

export type SiteSettings = {
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    street?: string;
    zip?: string;
    city?: string;
    mapUrl?: string;
  };
  opening_hours?: { text?: string };
  stats?: { googleRating?: number; googleReviews?: number; languages?: number; classes?: number };
  impressum?: { company?: string; street?: string; zip?: string; city?: string; register?: string; owner?: string };
  social?: { instagram?: string; tiktok?: string; facebook?: string; youtube?: string };
  google_review_quotes?: GoogleReviewQuote[];
};

export type FaqItem = {
  id: string;
  sort_order: number;
  /** Filter-Kategorie auf der FAQ-Seite (z. B. preise, klassen). */
  category?: string;
  question_de: string;
  answer_de: string;
  question_en: string | null;
  answer_en: string | null;
  question_tr?: string | null;
  answer_tr?: string | null;
  question_ar?: string | null;
  answer_ar?: string | null;
  question_ru?: string | null;
  answer_ru?: string | null;
};

export type SiteData = {
  instructors: Instructor[];
  pricing: PricingItem[];
  settings: SiteSettings;
  faq: FaqItem[];
  fleet: FleetVehicle[];
};

function mapInstructor(row: {
  id: string;
  name: string;
  title: string;
  languages: string[];
  classes: string[];
  specialty: string | null;
  tags: string[];
  quote: string;
  available: boolean;
  image: string;
}): Instructor {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    languages: row.languages as Instructor['languages'],
    classes: row.classes as Instructor['classes'],
    specialty: row.specialty ?? undefined,
    tags: row.tags ?? [],
    quote: row.quote ?? '',
    available: row.available ?? true,
    image: row.image ?? '',
  };
}

const empty: SiteData = {
  instructors: [],
  pricing: [],
  settings: {},
  faq: [],
  fleet: [],
};

export async function getSiteData(): Promise<SiteData> {
  // Wichtig: Backoffice-Änderungen sollen sofort live sichtbar sein.
  // Next.js cached Server-Fetches sonst ggf. über Deployments/ISR hinweg.
  noStore();
  // Erzwingt dynamisches Rendering (verhindert Build-Time Snapshot/SSG).
  headers();
  const supabase = getSupabaseAdmin();

  // Lokaler `next build`: optional keine DB (sonst bis zu SITE_DATA_TIMEOUT_MS pro Aufruf, oft wirkt das wie „Hänger“).
  // Nicht auf Vercel/Production setzen — nur in `.env.local` für schnellere Builds.
  if (process.env.NEXT_PHASE === 'phase-production-build' && process.env.SKIP_BUILD_SUPABASE === '1') {
    return empty;
  }

  // Im Development ohne Supabase-Zugriff starten, damit localhost sofort lädt (Supabase ggf. langsam/blockiert)
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_USE_SUPABASE !== '1') {
    return empty;
  }

  if (!supabase) return empty;

  const SITE_DATA_TIMEOUT_MS = 6000;

  try {
    const dataPromise = Promise.all([
      supabase.from('instructors').select('*').order('sort_order', { ascending: true }),
      supabase.from('pricing').select('*').order('class_id'),
      supabase.from('site_settings').select('key, value'),
      supabase.from('faq').select('*').order('sort_order'),
      supabase
        .from('fleet')
        .select(
          'id, model, transmission, classes, image, power_ps, has_driver_assistance, has_apple_carplay, steckbrief_notes'
        )
        .order('sort_order', { ascending: true }),
    ]);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('getSiteData timeout')), SITE_DATA_TIMEOUT_MS)
    );
    const [instructorsRes, pricingRes, settingsRes, faqRes, fleetRes] = await Promise.race([
      dataPromise,
      timeoutPromise,
    ]);

    const instructors = (instructorsRes.data ?? []).map(mapInstructor);
    const fleet: FleetVehicle[] = (fleetRes.data ?? []).map((r: Parameters<typeof mapFleetRow>[0]) => mapFleetRow(r));
    const pricing: PricingItem[] = (pricingRes.data ?? []).map((r: { id: string; class_id: string; price: string; popular: boolean; note: string | null }) => ({
      id: r.id,
      class_id: r.class_id,
      price: r.price,
      popular: r.popular ?? false,
      note: r.note ?? null,
    }));

    const settings: SiteSettings = {};
    (settingsRes.data ?? []).forEach((r: { key: string; value: unknown }) => {
      settings[r.key as keyof SiteSettings] = r.value as never;
    });

    if (settings.stats?.languages === 3) {
      settings.stats = { ...settings.stats, languages: 4 };
    }

    const faq: FaqItem[] = (faqRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      sort_order: (r.sort_order as number) ?? 0,
      category: (r.category as string | undefined) ?? 'allgemein',
      question_de: (r.question_de as string) ?? '',
      answer_de: (r.answer_de as string) ?? '',
      question_en: (r.question_en as string | null) ?? null,
      answer_en: (r.answer_en as string | null) ?? null,
      question_tr: (r.question_tr as string | null) ?? null,
      answer_tr: (r.answer_tr as string | null) ?? null,
      question_ar: (r.question_ar as string | null) ?? null,
      answer_ar: (r.answer_ar as string | null) ?? null,
      question_ru: (r.question_ru as string | null) ?? null,
      answer_ru: (r.answer_ru as string | null) ?? null,
    }));

    return { instructors, pricing, settings, faq, fleet };
  } catch {
    return empty;
  }
}
