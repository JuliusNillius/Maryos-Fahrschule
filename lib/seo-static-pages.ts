import type { Locale } from '@/lib/seo';

type PageMeta = { title: string; description: string };

const ANMELDEN: Record<Locale, PageMeta> = {
  de: {
    title: 'Führerschein online anmelden | Maryos Fahrschule Mönchengladbach',
    description:
      'Online-Anmeldung: Klasse B, BF17, B197, BE. Lehrer wählen, Stripe-Zahlung, mehrsprachig. Maryos Fahrschule, Bahnhofstraße 25. Tel. 0178 4557528',
  },
  en: {
    title: 'Register online for your licence | Maryos Driving School Mönchengladbach',
    description:
      'Online registration: classes B, BF17, B197, BE. Choose your instructor and pay securely. Maryos in Mönchengladbach. Call 0178 4557528',
  },
  tr: {
    title: 'Ehliyeti online kayıt | Maryos Sürücü Kursu Mönchengladbach',
    description:
      'Online kayıt: B, BF17, B197, BE. Eğitmen seçimi ve güvenli ödeme. Mönchengladbach’ta Maryos. 0178 4557528',
  },
  ar: {
    title: 'التسجيل أونلاين للرخصة | مدرسة ماريو مونشنغلادباخ',
    description:
      'تسجيل أونلاين: فئات B وBF17 وB197 وBE. اختر المدرب وادفع بأمان. ماريو في مونشنغلادباخ. 0178 4557528',
  },
};

const BLOG_INDEX: Record<Locale, PageMeta> = {
  de: {
    title: 'Blog & Tipps zum Führerschein | Maryos Fahrschule Mönchengladbach',
    description:
      'Artikel und Tipps rund um Führerschein, Ausbildung und Verkehr — Maryos Fahrschule Mönchengladbach.',
  },
  en: {
    title: 'Blog & driving tips | Maryos Driving School Mönchengladbach',
    description: 'Articles on licences, training and road safety — Maryos driving school in Mönchengladbach.',
  },
  tr: {
    title: 'Blog ve ehliyet ipuçları | Maryos Mönchengladbach',
    description: 'Ehliyet, eğitim ve trafik hakkında yazılar — Maryos Sürücü Kursu Mönchengladbach.',
  },
  ar: {
    title: 'المدونة ونصائح الرخصة | مدرسة ماريو مونشنغلادباخ',
    description: 'مقالات عن الرخصة والتدريب والسلامة — مدرسة ماريو في مونشنغلادباخ.',
  },
};

const FLOTTE: Record<Locale, PageMeta> = {
  de: {
    title: 'Flotte & Ausbildungsfahrzeuge | Maryos Fahrschule Mönchengladbach',
    description:
      'Unsere Fahrzeuge für die Ausbildung — Schaltung und Automatik, Klasse B und BF17. Maryos Fahrschule Mönchengladbach.',
  },
  en: {
    title: 'Fleet & training cars | Maryos Driving School Mönchengladbach',
    description: 'Our training vehicles — manual and automatic for class B and BF17. Maryos in Mönchengladbach.',
  },
  tr: {
    title: 'Filo ve eğitim araçları | Maryos Mönchengladbach',
    description: 'B ve BF17 için manuel ve otomatik eğitim araçları — Maryos Sürücü Kursu.',
  },
  ar: {
    title: 'الأسطول ومركبات التدريب | مدرسة ماريو مونشنغلادباخ',
    description: 'مركبات التدريب يدوي وأوتوماتيك لفئتي B وBF17 — ماريو في مونشنغلادباخ.',
  },
};

const IMPRESSUM: Record<Locale, PageMeta> = {
  de: {
    title: 'Impressum | Maryos Fahrschule GmbH Mönchengladbach',
    description:
      'Impressum und Anbieterkennzeichnung: Maryos Fahrschule GmbH, Bahnhofstraße 25, 41236 Mönchengladbach.',
  },
  en: {
    title: 'Legal notice | Maryos Fahrschule GmbH Mönchengladbach',
    description: 'Imprint and legal information for Maryos Fahrschule GmbH, Bahnhofstraße 25, Mönchengladbach.',
  },
  tr: {
    title: 'Künye | Maryos Fahrschule GmbH Mönchengladbach',
    description: 'Maryos Fahrschule GmbH künye: Bahnhofstraße 25, 41236 Mönchengladbach.',
  },
  ar: {
    title: 'بيانات الناشر | Maryos Fahrschule GmbH مونشنغلادباخ',
    description: 'معلومات قانونية: Maryos Fahrschule GmbH، Bahnhofstraße 25، مونشنغلادباخ.',
  },
};

