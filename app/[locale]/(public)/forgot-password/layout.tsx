import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password | Mind Protocol',
  description: 'Reset your Mind Protocol account password.',
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
