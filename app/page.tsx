import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

/**
 * Root /: Leitet immer auf die Startseite (Standard-Sprache) weiter.
 * localhost:3000/ → localhost:3000/de
 */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
