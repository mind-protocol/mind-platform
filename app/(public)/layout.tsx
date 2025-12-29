// DOCS: docs/landing/IMPLEMENTATION_Landing_Code.md
import type { ReactNode } from 'react';
import { TopNav, Footer } from './components/nav';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
