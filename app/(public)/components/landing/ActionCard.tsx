import Link from 'next/link';

interface ActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export function ActionCard({ title, description, link, icon }: ActionCardProps) {
  return (
    <Link
      href={link}
      className="group block p-6 rounded-lg border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900/50 transition-all"
    >
      <div className="text-amber-500 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-500 transition">
        {title}
      </h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </Link>
  );
}
