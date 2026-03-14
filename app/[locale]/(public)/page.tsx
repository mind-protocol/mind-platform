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
