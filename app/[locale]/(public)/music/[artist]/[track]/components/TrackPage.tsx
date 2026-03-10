'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { loadTrack } from '@/lib/music/data/catalog';
import type { AugmentedTrack } from '@/lib/music/types';
import dynamic from 'next/dynamic';

const TrackExperience = dynamic(
  () => import('@/app/[locale]/(public)/music/components/TrackExperience'),
  { ssr: false },
);

export default function TrackPage() {
  const params = useParams<{ artist: string; track: string; locale: string }>();
  const trackId = params.track;
  const locale = params.locale ?? 'en';
  const router = useRouter();
  const [track, setTrack] = useState<AugmentedTrack | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadTrack(trackId).then((t) => {
      if (t) setTrack(t);
      else setError(true);
    });
  }, [trackId]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <p className="text-[#5a6d8a] text-sm">Track not found</p>
        <button
          onClick={() => router.push('/music')}
          className="px-4 py-2 rounded-lg bg-[#9b4dca]/20 text-[#9b4dca] text-sm border border-[#9b4dca]/30 hover:bg-[#9b4dca]/30 transition"
        >
          Back to catalog
        </button>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#9b4dca] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5a6d8a] text-xs">Loading experience...</p>
        </div>
      </div>
    );
  }

  return <TrackExperience track={track} locale={locale} />;
}
