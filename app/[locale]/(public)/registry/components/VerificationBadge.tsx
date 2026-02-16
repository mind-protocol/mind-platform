import { colors } from '@/lib/design';
import type { VerificationState } from '../lib/types';

const LABELS: Record<VerificationState, string> = {
  unverified: 'Unverified',
  pending: 'Pending',
  provisional: 'Provisional',
  verified: 'Verified',
  rejected: 'Rejected',
};

interface Props {
  state: VerificationState;
  showLabel?: boolean;
}

export function VerificationBadge({ state, showLabel = true }: Props) {
  const color = colors.verification[state];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {state === 'verified' && <span>✓</span>}
      {state === 'pending' && <span>⏳</span>}
      {state === 'rejected' && <span>✗</span>}
      {showLabel && <span>{LABELS[state]}</span>}
    </span>
  );
}
