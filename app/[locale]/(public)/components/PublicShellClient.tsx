'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TopNav, Footer } from './nav';
import ChatWidget from '@/components/chat/ChatWidget';
import VersionToast from '@/app/components/VersionToast';
import { ToastProvider } from '@/components/Toast';

// Routes that render in full immersive mode (no header/footer/chat)
const IMMERSIVE_ROUTES = ['/tracker/3d'];

export default function PublicShellClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Strip locale prefix (e.g. /en/tracker/3d → /tracker/3d)
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/)/, '');
  const immersive = IMMERSIVE_ROUTES.some(r => cleanPath.startsWith(r));

  if (immersive) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <TopNav />
      <div className="pt-16">{children}</div>
      <Footer />
      <ChatWidget />
      <VersionToast />
    </ToastProvider>
  );
}
