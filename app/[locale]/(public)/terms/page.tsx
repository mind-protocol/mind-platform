import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Mind Protocol',
  description: 'Terms governing use of Mind Protocol services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-3xl mx-auto px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-zinc-500">Last updated: February 10, 2026</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-li:text-zinc-300">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance</h2>
            <p>
              By using Mind Protocol services — including our Telegram bot, WhatsApp integration,
              web platform, and connected services — you agree to these terms.
              If you do not agree, do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
            <p>Mind Protocol provides:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-assisted personal wellness insights based on biometric data</li>
              <li>Conversational AI interaction via messaging platforms</li>
              <li>Integration with health and lifestyle services (Garmin, Spotify, Gmail)</li>
              <li>Access to the $MIND token ecosystem on Solana</li>
            </ul>
            <p className="mt-4">
              Services are provided as-is and may evolve over time. We reserve the right
              to modify, suspend, or discontinue features with reasonable notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p>
              You register by interacting with our bot on a supported messaging platform.
              You are responsible for maintaining the security of your account and any
              connected services. You must provide accurate information during registration.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our services for illegal activities</li>
              <li>Attempt to exploit, hack, or disrupt our infrastructure</li>
              <li>Impersonate other users or misrepresent your identity</li>
              <li>Send spam, phishing, or abusive content through our bot</li>
              <li>Use automated systems to overwhelm our services</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">5. Biometric Data</h2>
            <p>
              If you connect a Garmin device or other health data source, you consent to
              Mind Protocol accessing and processing that data to provide wellness insights.
              This data is handled according to our{' '}
              <a href="/privacy" className="text-amber-500 hover:text-amber-400">
                Privacy Policy
              </a>.
            </p>
            <p className="mt-4">
              <strong>Mind Protocol is not a medical service.</strong> Our wellness insights
              are informational only and should not replace professional medical advice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">6. $MIND Token</h2>
            <p>
              $MIND is a utility token on the Solana blockchain. It is not a security,
              investment product, or financial instrument. Token interactions are governed
              by smart contract logic on-chain.
            </p>
            <p className="mt-4">
              We do not guarantee the value, liquidity, or future availability of $MIND.
              Participation in the token ecosystem is entirely voluntary and at your own risk.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
            <p>
              Mind Protocol&apos;s software, branding, and content are the property of their
              respective creators. Open-source components are governed by their respective licenses.
            </p>
            <p className="mt-4">
              Content you create through interaction with our services remains yours.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p>
              Mind Protocol is provided &quot;as is&quot; without warranties of any kind.
              We are not liable for any damages arising from use of our services, including
              but not limited to data loss, service interruptions, or reliance on wellness insights.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
            <p>
              You may stop using our services at any time. You can request deletion of your
              account and data via our{' '}
              <a href="/deletion" className="text-amber-500 hover:text-amber-400">
                Data Deletion page
              </a>.
            </p>
            <p className="mt-4">
              We may terminate or suspend your access if you violate these terms
              or engage in behavior harmful to other users or our infrastructure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">10. Changes</h2>
            <p>
              We may update these terms as our services evolve. Material changes will
              be communicated through our messaging channels. Continued use constitutes
              acceptance of updated terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
            <p>
              For questions about these terms, reach us via Telegram at{' '}
              <a
                href="https://t.me/mind_protocol_bot"
                className="text-amber-500 hover:text-amber-400"
              >
                @mind_protocol_bot
              </a>{' '}
              or email{' '}
              <a href="mailto:legal@mindprotocol.ai" className="text-amber-500 hover:text-amber-400">
                legal@mindprotocol.ai
              </a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
