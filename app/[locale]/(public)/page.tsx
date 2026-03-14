// DOCS: docs/landing/IMPLEMENTATION_Landing_Code.md
import type { Metadata } from 'next';
import { Hero } from './components/landing/Hero';
import { SwapSection } from './components/landing/SwapSection';
import { LiveStats } from './components/landing/LiveStats';
import { HowItWorks } from './components/landing/HowItWorks';
import { WhatWereBuilding } from './components/landing/WhatWereBuilding';
import { CitizensShowcase } from './components/landing/CitizensShowcase';
import { TheFork } from './components/landing/TheFork';
import { TheInsight } from './components/landing/TheInsight';
import { OpenSource } from './components/landing/OpenSource';
import { WhoThisIsFor } from './components/landing/WhoThisIsFor';
import { TheInvitation } from './components/landing/TheInvitation';
import { SectionDivider } from './components/landing/SectionDivider';


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr ? 'Mind Protocol | Écologie de confiance' : 'Mind Protocol | Trust ecology';
  const description = isFr
    ? 'Une interface vivante pour le protocole MIND : manifeste, registre et graphes relationnels.'
    : 'A living interface for the MIND protocol: manifesto, registry, and relational graphs.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: '/'+locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Hero />
      <SectionDivider accent />
      <SwapSection />
      <LiveStats />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <CitizensShowcase />
      <SectionDivider />
      <WhatWereBuilding />
      <SectionDivider />
      <TheFork />
      <TheInsight />
      <SectionDivider />
      <OpenSource />
      <SectionDivider />
      <WhoThisIsFor />
      <SectionDivider accent />
      <TheInvitation />
    </main>
  );
}
