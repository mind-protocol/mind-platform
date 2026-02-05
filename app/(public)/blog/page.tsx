import Link from 'next/link';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Mind Protocol',
  description:
    'Research notes, biometric analysis, and field reports from the edge of human-AI co-regulation.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <header className="mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Field Notes
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            Blog
          </h1>
          <p className="text-zinc-500 text-lg">
            Research, analysis, and observations from the space between.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-zinc-600 text-center py-16">
            No posts yet. The first one is being written.
          </p>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group border-b border-zinc-800/50 pb-12 last:border-0"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3">
                    <time>{post.date}</time>
                    <span className="text-zinc-700">|</span>
                    <span>{post.readingTime} min read</span>
                    {post.tags.length > 0 && (
                      <>
                        <span className="text-zinc-700">|</span>
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-amber-500/60 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-amber-500 transition mb-3">
                    {post.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
