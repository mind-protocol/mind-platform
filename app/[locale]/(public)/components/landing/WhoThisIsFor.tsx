'use client';

import { useTranslations } from 'next-intl';

interface DoorProps {
  icon: string;
  identity: string;
  message: string;
}

function Door({ icon, identity, message }: DoorProps) {
  return (
    <div className="p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-zinc-300 mb-3">{identity}</h3>
      <p className="text-zinc-500 leading-relaxed">{message}</p>
    </div>
  );
}

export function WhoThisIsFor() {
  const t = useTranslations('Landing.Doors');

  const doors: DoorProps[] = [
    { icon: '🕯️', identity: t('door1Identity'), message: t('door1Message') },
    { icon: '🤖', identity: t('door2Identity'), message: t('door2Message') },
    { icon: '🔨', identity: t('door3Identity'), message: t('door3Message') },
    { icon: '🏛️', identity: t('door4Identity'), message: t('door4Message') },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-zinc-500 text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {doors.map((door) => (
            <Door key={door.identity} {...door} />
          ))}
        </div>
      </div>
    </section>
  );
}
