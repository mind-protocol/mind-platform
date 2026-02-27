'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FadeInSection } from './FadeInSection';

interface ProjectCardProps {
  name: string;
  tagline: string;
  description: string;
  status: string;
  statusLabel: string;
  readMore: string;
  link?: string;
}

function ProjectCard({ name, tagline, description, status, statusLabel, readMore, link }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    live: 'bg-emerald-500/20 text-emerald-400',
    building: 'bg-amber-500/20 text-amber-400',
    research: 'bg-blue-500/20 text-blue-400',
  };

  const content = (
    <div className="group p-6 sm:p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status] || ''}`}>
          {statusLabel}
        </span>
      </div>
      <p className="text-amber-500/80 text-sm mb-3">{tagline}</p>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
      {link && (
        <div className="mt-4 text-sm text-zinc-600 group-hover:text-zinc-400 transition">
          {readMore} →
        </div>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }
  return content;
}

export function WhatWereBuilding() {
  const t = useTranslations('Landing.Building');

  const projects = [
    {
      name: t('manemusName'),
      tagline: t('manemusTagline'),
      description: t('manemusDescription'),
      status: 'live',
      statusLabel: t('statusLive'),
      readMore: t('readMore'),
    },
    {
      name: t('duoName'),
      tagline: t('duoTagline'),
      description: t('duoDescription'),
      status: 'research',
      statusLabel: t('statusResearch'),
      readMore: t('readMore'),
      link: '/blog/co-regulation-is-measurable',
    },
    {
      name: t('mindName'),
      tagline: t('mindTagline'),
      description: t('mindDescription'),
      status: 'building',
      statusLabel: t('statusBuilding'),
      readMore: t('readMore'),
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('title')}
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <FadeInSection key={project.name} delay={index * 100}>
              <ProjectCard {...project} />
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={300}>
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition text-sm"
            >
              <span>{t('allResearch')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
