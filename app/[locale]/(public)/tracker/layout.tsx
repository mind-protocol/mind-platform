import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Body Tracker | Mind Protocol',
  description:
    'Precision dosing, biometric correlation, and real-time body awareness. Track substances, food, sensations, and observe how they affect your nervous system.',
  openGraph: {
    title: 'Body Tracker — Mind Protocol',
    description:
      'Real-time biometric correlation with substance tracking. See how what you take affects how you feel.',
  },
};

export default function TrackerLayout({ children }: { children: ReactNode }) {
  return children;
}
