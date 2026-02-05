import { describe, it, expect } from 'vitest';
import { alpha, getLayerColor, getNodeTypeColor, getVerificationColor, getStatusColor } from '@/lib/design/utils';
import { colors } from '@/lib/design/theme';

describe('alpha', () => {
  it('appends hex alpha to a color', () => {
    expect(alpha('#ff0000', 1)).toBe('#ff0000ff');
    expect(alpha('#ff0000', 0)).toBe('#ff000000');
    expect(alpha('#ff0000', 0.5)).toBe('#ff000080');
  });

  it('pads single-digit hex values', () => {
    // opacity ~0.02 → hex 05
    expect(alpha('#000000', 0.02)).toBe('#00000005');
  });
});

describe('getLayerColor', () => {
  it('returns correct color for each layer', () => {
    expect(getLayerColor('L1')).toBe('#3b82f6');
    expect(getLayerColor('L2')).toBe('#22c55e');
    expect(getLayerColor('L3')).toBe('#8b5cf6');
    expect(getLayerColor('L4')).toBe('#f59e0b');
  });
});

describe('getNodeTypeColor', () => {
  it('returns correct color for known node types', () => {
    expect(getNodeTypeColor('Actor')).toBe('#f472b6');
    expect(getNodeTypeColor('Moment')).toBe('#60a5fa');
    expect(getNodeTypeColor('Narrative')).toBe('#a78bfa');
    expect(getNodeTypeColor('Space')).toBe('#4ade80');
    expect(getNodeTypeColor('Thing')).toBe('#fbbf24');
  });

  it('returns secondary text color for unknown types', () => {
    expect(getNodeTypeColor('Unknown')).toBe(colors.text.secondary);
  });
});

describe('getVerificationColor', () => {
  it('returns correct color for each verification state', () => {
    expect(getVerificationColor('unverified')).toBe('#6b7280');
    expect(getVerificationColor('pending')).toBe('#f59e0b');
    expect(getVerificationColor('provisional')).toBe('#3b82f6');
    expect(getVerificationColor('verified')).toBe('#22c55e');
    expect(getVerificationColor('rejected')).toBe('#ef4444');
  });

  it('returns unverified color for unknown states', () => {
    expect(getVerificationColor('nonsense')).toBe(colors.verification.unverified);
  });
});

describe('getStatusColor', () => {
  it('returns correct color for each status', () => {
    expect(getStatusColor('success')).toBe('#22c55e');
    expect(getStatusColor('warning')).toBe('#f59e0b');
    expect(getStatusColor('error')).toBe('#ef4444');
    expect(getStatusColor('info')).toBe('#3b82f6');
  });
});
