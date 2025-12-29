// DOCS: docs/landing/IMPLEMENTATION_Landing_Code.md
import { Hero } from './components/landing/Hero';
import { HowItWorks } from './components/landing/HowItWorks';
import { WhatYouCanDo } from './components/landing/WhatYouCanDo';
import { LiveStats } from './components/landing/LiveStats';

export const revalidate = 60;

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Hero />
      <HowItWorks />
      <WhatYouCanDo />
      <LiveStats />
    </main>
  );
}
