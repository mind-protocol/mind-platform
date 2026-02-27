import { Hero } from './components/landing/Hero';
import { SwapSection } from './components/landing/SwapSection';
import { LiveStats } from './components/landing/LiveStats';
import { WhatWereBuilding } from './components/landing/WhatWereBuilding';
import { TheFork } from './components/landing/TheFork';
import { TheInsight } from './components/landing/TheInsight';
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
      <WhatWereBuilding />
      <SectionDivider />
      <TheFork />
      <TheInsight />
      <SectionDivider />
      <WhoThisIsFor />
      <SectionDivider accent />
      <TheInvitation />
    </main>
  );
}
