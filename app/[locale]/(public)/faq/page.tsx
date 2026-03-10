import type { Metadata } from 'next';
import FAQClient from './components/FAQClient';
import { FAQ_CATEGORIES, getAllQuestions } from '@/lib/faq/questions';

export const metadata: Metadata = {
  title: 'FAQ — Mind Protocol',
  description:
    'Frequently asked questions about Mind Protocol: biometric AI, $MIND token, Duo Mode, privacy, and getting started.',
  openGraph: {
    title: 'FAQ — Mind Protocol',
    description: 'Find answers about Mind Protocol, or ask the AI anything.',
  },
};

// Generate JSON-LD structured data for SEO (FAQPage schema)
function FAQJsonLd() {
  const questions = getAllQuestions();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question.en ?? '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer.en ?? '',
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd />
      <FAQClient />
    </>
  );
}
