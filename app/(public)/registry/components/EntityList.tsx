import { EntityCard } from './EntityCard';
import type { Citizen, Org } from '../lib/types';

interface Props {
  entities: (Citizen | Org)[];
  type: 'citizen' | 'org';
  loading?: boolean;
}

export function EntityList({ entities, type, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-zinc-900 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No {type === 'citizen' ? 'citizens' : 'organizations'} found
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {entities.map((entity) => (
        <EntityCard key={entity.id} entity={entity} type={type} />
      ))}
    </div>
  );
}
