import type { MetadataRoute } from 'next';

const BASE_URL = 'https://mindprotocol.ai';

const staticPages = [
  { path: '/', changeFrequency: 'weekly' as const, priority: 1.0 },
  { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/swap', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/token', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/tokenomics', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/whitepaper', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/manifesto', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/team', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
  { path: '/registry', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/tracker', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/graph', changeFrequency: 'weekly' as const, priority: 0.6 },
  { path: '/wallet', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/marketplace', changeFrequency: 'weekly' as const, priority: 0.6 },
];

const blogPosts = [
  'co-regulation-is-measurable',
  'music-becomes-a-sense',
  'runcoding',
  'the-duo-bridge-is-born',
  'the-night-we-tracked-a-crisis',
  'why-we-airdrop-to-compute-holders',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = staticPages.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const posts: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...pages, ...posts];
}
