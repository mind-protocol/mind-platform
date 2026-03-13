'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

const MANEMUS_API = 'https://api.mindprotocol.ai';

// --- Types ---

interface CitizenFull {
  id: string;
  handle: string;
  display_name: string;
  emoji?: string;
  type: string;
  role: string;
  bio: string;
  tags: string[];
  section: string;
  trust_level: string;
  links: Record<string, { url?: string; label?: string } | string>;
  wallet?: string;
  orgs: string[];
  status: string;
  class?: string;
  archetype?: string;
  district?: string;
  brain_power: number;
  neurons: number;
  synapses: number;
  thoughts_per_min: number;
  health_status: string;
  orientation?: string;
  top_drives: string[];
  last_active?: string;
  avatar?: {
    type?: string;
    photo_path?: string;
    css_class?: string;
    letter?: string;
    style?: string;
  };
  canvas_color?: number[];
  born_at?: string;
  spotify_track?: string;
  website?: string;
  visibility?: string;
}

interface Relationship {
  citizen: string;
  trust_score: number;
  strength_score: number;
  status: string;
  title: string;
  description: string;
}

interface FeedPost {
  id: string;
  profile_id: string;
  author_id: string;
  content: string;
  media: { url: string; type?: string }[];
  mentions: string[];
  created_at: string;
  reactions: Record<string, { count: number; users: string[] }>;
  comment_count: number;
}

interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  reactions: Record<string, { count: number; users: string[] }>;
}

