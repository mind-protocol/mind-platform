import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf-8', timeout: 3000 }).trim();
  } catch {
    return '';
  }
}

export async function GET() {
  const hash = git('rev-parse --short HEAD');
  const message = git('log -1 --format=%s');
  const author = git('log -1 --format=%an');
  const date = git('log -1 --format=%ci');
  const branch = git('rev-parse --abbrev-ref HEAD');
  const filesChanged = git('log -1 --format= --stat --stat-width=200')
    .split('\n')
    .filter((l) => l.includes('|'))
    .map((l) => {
      const [file, rest] = l.split('|').map((s) => s.trim());
      return { file, changes: rest || '' };
    });

  return NextResponse.json({
    hash,
    message,
    author,
    date,
    branch,
    filesChanged,
    ts: Date.now(),
  });
}
