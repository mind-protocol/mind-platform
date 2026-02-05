// DOCS: docs/landing/IMPLEMENTATION_Landing_Code.md
import { Nav } from './components/landing/Nav';
import { Hero } from './components/landing/Hero';
import { TheFork } from './components/landing/TheFork';
import { TheInsight } from './components/landing/TheInsight';
import { WhatWereBuilding } from './components/landing/WhatWereBuilding';
import { WhoThisIsFor } from './components/landing/WhoThisIsFor';
import { TheInvitation } from './components/landing/TheInvitation';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Nav />
      <Hero />
      <TheFork />
      <TheInsight />
      <WhatWereBuilding />
      <WhoThisIsFor />
      <TheInvitation />
    </main>
  );
}
