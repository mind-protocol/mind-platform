// DOCS: docs/landing/IMPLEMENTATION_Landing_Code.md
import type { ReactNode } from 'react';
import PublicShellClient from './components/PublicShellClient';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicShellClient>{children}</PublicShellClient>;
}
