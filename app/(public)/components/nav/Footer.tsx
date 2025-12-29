import Link from 'next/link';
import { colors } from '@/lib/design';

const FOOTER_LINKS = {
  Protocol: [
    { href: '/schema', label: 'Schema' },
    { href: '/registry', label: 'Registry' },
    { href: '/marketplace', label: 'Marketplace' },
  ],
  Tools: [
    { href: '/connectome', label: 'Connectome' },
    { href: 'https://github.com/mind-protocol', label: 'GitHub' },
  ],
  Resources: [
    { href: '/docs', label: 'Documentation' },
    { href: 'https://github.com/mind-protocol/mind-protocol/issues', label: 'Issues' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="text-xl font-bold"
                style={{ color: colors.accent.primary }}
              >
                Mind
              </span>
              <span className="text-xl font-bold text-white">Protocol</span>
            </Link>
            <p className="text-zinc-500 text-sm">
              Persistent memory for AI agents.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-zinc-500 hover:text-white text-sm transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} Mind Protocol. Open source.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://github.com/mind-protocol"
              className="text-zinc-500 hover:text-white transition"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
