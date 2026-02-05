import { describe, it, expect } from 'vitest';
import { colors, fonts, fontSize, spacing, animation, shadows, radii } from '@/lib/design/theme';

describe('theme colors', () => {
  it('has all background colors', () => {
    expect(colors.bg.primary).toBeDefined();
    expect(colors.bg.secondary).toBeDefined();
    expect(colors.bg.tertiary).toBeDefined();
    expect(colors.bg.elevated).toBeDefined();
  });

  it('has all four layer colors', () => {
    expect(Object.keys(colors.layer)).toEqual(['L1', 'L2', 'L3', 'L4']);
  });

  it('has all five node type colors', () => {
    expect(Object.keys(colors.nodeType)).toEqual(['Actor', 'Moment', 'Narrative', 'Space', 'Thing']);
  });

  it('has all verification state colors', () => {
    expect(Object.keys(colors.verification)).toEqual([
      'unverified', 'pending', 'provisional', 'verified', 'rejected',
    ]);
  });

  it('has all status colors', () => {
    expect(Object.keys(colors.status)).toEqual(['success', 'warning', 'error', 'info']);
  });

  it('layer colors are valid hex', () => {
    for (const color of Object.values(colors.layer)) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('theme typography', () => {
  it('has sans and mono fonts', () => {
    expect(fonts.sans).toContain('Inter');
    expect(fonts.mono).toContain('JetBrains Mono');
  });

  it('has all font size keys', () => {
    expect(Object.keys(fontSize)).toEqual([
      'display', 'h1', 'h2', 'h3', 'body', 'small', 'tiny',
    ]);
  });
});

describe('theme spacing', () => {
  it('uses 8px base unit', () => {
    expect(spacing[2]).toBe('0.5rem'); // 8px
    expect(spacing[4]).toBe('1rem');   // 16px
    expect(spacing[8]).toBe('2rem');   // 32px
  });
});

describe('theme animation', () => {
  it('has duration values', () => {
    expect(animation.duration.fast).toBe('100ms');
    expect(animation.duration.normal).toBe('200ms');
    expect(animation.duration.slow).toBe('300ms');
    expect(animation.duration.graph).toBe('500ms');
  });
});

describe('theme shadows', () => {
  it('glow function produces shadow string', () => {
    const result = shadows.glow('#ff0000');
    expect(result).toBe('0 0 20px #ff000040');
  });
});

describe('theme radii', () => {
  it('has expected radius values', () => {
    expect(radii.none).toBe('0');
    expect(radii.full).toBe('9999px');
  });
});