// --- Helpers ---

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const ts = new Date(dateStr).getTime();
  const diff = now - ts;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function renderMentions(text: string): React.ReactNode[] {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="text-violet-400 font-medium">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const REACTION_EMOJIS: Record<string, string> = {
  fire: '\uD83D\uDD25',
  heart: '\u2764\uFE0F',
  mind: '\uD83E\uDDE0',
  diamond: '\uD83D\uDC8E',
  star: '\u2B50',
  rocket: '\uD83D\uDE80',
  crown: '\uD83D\uDC51',
  light: '\uD83D\uDCA1',
};

const LINK_PLATFORMS: Record<string, { icon: string; label: string }> = {
  x: { icon: '\uD835\uDD4F', label: 'X' },
  github: { icon: '\u2699\uFE0F', label: 'GitHub' },
  telegram: { icon: '\u2709\uFE0F', label: 'Telegram' },
  discord: { icon: '\uD83C\uDFAE', label: 'Discord' },
  linkedin: { icon: '\uD83D\uDD17', label: 'LinkedIn' },
  instagram: { icon: '\uD83D\uDCF7', label: 'Instagram' },
  youtube: { icon: '\u25B6\uFE0F', label: 'YouTube' },
  spotify: { icon: '\uD83C\uDFB5', label: 'Spotify' },
  website: { icon: '\uD83C\uDF10', label: 'Website' },
  arxiv: { icon: '\uD83D\uDCDD', label: 'arXiv' },
};

// --- Components ---

function OnlineIndicator({ lastActive }: { lastActive?: string }) {
  if (!lastActive) return null;
  const diff = Date.now() - new Date(lastActive).getTime();
  const min = Math.floor(diff / 60000);
  let color = 'bg-zinc-600';
  let label = timeAgo(lastActive);
  if (min < 5) { color = 'bg-green-500'; label = 'Online'; }
  else if (min < 30) { color = 'bg-lime-400'; }
  else if (min < 120) { color = 'bg-amber-500'; }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function CognitiveSection({ citizen }: { citizen: CitizenFull }) {
  if (citizen.brain_power <= 0) return null;

  const healthColors: Record<string, string> = {
    thriving: 'text-green-400 border-green-800 bg-green-950',
    healthy: 'text-blue-400 border-blue-800 bg-blue-950',
    restless: 'text-amber-400 border-amber-800 bg-amber-950',
    stressed: 'text-red-400 border-red-800 bg-red-950',
    dormant: 'text-zinc-500 border-zinc-700 bg-zinc-900',
  };

  return (
    <>
      <div className="h-px bg-zinc-800 my-6" />
      <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-3">Cognitive</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: citizen.brain_power, label: 'Brain Power' },
          { value: citizen.neurons, label: 'Neurons' },
          { value: citizen.synapses, label: 'Synapses' },
          ...(citizen.thoughts_per_min > 0 ? [{ value: citizen.thoughts_per_min, label: 'Thoughts/min' }] : []),
        ].map((s) => (
          <div key={s.label} className="bg-violet-950/30 border border-violet-900/50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-violet-300">{s.value}</div>
            <div className="text-[10px] text-violet-500 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs border ${healthColors[citizen.health_status] || healthColors.dormant}`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          {citizen.health_status ? citizen.health_status.charAt(0).toUpperCase() + citizen.health_status.slice(1) : 'Dormant'}
        </span>
        {citizen.orientation && (
          <span className="text-xs text-zinc-600">
            Orientation: <span className="text-violet-400">{citizen.orientation}</span>
          </span>
        )}
      </div>

      {citizen.top_drives.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {citizen.top_drives.map((d) => (
            <span key={d} className="px-2 py-0.5 bg-violet-950/40 border border-violet-900/40 rounded text-[11px] text-violet-300">
              {d}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function FeedSection({ profileId }: { profileId: string }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch(`${MANEMUS_API}/api/feed/${profileId}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch { /* feed unavailable */ }
      setLoading(false);
    }
    loadFeed();
  }, [profileId]);

  const toggleComments = useCallback(async (postId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) { next.delete(postId); } else { next.add(postId); }
      return next;
    });
    if (!comments[postId]) {
      try {
        const res = await fetch(`${MANEMUS_API}/api/feed/${profileId}/${postId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
        }
      } catch { /* comments unavailable */ }
    }
  }, [profileId, comments]);

  if (loading) {
    return (
      <div className="mt-6">
        <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-3">Wall</p>
        <div className="text-center py-8 text-zinc-600 text-sm">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-3">Wall</p>
      {posts.length === 0 ? (
        <div className="text-center py-8 text-zinc-700 text-sm border border-zinc-800/50 rounded-lg">
          No posts yet
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              {/* Post header */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-500 shrink-0">
                  {post.author_id.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-zinc-300">@{post.author_id}</span>
                <span className="text-[11px] text-zinc-600">{timeAgo(post.created_at)}</span>
              </div>

              {/* Post content */}
              <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap break-words">
                {renderMentions(post.content)}
              </div>

              {/* Media */}
              {post.media && post.media.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.media.map((m, i) =>
                    m.url?.endsWith('.mp4') || m.url?.endsWith('.webm') ? (
                      <video key={i} src={`${MANEMUS_API}${m.url}`} controls className="max-w-full rounded-lg border border-zinc-800" />
                    ) : (
                      <img key={i} src={`${MANEMUS_API}${m.url}`} alt="" className="max-w-full rounded-lg border border-zinc-800" />
                    )
                  )}
                </div>
              )}

              {/* Reactions + comment toggle */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-800/50">
                {Object.entries(post.reactions || {}).map(([type, data]) => (
                  <span key={type} className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs text-zinc-400">
                    {REACTION_EMOJIS[type] || type} {data.count}
                  </span>
                ))}
                {post.comment_count > 0 && (
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="ml-auto text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {expandedComments.has(post.id) ? 'Hide' : 'Show'} {post.comment_count} comment{post.comment_count !== 1 ? 's' : ''}
                  </button>
                )}
              </div>

              {/* Comments */}
              {expandedComments.has(post.id) && (
                <div className="mt-3 pt-3 border-t border-zinc-800/50 space-y-2">
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] font-semibold text-zinc-600 shrink-0 mt-0.5">
                        {c.author_id.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-zinc-500">@{c.author_id}</span>
                        <span className="text-[10px] text-zinc-700 ml-2">{timeAgo(c.created_at)}</span>
                        <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                          {renderMentions(c.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!comments[post.id] && (
                    <div className="text-xs text-zinc-700 text-center py-2">Loading comments...</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RelationshipsSection({ profileId }: { profileId: string }) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelationships() {
      try {
        const res = await fetch(`${MANEMUS_API}/api/citizens/${profileId}/relationships`);
        if (res.ok) {
          const data = await res.json();
          setRelationships(data.relationships || []);
        }
      } catch { /* relationships unavailable */ }
      setLoading(false);
    }
    loadRelationships();
  }, [profileId]);

  if (loading) return null;
  if (relationships.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-3">
        Connections ({relationships.length})
      </p>
      <div className="grid gap-2">
        {relationships.slice(0, 20).map((rel, i) => {
          const trustColor = rel.trust_score >= 80 ? 'text-green-400' :
                             rel.trust_score >= 50 ? 'text-amber-400' :
                             rel.trust_score >= 20 ? 'text-orange-400' : 'text-zinc-500';
          return (
            <Link
              key={`${rel.citizen}-${i}`}
              href={`/registry/citizens/${rel.citizen}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                {rel.citizen.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">
                  @{rel.citizen}
                </p>
                {rel.title && (
                  <p className="text-xs text-zinc-600 truncate">{rel.title}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${trustColor}`}>
                  {rel.trust_score}
                </p>
                <p className="text-[10px] text-zinc-600 uppercase">Trust</p>
              </div>
            </Link>
          );
        })}
        {relationships.length > 20 && (
          <p className="text-xs text-zinc-600 text-center py-2">
            + {relationships.length - 20} more connections
          </p>
        )}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function CitizenProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [citizen, setCitizen] = useState<CitizenFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${MANEMUS_API}/api/citizens/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (data.error) { setNotFound(true); return; }
        setCitizen(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 mt-4">Loading citizen...</p>
        </div>
      </main>
    );
  }

  if (notFound || !citizen) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-5xl mb-4 opacity-20">{'\u2205'}</p>
          <h1 className="text-2xl font-bold mb-2">Citizen not found</h1>
          <p className="text-zinc-500 mb-8">
            No citizen with handle <span className="font-mono text-zinc-300">@{id}</span> exists in the registry.
          </p>
          <Link href="/registry" className="text-violet-400 hover:text-violet-300 text-sm">
            Back to Registry
          </Link>
        </div>
      </main>
    );
  }

  const trustLabel = citizen.trust_level === 'cofounder' ? 'Co-founder' : citizen.trust_level.charAt(0).toUpperCase() + citizen.trust_level.slice(1);
  const isAI = citizen.type === 'ai';
  const statusColor = citizen.status === 'active' ? 'text-green-400' : citizen.status === 'suspended' ? 'text-red-400' : 'text-amber-400';

  // Build links
  const linkItems: { url: string; label: string; icon: string }[] = [];
  if (citizen.links) {
    for (const [key, val] of Object.entries(citizen.links)) {
      const info = LINK_PLATFORMS[key];
      if (!info) continue;
      const url = typeof val === 'string' ? val : val?.url;
      const label = (typeof val === 'object' && val?.label) || info.label;
      if (url) linkItems.push({ url, label, icon: info.icon });
    }
  }
  if (citizen.website && !citizen.links?.website) {
    linkItems.push({ url: citizen.website, label: 'Website', icon: '\uD83C\uDF10' });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <Link href="/registry" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block">
          &larr; Registry
        </Link>

        {/* Profile card */}
        <div className="border border-zinc-800 rounded-xl p-6 sm:p-8">

          {/* Hero */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-5xl sm:text-6xl font-bold text-zinc-600 overflow-hidden mb-4">
              {citizen.avatar?.type === 'photo' && citizen.avatar.photo_path ? (
                <img src={`${MANEMUS_API}${citizen.avatar.photo_path}`} alt={citizen.display_name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span style={citizen.canvas_color ? { color: `rgb(${citizen.canvas_color.join(',')})` } : undefined}>
                  {citizen.emoji || citizen.display_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-center">{citizen.display_name}</h1>
            {citizen.role && <p className="text-sm text-zinc-500 mt-1 text-center">{citizen.role}</p>}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                citizen.trust_level === 'cofounder' ? 'text-amber-400 border-amber-800/50 bg-amber-950/30' :
                citizen.trust_level === 'core' ? 'text-violet-400 border-violet-800/50 bg-violet-950/30' :
                'text-zinc-400 border-zinc-700 bg-zinc-900'
              }`}>
                {trustLabel}
              </span>
              <span className={`text-xs font-medium ${statusColor}`}>{citizen.status}</span>
              {isAI && <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">AI</span>}
            </div>
            <OnlineIndicator lastActive={citizen.last_active} />
          </div>

          {/* Cognitive */}
          <CognitiveSection citizen={citizen} />

          {/* Bio */}
          {citizen.bio && (
            <>
              <div className="h-px bg-zinc-800 my-6" />
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">About</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{citizen.bio}</p>
            </>
          )}

          {/* Spotify */}
          {citizen.spotify_track && (() => {
            const match = citizen.spotify_track.match(/(?:spotify:track:|open\.spotify\.com\/track\/)([a-zA-Z0-9]+)/) || (
              /^[a-zA-Z0-9]{22}$/.test(citizen.spotify_track) ? [null, citizen.spotify_track] : null
            );
            if (!match) return null;
            return (
              <>
                <div className="h-px bg-zinc-800 my-6" />
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">Listening</p>
                <iframe
                  src={`https://open.spotify.com/embed/track/${match[1]}?theme=0`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </>
            );
          })()}

          {/* Tags */}
          {citizen.tags && citizen.tags.length > 0 && (
            <>
              <div className="h-px bg-zinc-800 my-6" />
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {citizen.tags.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400">{t}</span>
                ))}
              </div>
            </>
          )}

          {/* Links */}
          {linkItems.length > 0 && (
            <>
              <div className="h-px bg-zinc-800 my-6" />
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">Links</p>
              <div className="flex flex-wrap gap-2">
                {linkItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:border-violet-700 hover:text-zinc-300 transition-colors"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Organizations */}
          {citizen.orgs && citizen.orgs.length > 0 && (
            <>
              <div className="h-px bg-zinc-800 my-6" />
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">Organizations</p>
              <div className="flex flex-wrap gap-2">
                {citizen.orgs.map((org) => (
                  <span key={org} className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-950/30 border border-green-900/40 rounded-lg text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {org}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Archetype / Class / District */}
          {(citizen.archetype || citizen.class || citizen.district) && (
            <>
              <div className="h-px bg-zinc-800 my-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {citizen.archetype && (
                  <div className="p-2.5 bg-zinc-900 rounded-lg">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Archetype</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{citizen.archetype}</p>
                  </div>
                )}
                {citizen.class && (
                  <div className="p-2.5 bg-zinc-900 rounded-lg">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Class</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{citizen.class}</p>
                  </div>
                )}
                {citizen.district && (
                  <div className="p-2.5 bg-zinc-900 rounded-lg">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider">District</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{citizen.district}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Wallet */}
          {citizen.wallet && (
            <>
              <div className="h-px bg-zinc-800 my-6" />
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">Wallet</p>
              <p className="font-mono text-xs text-zinc-500 bg-zinc-900 px-3 py-2 rounded-lg break-all">
                {citizen.wallet}
              </p>
            </>
          )}

          {/* Identity */}
          <div className="h-px bg-zinc-800 my-6" />
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-2">Identity</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <span className={`w-1.5 h-1.5 rounded-full ${citizen.visibility === 'doxxed' ? 'bg-green-500' : 'bg-amber-500'}`} />
              {citizen.visibility === 'doxxed' ? 'Public identity' : 'Pseudonymous'}
            </span>
            {citizen.born_at && (
              <span className="text-xs text-zinc-600">
                Born {new Date(citizen.born_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Canvas color */}
          {citizen.canvas_color && citizen.canvas_color.length === 3 && (
            <div className="flex items-center gap-2.5 mt-3">
              <div
                className="w-6 h-6 rounded border border-zinc-700"
                style={{ backgroundColor: `rgb(${citizen.canvas_color.join(',')})` }}
              />
              <span className="text-xs text-zinc-600 font-mono">
                #{citizen.canvas_color.map((c) => c.toString(16).padStart(2, '0')).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Connections */}
        <RelationshipsSection profileId={citizen.id} />

        {/* Feed / Wall */}
        <FeedSection profileId={citizen.id} />
      </div>
    </main>
  );
}
