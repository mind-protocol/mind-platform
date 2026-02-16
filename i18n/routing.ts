import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'zh', 'es', 'pt', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
