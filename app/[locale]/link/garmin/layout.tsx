import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Connect Garmin | Mind Protocol',
  description: 'Link your Garmin account to enable biometric tracking with Mind Protocol.',
};

export default function GarminLinkLayout({ children }: { children: ReactNode }) {
  return children;
}
