import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

// Dynamic import prevents wallet adapter SSR hydration mismatch
// (Phantom/Solflare extensions inject DOM during hydration)
const SolanaProvider = dynamic(
  () => import('@/components/SolanaProvider').then(m => ({ default: m.SolanaProvider })),
  { ssr: false },
);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SolanaProvider>
        {children}
      </SolanaProvider>
    </NextIntlClientProvider>
  );
}