const DATENSCHUTZ: Record<Locale, PageMeta> = {
  de: {
    title: 'Datenschutzerklärung | Maryos Fahrschule Mönchengladbach',
    description:
      'Informationen zur Verarbeitung personenbezogener Daten (DSGVO) bei Nutzung der Website und Online-Anmeldung.',
  },
  en: {
    title: 'Privacy policy | Maryos Driving School Mönchengladbach',
    description: 'How we process personal data (GDPR) when you use our website and online registration.',
  },
  tr: {
    title: 'Gizlilik politikası | Maryos Mönchengladbach',
    description: 'Web sitesi ve online kayıtta kişisel verilerin işlenmesi (GDPR) hakkında bilgi.',
  },
  ar: {
    title: 'سياسة الخصوصية | مدرسة ماريو مونشنغلادباخ',
    description: 'معلومات عن معالجة البيانات الشخصية (اللائحة العامة) عند استخدام الموقع والتسجيل أونلاين.',
  },
};

const AGB: Record<Locale, PageMeta> = {
  de: {
    title: 'AGB | Maryos Fahrschule Mönchengladbach',
    description:
      'Allgemeine Geschäftsbedingungen für Ausbildungsverträge und Leistungen der Maryos Fahrschule GmbH.',
  },
  en: {
    title: 'Terms & conditions | Maryos Driving School Mönchengladbach',
    description: 'General terms for training contracts and services of Maryos Fahrschule GmbH.',
  },
  tr: {
    title: 'Genel şartlar | Maryos Mönchengladbach',
    description: 'Maryos Fahrschule GmbH eğitim sözleşmeleri ve hizmetleri için genel koşullar.',
  },
  ar: {
    title: 'الشروط العامة | مدرسة ماريو مونشنغلادباخ',
    description: 'الشروط العامة لعقود التدريب وخدمات Maryos Fahrschule GmbH.',
  },
};

const DASHBOARD: Record<Locale, PageMeta> = {
  de: {
    title: 'Schüler-Dashboard | Maryos Fahrschule',
    description: 'Persönlicher Bereich für Fahrschüler:innen (Login).',
  },
  en: {
    title: 'Student dashboard | Maryos Driving School',
    description: 'Personal area for students (login).',
  },
  tr: {
    title: 'Öğrenci paneli | Maryos',
    description: 'Öğrenciler için kişisel alan (giriş).',
  },
  ar: {
    title: 'لوحة الطالب | مدرسة ماريو',
    description: 'منطقة شخصية للمتدربين (تسجيل الدخول).',
  },
};

export function staticPageMeta(
  page: 'anmelden' | 'blog' | 'flotte' | 'impressum' | 'datenschutz' | 'agb' | 'dashboard',
  locale: Locale,
): PageMeta {
  const map = {
    anmelden: ANMELDEN,
    blog: BLOG_INDEX,
    flotte: FLOTTE,
    impressum: IMPRESSUM,
    datenschutz: DATENSCHUTZ,
    agb: AGB,
    dashboard: DASHBOARD,
  }[page];
  return map[locale];
}

export function lehrerDetailMeta(locale: Locale, instructorName: string): PageMeta {
  const name = instructorName.trim() || 'Fahrlehrer';
  const m: Record<Locale, (n: string) => PageMeta> = {
    de: (n) => ({
      title: `${n} – Fahrlehrer:in | Maryos Fahrschule Mönchengladbach`,
      description: `${n}: Fahrlehrer:in bei Maryos in Mönchengladbach. Profil, Sprachen und Buchung.`,
    }),
    en: (n) => ({
      title: `${n} – Driving instructor | Maryos Mönchengladbach`,
      description: `${n}: instructor at Maryos driving school in Mönchengladbach. Profile and booking.`,
    }),
    tr: (n) => ({
      title: `${n} – Direksiyon eğitmeni | Maryos Mönchengladbach`,
      description: `${n}: Maryos’ta direksiyon eğitmeni. Profil ve rezervasyon.`,
    }),
    ar: (n) => ({
      title: `${n} – مدرب قيادة | مدرسة ماريو مونشنغلادباخ`,
      description: `${n}: مدرب قيادة في مدرسة ماريو في مونشنغلادباخ. الملف والحجز.`,
    }),
  };
  return m[locale](name);
}
