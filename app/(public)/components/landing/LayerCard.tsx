import Link from 'next/link';

interface LayerCardProps {
  id: string;
  name: string;
  description: string;
  color: string;
  link: string;
}

export function LayerCard({ id, name, description, color, link }: LayerCardProps) {
  return (
    <Link
      href={link}
      className="group block p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-sm font-mono font-bold"
          style={{ color }}
        >
          {id}
        </span>
        <span className="text-lg font-semibold">{name}</span>
      </div>
      <p className="text-zinc-400 text-sm">{description}</p>
    </Link>
  );
}
