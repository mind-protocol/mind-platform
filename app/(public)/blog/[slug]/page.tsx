import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getAllSlugs } from '@/lib/blog';

interface Props {
  params: { slug: string };
}

// Routes with custom JSX pages — exclude from dynamic generation
const CUSTOM_ROUTES = ['co-regulation-is-measurable'];

export async function generateStaticParams() {
  return getAllSlugs()
    .filter((slug) => !CUSTOM_ROUTES.includes(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Not Found | Mind Protocol' };
  return {
    title: `${post.title} | Mind Protocol`,
    description: post.excerpt,
  };
}

export default async function BlogPostFallback({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-3xl mx-auto px-6 py-24">
        <header className="mb-12">
          <Link
            href="/blog"
            className="text-zinc-500 hover:text-amber-500 transition text-sm mb-8 inline-block"
          >
            &larr; Back to blog
          </Link>

          <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
            <time>{post.date}</time>
            <span className="text-zinc-700">|</span>
            <span>{post.readingTime} min read</span>
            {post.author && (
              <>
                <span className="text-zinc-700">|</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-mono mb-4">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded border border-amber-500/30 text-amber-500/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <a
            href={`/api/blog/${params.slug}/md`}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition font-mono"
          >
            view raw markdown
          </a>
        </header>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-p:text-zinc-300
            prose-headings:text-white prose-headings:font-mono
            prose-strong:text-white
            prose-em:text-zinc-400
            prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
            prose-code:text-amber-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            prose-blockquote:border-amber-500/50 prose-blockquote:text-zinc-400
            prose-hr:border-zinc-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-16 pt-8 border-t border-zinc-800">
          <Link
            href="/blog"
            className="text-amber-500 hover:text-amber-400 transition"
          >
            &larr; All posts
          </Link>
        </footer>
      </article>
    </main>
  );
}
