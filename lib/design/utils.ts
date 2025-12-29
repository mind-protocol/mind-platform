import { colors, type Layer, type NodeType, type VerificationState } from './theme';

/**
 * Add alpha channel to hex color
 */
export function alpha(color: string, opacity: number): string {
  const hex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${hex}`;
}

/**
 * Get layer color by key
 */
export function getLayerColor(layer: Layer): string {
  return colors.layer[layer];
}

/**
 * Get node type color
 */
export function getNodeTypeColor(type: string): string {
  return colors.nodeType[type as NodeType] ?? colors.text.secondary;
}

/**
 * Get verification badge color
 */
export function getVerificationColor(state: string): string {
  return (
    colors.verification[state as VerificationState] ??
    colors.verification.unverified
  );
}

/**
 * Get status color
 */
export function getStatusColor(
  status: 'success' | 'warning' | 'error' | 'info',
): string {
  return colors.status[status];
}
