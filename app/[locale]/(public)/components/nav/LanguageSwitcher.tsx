'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  zh: '中文',
  es: 'ES',
  pt: 'PT',
  ru: 'RU',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.replace(pathname, { locale: e.target.value });
  }

  return (
    <select
      value={locale}
      onChange={onChange}
      className="bg-zinc-800 text-zinc-300 text-sm px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500 transition cursor-pointer focus:outline-none focus:border-amber-500"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_LABELS[loc]}
        </option>
      ))}
    </select>
  );
}
