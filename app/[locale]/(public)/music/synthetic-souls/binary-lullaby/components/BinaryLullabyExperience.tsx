'use client';

import dynamic from 'next/dynamic';
import { binaryLullaby } from '@/lib/music/data/binary-lullaby';

const TrackExperience = dynamic(
  () => import('@/app/[locale]/(public)/music/components/TrackExperience'),
  { ssr: false },
);

export default function BinaryLullabyExperience() {
  return <TrackExperience track={binaryLullaby} locale="en" />;
}
