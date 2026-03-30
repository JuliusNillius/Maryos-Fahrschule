export type InstructorLang = 'de' | 'ar' | 'tr' | 'ru' | 'en' | 'fr';
export type InstructorClass = 'B' | 'BE' | 'A' | 'A1' | 'A2' | 'AM';

export interface Instructor {
  id: string;
  name: string;
  title: string;
  languages: InstructorLang[];
  classes: InstructorClass[];
  specialty?: string;
  tags: string[];
  quote: string;
  available: boolean;
  image: string;
}

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'maryo',
    name: 'Maryo A.',
    title: 'Inhaber',
    languages: ['de', 'ar', 'en'],
    classes: ['B', 'BE', 'A'],
    specialty: 'Prüfungscoach',
    tags: ['Geduldig', 'Erfahren', 'Motivierend'],
    quote: 'Ich bringe dich sicher ans Ziel.',
    available: true,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
  },
  {
    id: 'anna',
    name: 'Anna K.',
    title: 'Angst-Expertin',
    languages: ['de', 'ru'],
    classes: ['B', 'AM'],
    specialty: 'Angst-Expertin',
    tags: ['Einfühlsam', 'Ruhig', 'Strukturiert'],
    quote: 'Gemeinsam schaffen wir das.',
    available: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
  },
  {
    id: 'can',
    name: 'Can T.',
    title: 'Motorrad-Spezialist',
    languages: ['de', 'tr', 'en'],
    classes: ['B', 'A1', 'A2', 'A'],
    specialty: 'Motorrad-Spezialist',
    tags: ['Leidenschaftlich', 'Präzise', 'Humorvoll'],
    quote: 'Motorrad ist Freiheit — ich zeige dir wie.',
    available: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
  },
  {
    id: 'elena',
    name: 'Elena V.',
    title: 'Automatik-Expertin',
    languages: ['de', 'ru'],
    classes: ['B', 'BE'],
    specialty: 'Automatik-Expertin',
    tags: ['Professionell', 'Freundlich', 'Geduldig'],
    quote: 'Automatik ist die Zukunft.',
    available: false,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
  },
  {
    id: 'ahmad',
    name: 'Ahmad M.',
    title: 'Neueinsteiger-Coach',
    languages: ['de', 'ar', 'fr'],
    classes: ['B', 'AM', 'A1'],
    specialty: 'Neueinsteiger-Coach',
    tags: ['Verständnisvoll', 'Locker', 'Unterstützend'],
    quote: 'Jeder fängt mal an — ich bin dabei.',
    available: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
];

const LANG_FLAGS: Record<InstructorLang, string> = {
  de: '🇩🇪',
  ar: '🇸🇦',
  tr: '🇹🇷',
  ru: '🇷🇺',
  en: '🇬🇧',
  fr: '🇫🇷',
};

export function getLangFlag(lang: InstructorLang): string {
  return LANG_FLAGS[lang];
}

export function getClassesForFilter(classes: InstructorClass[]): 'pkw' | 'motorrad' | 'both' {
  const hasPkw = classes.some((c) => c === 'B' || c === 'BE');
  const hasMotorrad = classes.some((c) => c === 'A' || c === 'A1' || c === 'A2');
  if (hasPkw && hasMotorrad) return 'both';
  if (hasMotorrad) return 'motorrad';
  return 'pkw';
}
