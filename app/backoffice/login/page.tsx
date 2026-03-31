import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default function BackofficeLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <p className="text-text-muted">Lade …</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
