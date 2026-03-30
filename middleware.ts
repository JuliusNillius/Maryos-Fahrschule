import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Backoffice: nicht durch next-intl (Auth-Prüfung erfolgt im Backoffice-Layout)
  if (path.startsWith('/backoffice')) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  // next-intl: alle Pfade außer api, _next, documents, backoffice, Dateien
  matcher: ['/((?!api|_next|_vercel|documents(?:/|$)|backoffice(?:/|$)|.*\\..*).*)', '/backoffice', '/backoffice/login', '/backoffice/:path*'],
};
