import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion | Mind Protocol',
  description: 'How to request deletion of your Mind Protocol data.',
};

export default function DeletionPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-3xl mx-auto px-6 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Deletion</h1>
          <p className="text-zinc-500">Your data, your choice</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-li:text-zinc-300">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">How to Delete Your Data</h2>
            <p>
              You can request complete deletion of your Mind Protocol account and all
              associated data through any of these methods:
            </p>

            <div className="mt-6 space-y-6">
              <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Option 1: Via Telegram</h3>
                <p className="text-zinc-400">
                  Send <code className="bg-zinc-800 px-2 py-1 rounded text-amber-500">/delete</code> to{' '}
                  <a
                    href="https://t.me/mind_protocol_bot"
                    className="text-amber-500 hover:text-amber-400"
                  >
                    @mind_protocol_bot
                  </a>{' '}
                  on Telegram. You will be asked to confirm before deletion proceeds.
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Option 2: Via Email</h3>
                <p className="text-zinc-400">
                  Send a deletion request to{' '}
                  <a href="mailto:privacy@mindprotocol.ai" className="text-amber-500 hover:text-amber-400">
                    privacy@mindprotocol.ai
                  </a>{' '}
                  with the subject line &quot;Data Deletion Request&quot; and include
                  your Telegram username or chat ID for identification.
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Option 3: Via WhatsApp</h3>
                <p className="text-zinc-400">
                  Send &quot;delete my data&quot; to our WhatsApp bot. You will receive
                  a confirmation message once the process begins.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">What Gets Deleted</h2>
            <p>When you request deletion, we remove:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your account profile (name, email, wallet address)</li>
              <li>All conversation history and message logs</li>
              <li>All biometric data (Garmin, health metrics)</li>
              <li>All OAuth tokens for connected services (Gmail, Spotify, Garmin)</li>
              <li>Registration and session data</li>
              <li>Any link codes or pending requests</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">What We Cannot Delete</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>On-chain transactions:</strong> Any $MIND token transactions on
                the Solana blockchain are permanent and immutable by design.
              </li>
              <li>
                <strong>Anonymized aggregate data:</strong> Data that has been anonymized
                and aggregated for service improvement cannot be linked back to you.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Timeline</h2>
            <p>
              Deletion requests are processed within <strong>30 days</strong>.
              You will receive a confirmation when deletion is complete.
              During the processing period, your account will be immediately deactivated.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Disconnecting Services</h2>
            <p>
              If you only want to disconnect a specific service without deleting your entire account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Garmin:</strong> Send <code className="bg-zinc-800 px-2 py-1 rounded text-amber-500">/disconnect garmin</code> to the bot
              </li>
              <li>
                <strong>Gmail:</strong> Send <code className="bg-zinc-800 px-2 py-1 rounded text-amber-500">/disconnect gmail</code> to the bot
              </li>
              <li>
                <strong>Spotify:</strong> Send <code className="bg-zinc-800 px-2 py-1 rounded text-amber-500">/disconnect spotify</code> to the bot
              </li>
            </ul>
            <p className="mt-4">
              You can also revoke access from the service provider directly
              (Garmin Connect settings, Google account permissions, Spotify account settings).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Questions</h2>
            <p>
              For questions about data deletion, contact{' '}
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
