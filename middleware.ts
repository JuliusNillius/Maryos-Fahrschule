import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  if (host === 'maryosfahrschule.de') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.maryosfahrschule.de';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  const path = request.nextUrl.pathname;
  // Backoffice: nicht durch next-intl (Auth-Prüfung erfolgt im Backoffice-Layout)
  if (path.startsWith('/backoffice')) {
    return NextResponse.next();
  }
  // Alte URL /ru/… auf Deutsch umleiten (/en ist gültige Locale)
  const seg = path.split('/').filter(Boolean)[0];
  if (seg === 'ru') {
    const rest = path.split('/').slice(2).join('/');
    const target = rest ? `/de/${rest}` : '/de';
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url);
  }
  return intlMiddleware(request);
}

export const config = {
  // next-intl: alle Pfade außer api, _next, documents, backoffice, Dateien
  matcher: ['/((?!api|_next|_vercel|documents(?:/|$)|backoffice(?:/|$)|.*\\..*).*)', '/backoffice', '/backoffice/login', '/backoffice/:path*'],
};
