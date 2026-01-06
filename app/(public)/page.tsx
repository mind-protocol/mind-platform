// DOCS: docs/landing/IMPLEMENTATION_Landing_Code.md
import { Hero } from './components/landing/Hero';
import { TheFork } from './components/landing/TheFork';
import { TheInsight } from './components/landing/TheInsight';
import { WhoThisIsFor } from './components/landing/WhoThisIsFor';
import { TheInvitation } from './components/landing/TheInvitation';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Hero />
      <TheFork />
      <TheInsight />
      <WhoThisIsFor />
      <TheInvitation />
    </main>
  );
}
