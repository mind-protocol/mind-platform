import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs');

export interface Doc {
  slug: string;
  title: string;
  date: string;
  version: string;
  content: string;
  rawMarkdown: string;
}

export async function getDoc(slug: string): Promise<Doc | null> {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const result = await remark().use(html, { sanitize: false }).process(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    version: data.version || '1.0',
    content: result.toString(),
    rawMarkdown: content,
  };
}

export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}
