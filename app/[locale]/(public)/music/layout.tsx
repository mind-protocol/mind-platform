'use client';

import type { ReactNode } from 'react';

export default function MusicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-[#050a14] text-[#d8dfe8] overflow-hidden">
      {children}
    </div>
  );
}
