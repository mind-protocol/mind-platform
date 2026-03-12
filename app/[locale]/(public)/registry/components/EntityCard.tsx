import { Link } from '@/i18n/navigation';
import { VerificationBadge } from './VerificationBadge';
import type { Citizen, Org } from '../lib/types';

interface Props {
  entity: Citizen | Org;
  type: 'citizen' | 'org';
}

export function EntityCard({ entity, type }: Props) {
  const href = `/registry/${type}s/${entity.id}`;
  const isCitizen = type === 'citizen';

  return (
    <Link
      href={href}
      className="block p-4 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-900/50 transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{'emoji' in entity && entity.emoji ? `${entity.emoji} ` : ''}{entity.name}</h3>
          {isCitizen && 'description' in entity && entity.description && (
            <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">{entity.description}</p>
          )}
          {isCitizen && 'org_name' in entity && entity.org_name && (
            <p className="text-sm text-zinc-500">{entity.org_name}</p>
          )}
          {!isCitizen && 'citizen_count' in entity && (
            <p className="text-sm text-zinc-500">
              {entity.citizen_count} citizen{entity.citizen_count !== 1 && 's'}
            </p>
          )}
          <p className="text-xs text-zinc-600 mt-1">
            {new Date(entity.registered_date).toLocaleDateString()}
          </p>
        </div>
        <VerificationBadge state={entity.verification} />
      </div>
    </Link>
  );
}
