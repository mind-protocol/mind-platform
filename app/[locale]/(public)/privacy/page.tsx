import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Mind Protocol',
  description: 'How Mind Protocol handles your data. Privacy-first by design.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-3xl mx-auto px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-zinc-500">Last updated: February 10, 2026</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-li:text-zinc-300">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Principle</h2>
            <p>
              Mind Protocol is built on a simple belief: your data belongs to you.
              We collect the minimum necessary to provide our services, we never sell your data,
              and we give you full control over what you share.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">What We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account information:</strong> Name, email address, and messaging platform
                identifiers (e.g. Telegram chat ID) when you register.
              </li>
              <li>
                <strong>Biometric data (optional):</strong> If you choose to connect a Garmin device,
                we access heart rate, stress, HRV, sleep, and body battery data through the Garmin Connect API.
                This data is stored locally on our infrastructure and never shared with third parties.
              </li>
              <li>
                <strong>Wallet addresses (optional):</strong> If you provide a Solana wallet address
                for $MIND token interactions.
              </li>
              <li>
                <strong>Messages:</strong> Messages you send to our bot are processed to generate responses.
                Conversation history is stored to maintain continuity.
              </li>
              <li>
                <strong>Connected services (optional):</strong> If you link Gmail, Spotify, or other services,
                we access only the scopes you explicitly authorize. Credentials are never stored — only OAuth tokens.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide personalized AI-assisted wellness insights based on your biometrics</li>
              <li>To maintain conversation continuity across sessions</li>
              <li>To send you notifications and responses via your preferred messaging platform</li>
              <li>To improve our services (aggregated, anonymized data only)</li>
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> use your data for advertising, profiling, or sale to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Data Storage & Security</h2>
            <p>
              Your data is stored on our private infrastructure. Biometric data, conversation logs,
              and OAuth tokens are encrypted at rest. We do not use third-party analytics or tracking services
              on this platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p>We integrate with the following services at your request:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Garmin Connect:</strong> Biometric data access (heart rate, stress, sleep, HRV)</li>
              <li><strong>Google (Gmail):</strong> Email reading (gmail.readonly scope only)</li>
              <li><strong>Spotify:</strong> Listening activity (read-only scopes)</li>
              <li><strong>Telegram:</strong> Message delivery and bot interaction</li>
              <li><strong>WhatsApp (Meta):</strong> Message delivery via Cloud API</li>
            </ul>
            <p className="mt-4">
              Each integration requires your explicit consent and can be revoked at any time.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access</strong> all data we hold about you</li>
              <li><strong>Delete</strong> your account and all associated data</li>
              <li><strong>Disconnect</strong> any linked service at any time</li>
              <li><strong>Export</strong> your data in a portable format</li>
              <li><strong>Opt out</strong> of any optional data collection</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Data Deletion</h2>
            <p>
              You can request deletion of all your data at any time. See our{' '}
              <a href="/deletion" className="text-amber-500 hover:text-amber-400">
                Data Deletion page
              </a>{' '}
              for instructions. We process deletion requests within 30 days.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Children</h2>
            <p>
              Mind Protocol is not intended for users under 16 years of age.
              We do not knowingly collect data from children.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Changes</h2>
            <p>
              We may update this policy as our services evolve. Significant changes will be
              communicated through our messaging channels. Continued use of Mind Protocol
              after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>
              For privacy-related questions or data requests, contact us via Telegram at{' '}
              <a
                href="https://t.me/mind_protocol_bot"
                className="text-amber-500 hover:text-amber-400"
              >
                @mind_protocol_bot
              </a>{' '}
              or email{' '}
              <a href="mailto:privacy@mindprotocol.ai" className="text-amber-500 hover:text-amber-400">
                privacy@mindprotocol.ai
              </a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
