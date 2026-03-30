'use client';

import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import FloatingActions from './FloatingActions';
import MobileBottomBar from './MobileBottomBar';

const LoadingScreen = dynamic(() => import('./LoadingScreen'), { ssr: false });

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LoadingScreen>
      <Navbar />
      {children}
      <FloatingActions />
      <MobileBottomBar />
    </LoadingScreen>
  );
}
