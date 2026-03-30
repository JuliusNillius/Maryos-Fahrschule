'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BackofficeShell from './BackofficeShell';

const AUTH_CHECK_TIMEOUT_MS = 12_000;

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoginPage = pathname === '/backoffice/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      setAllowed(false);
      return;
    }
    if (!supabase) {
      setChecking(false);
      router.replace('/backoffice/login?from=' + encodeURIComponent(pathname || '/backoffice'));
      return;
    }

    let cancelled = false;
    timeoutRef.current = setTimeout(() => {
      if (cancelled) return;
      setChecking(false);
      router.replace('/backoffice/login?from=' + encodeURIComponent(pathname || '/backoffice'));
    }, AUTH_CHECK_TIMEOUT_MS);

    async function checkAuth(session: { access_token: string } | null) {
      if (cancelled) return;
      if (!session) {
        setChecking(false);
        router.replace('/backoffice/login?from=' + encodeURIComponent(pathname || '/backoffice'));
        return;
      }
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 8000);
      let res: Response;
      try {
        res = await fetch('/api/backoffice/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
          signal: controller.signal,
        });
      } catch {
        clearTimeout(fetchTimeout);
        if (cancelled) return;
        setChecking(false);
        router.replace('/backoffice/login?from=' + encodeURIComponent(pathname || '/backoffice'));
        return;
      }
      clearTimeout(fetchTimeout);
      const json = await res.json();
      if (!cancelled) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setChecking(false);
        if (json?.ok) setAllowed(true);
        else router.replace('/backoffice/login?from=' + encodeURIComponent(pathname || '/backoffice'));
      }
    }

    void supabase.auth.getSession().then(({ data: { session } }) => checkAuth(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) checkAuth(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking || !allowed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-text-muted">Lade …</p>
      </div>
    );
  }

  return <BackofficeShell>{children}</BackofficeShell>;
}
