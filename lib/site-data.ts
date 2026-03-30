import { getSupabaseAdmin } from '@/lib/supabase';
import type { Instructor } from '@/lib/instructors';
import type { FleetVehicle } from '@/lib/fleet';
import { mapFleetRow } from '@/lib/fleet';

export type PricingItem = { id: string; class_id: string; price: string; popular: boolean; note: string | null };

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
  social?: { instagram?: string; tiktok?: string; facebook?: string };
};

export type FaqItem = {
  id: string;
  sort_order: number;
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
  const supabase = getSupabaseAdmin();

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
      supabase.from('fleet').select('id, model, transmission, classes, image').order('sort_order', { ascending: true }),
    ]);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('getSiteData timeout')), SITE_DATA_TIMEOUT_MS)
    );
    const [instructorsRes, pricingRes, settingsRes, faqRes, fleetRes] = await Promise.race([
      dataPromise,
      timeoutPromise,
    ]);

    const instructors = (instructorsRes.data ?? []).map(mapInstructor);
    const fleet: FleetVehicle[] = (fleetRes.data ?? []).map((r: { id: string; model: string; transmission: string; classes: string[]; image: string }) => mapFleetRow(r));
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

    const faq: FaqItem[] = (faqRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      sort_order: (r.sort_order as number) ?? 0,
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
