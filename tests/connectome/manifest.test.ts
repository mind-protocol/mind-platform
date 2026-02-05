import { describe, it, expect } from 'vitest';
import {
  NODE_TYPES,
  NODE_TYPE_COLORS,
  NODE_TYPE_DESCRIPTIONS,
  EDGE_TYPES,
  EDGE_TYPE_COLORS,
  TRIGGER_COLORS,
  CALL_TYPE_COLORS,
  ENERGY_COLORS,
  getEnergyBucket,
  formatEnergy,
} from '@/app/connectome/lib/connectome_system_map_node_edge_manifest';

describe('getEnergyBucket', () => {
  it('classifies low energy (< 0.25)', () => {
    expect(getEnergyBucket(0)).toBe('low');
    expect(getEnergyBucket(0.1)).toBe('low');
    expect(getEnergyBucket(0.24)).toBe('low');
  });

  it('classifies medium energy (0.25 - 0.5)', () => {
    expect(getEnergyBucket(0.25)).toBe('medium');
    expect(getEnergyBucket(0.49)).toBe('medium');
  });

  it('classifies high energy (0.5 - 0.75)', () => {
    expect(getEnergyBucket(0.5)).toBe('high');
    expect(getEnergyBucket(0.74)).toBe('high');
  });

  it('classifies critical energy (>= 0.75)', () => {
    expect(getEnergyBucket(0.75)).toBe('critical');
    expect(getEnergyBucket(1.0)).toBe('critical');
  });
});

describe('formatEnergy', () => {
  it('formats energy as percentage', () => {
    expect(formatEnergy(0)).toBe('0%');
    expect(formatEnergy(0.5)).toBe('50%');
    expect(formatEnergy(1.0)).toBe('100%');
    expect(formatEnergy(0.333)).toBe('33%');
  });
});

describe('NODE_TYPES', () => {
  it('contains all five schema node types', () => {
    expect(NODE_TYPES).toEqual(['Actor', 'Moment', 'Narrative', 'Space', 'Thing']);
  });

  it('has a color for every node type', () => {
    for (const type of NODE_TYPES) {
      expect(NODE_TYPE_COLORS[type]).toBeDefined();
      expect(NODE_TYPE_COLORS[type]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('has a description for every node type', () => {
    for (const type of NODE_TYPES) {
      expect(NODE_TYPE_DESCRIPTIONS[type]).toBeDefined();
      expect(NODE_TYPE_DESCRIPTIONS[type].length).toBeGreaterThan(0);
    }
  });
});

describe('EDGE_TYPES', () => {
  it('contains all relationship types', () => {
    expect(EDGE_TYPES).toEqual([
      'LINK', 'CONTAINS', 'RELATES_TO', 'PRECEDES', 'FOLLOWS', 'CAUSES', 'INFLUENCES',
    ]);
  });

  it('has a color for every edge type', () => {
    for (const type of EDGE_TYPES) {
      expect(EDGE_TYPE_COLORS[type]).toBeDefined();
    }
  });
});

describe('color maps completeness', () => {
  it('trigger colors cover all trigger types', () => {
    const types = ['direct', 'stream', 'async', 'hook', 'timer'] as const;
    for (const t of types) {
      expect(TRIGGER_COLORS[t]).toBeDefined();
    }
  });

  it('call type colors cover all call types', () => {
    const types = ['code', 'graphQuery', 'llm', 'graphLink', 'moment'] as const;
    for (const t of types) {
      expect(CALL_TYPE_COLORS[t]).toBeDefined();
    }
  });

  it('energy colors cover all buckets', () => {
    const buckets = ['low', 'medium', 'high', 'critical'] as const;
    for (const b of buckets) {
      expect(ENERGY_COLORS[b]).toBeDefined();
    }
  });
});
