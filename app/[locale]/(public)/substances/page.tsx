import type { Metadata } from 'next';
import SubstancesClient from './components/SubstancesClient';
import { SUBSTANCES } from '@/lib/substances/data';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Substance Database — Harm Reduction | Mind Protocol',
  description:
    'Science-based substance education: effects, dosages, interactions, biometric impact. 11 substances documented with Garmin correlation data.',
};

/* JSON-LD FAQPage schema for SEO */
function SubstanceFAQSchema() {
  const faqs = Object.values(SUBSTANCES).map((s) => ({
    '@type': 'Question' as const,
    name: `What are the effects and risks of ${s.name.en}?`,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: `${s.summary.en} Key fact: ${s.keyFact.en}`,
    },
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function SubstancesPage() {
  return (
    <>
      <SubstanceFAQSchema />
      <SubstancesClient />
    </>
  );
}
