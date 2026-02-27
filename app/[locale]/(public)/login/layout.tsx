import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Login | Mind Protocol',
  description: 'Sign in to your Mind Protocol account.',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
