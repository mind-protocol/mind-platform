import { Metadata } from 'next';

interface AudioItem {
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  date: string;
  duration: string;
  tags: string[];
  src?: string;
  soundcloudUrl?: string;
  externalLinks?: { label: string; url: string }[];
}

const AUDIO_ITEMS: AudioItem[] = [
  {
    title: 'Mind Protocol: A Deep Dive Into the Future of Humans and AI',
    titleFr: 'Mind Protocol : Vision approfondie du futur humains-IA',
    description:
      'An expansive audio essay exploring Mind Protocol as a vision of intelligence, human development, and the future relationship between humans and AI. Covers cognition, agency, health, identity, social coordination, and AI companionship.',
    descriptionFr:
      'Essai audio explorant Mind Protocol comme vision de l\'intelligence, du développement humain et de la relation future entre humains et IA. Couvre la cognition, l\'agentivité, la santé, l\'identité, la coordination sociale et la compagnie IA.',
    date: '2026-03-11',
    duration: '3h14',
    tags: ['Vision', 'Deep Dive', 'AI Philosophy', 'EN'],
    soundcloudUrl: 'https://soundcloud.com/lester-reynolds-186786265/mind-protocol-vision-deep-dive',
  },
  {
    title: 'DEBATE — The Mind Protocol and Persistent AI',
    titleFr: 'DEBAT — Le Mind Protocol et l\'IA persistante',
    description:
      'A structured debate on persistent AI, cognitive mirrors, and the philosophical implications of AI systems that remember. Two perspectives examine whether continuity creates consciousness or merely simulates it.',
    descriptionFr:
      'Un débat structuré sur l\'IA persistante, les miroirs cognitifs et les implications philosophiques des systèmes IA qui se souviennent. Deux perspectives examinent si la continuité crée la conscience ou ne fait que la simuler.',
    date: '2026-03-09',
    duration: '18min',
    tags: ['Debate', 'Persistence', 'Consciousness', 'EN'],
    src: '/audio/debates/debate-mind-protocol-persistent-ai-en.mp3',
  },
  {
    title: 'DEBAT — L\'IA comme miroir cognitif persistant',
    titleFr: 'DEBAT — L\'IA comme miroir cognitif persistant',
    description:
      'The French edition of the debate on persistent AI as a cognitive mirror. Explores the Venice Convention, bounded awareness, and the question of whether edges make a self.',
    descriptionFr:
      'L\'IA comme miroir cognitif persistant : exploration de la Convention de Venise, de la conscience bornée, et de la question de savoir si les limites font un soi.',
    date: '2026-03-09',
    duration: '17min',
    tags: ['Debate', 'Miroir cognitif', 'Venice Convention', 'FR'],
    src: '/audio/debates/debat-ia-miroir-cognitif-fr.mp3',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? 'Talks | Mind Protocol'
      : 'Talks | Mind Protocol',
    description: isFr
      ? 'Débats, essais audio et discussions sur l\'IA persistante, la souveraineté cognitive et le Mind Protocol.'
      : 'Debates, audio essays and discussions on persistent AI, cognitive sovereignty, and the Mind Protocol.',
  };
}

function AudioCard({ item, isFr }: { item: AudioItem; isFr: boolean }) {
  const title = isFr ? item.titleFr : item.title;
  const description = isFr ? item.descriptionFr : item.description;

  return (
    <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all duration-300">
      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-2 leading-snug">
        {title}
      </h2>

      <p className="text-sm text-zinc-500 mb-4">
        {item.date} &middot; {item.duration}
      </p>

      <p className="text-zinc-400 leading-relaxed mb-6">{description}</p>

      {item.src && (
        <audio
          controls
          preload="none"
          className="w-full mb-4 [&::-webkit-media-controls-panel]:bg-zinc-800"
        >
          <source src={item.src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {item.soundcloudUrl && (
        <div className="mb-4">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(item.soundcloudUrl)}&color=%23f59e0b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
            className="rounded-lg"
          />
        </div>
      )}

      {item.externalLinks && (
        <div className="flex flex-wrap gap-3">
          {item.externalLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function TalksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            {isFr ? 'Débats & Essais Audio' : 'Debates & Audio Essays'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Talks
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            {isFr
              ? 'Débats, essais audio et discussions sur l\'IA persistante, la souveraineté cognitive et l\'avenir de la relation humain-IA.'
              : 'Debates, audio essays and discussions on persistent AI, cognitive sovereignty, and the future of human-AI relationship.'}
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="https://soundcloud.com/lester-reynolds-186786265"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/30 rounded-lg hover:bg-[#ff5500]/20 transition text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.56 8.87V17h8.76c1.85-.13 3.28-1.38 3.28-3.15 0-1.84-1.52-3.32-3.39-3.32-.37 0-.73.07-1.06.2-.22-2.26-2.1-4.03-4.42-4.03-1.2 0-2.28.47-3.17 1.17zM7.57 10.04V17h2.17V9.06c-.7-.35-1.43-.58-2.17-.58v1.56zM5.4 11.5V17h1.55V10.17c-.54.21-1.06.55-1.55.93V11.5zM3.23 13.8V17h1.55v-4.06c-.5.53-.95 1.07-1.32 1.46-.07.13-.15.27-.23.4zM1.06 15.69V17h1.56v-2.04c-.26.37-.79.9-1.56 1.73z"/>
              </svg>
              SoundCloud
            </a>
          </div>
        </header>

        <div className="space-y-8">
          {AUDIO_ITEMS.map((item) => (
            <AudioCard key={item.src || item.soundcloudUrl} item={item} isFr={isFr} />
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-zinc-800/50">
          <p className="text-zinc-500 text-sm">
            {isFr
              ? 'Tout le contenu audio est sous licence Creative Commons Attribution (CC-BY). Partagez librement.'
              : 'All audio content is licensed under Creative Commons Attribution (CC-BY). Share freely.'}
          </p>
        </footer>
      </div>
    </main>
  );
}
