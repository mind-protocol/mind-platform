import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export async function Nav() {
  const t = await getTranslations('Nav');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-zinc-400 hover:text-white transition">
          mind protocol
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/blog"
            className="text-zinc-500 hover:text-white transition"
          >
            {t('blog')}
          </Link>
          <Link
            href="/manifesto"
            className="text-zinc-500 hover:text-white transition"
          >
            {t('manifesto')}
          </Link>
          <Link
            href="/connectome"
            className="text-zinc-500 hover:text-white transition"
          >
            {t('connectome')}
          </Link>
          <Link
            href="/house"
            className="text-zinc-500 hover:text-white transition"
          >
            {t('house')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
