import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Reset Password | Mind Protocol',
  description: 'Set a new password for your Mind Protocol account.',
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
