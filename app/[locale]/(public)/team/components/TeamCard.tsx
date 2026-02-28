import Image from 'next/image';
import type { TeamMember } from '@/lib/data/team';

// ─── Placeholder colors by tier ─────────────────────────────
const TIER_COLORS: Record<TeamMember['tier'], { bg: string; text: string }> = {
  cofounder: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
  team: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  citizen: { bg: 'bg-zinc-700/50', text: 'text-zinc-400' },
};

// ─── Social icon SVGs ───────────────────────────────────────

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, { icon: React.FC; label: string }> = {
  x: { icon: XIcon, label: 'X / Twitter' },
  github: { icon: GitHubIcon, label: 'GitHub' },
  telegram: { icon: TelegramIcon, label: 'Telegram' },
  linkedin: { icon: LinkedInIcon, label: 'LinkedIn' },
  website: { icon: WebsiteIcon, label: 'Website' },
};

// ─── TeamCard ───────────────────────────────────────────────

export function TeamCard({ member }: { member: TeamMember }) {
  const initial = member.name.charAt(0).toUpperCase();
  const tierStyle = TIER_COLORS[member.tier];

  const socialEntries = Object.entries(member.links).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700">
      {/* Header: Avatar + Name + Role */}
      <div className="flex items-center gap-4 mb-4">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold ${tierStyle.bg} ${tierStyle.text}`}
          >
            {initial}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-white font-bold truncate">{member.name}</h3>
          <p className="text-amber-500 text-sm">{member.role}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {member.bio}
      </p>

      {/* Tags */}
      {member.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Social links */}
      {socialEntries.length > 0 && (
        <div className="flex gap-3 pt-2 border-t border-zinc-800/50">
          {socialEntries.map(([platform, url]) => {
            const social = SOCIAL_ICONS[platform];
            if (!social) return null;
            const Icon = social.icon;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition"
                aria-label={social.label}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
