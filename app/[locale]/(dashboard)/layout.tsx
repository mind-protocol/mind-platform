import type { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard | Mind Protocol',
  description: 'Mind Protocol citizen dashboard — registry, biometrics, and network status.',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
