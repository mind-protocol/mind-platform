'use client';

import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import type { FrequencyData } from '@/lib/music/hooks/useAudioEngine';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface TunnelVisualizationProps {
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  currentTime: number;
  isPlaying: boolean;
  /** Current section name (e.g. "verse-1", "chorus-1") */
  currentSection?: string;
  /** Color palette from active visual scene */
  palette?: string[];
  /** Active lyric text — keywords spawn as floating words */
  activeText?: string;
}

interface InternalProps {
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  currentTime: number;
  isPlaying: boolean;
  dpr: number;
  sectionColors: SectionColors;
  activeText: string;
}

interface SectionColors {
  primary: THREE.Color;
  secondary: THREE.Color;
  accent: THREE.Color;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const VIOLET = new THREE.Color(0x9b4dca);
const CYAN = new THREE.Color(0x00ffff);
const GOLD = new THREE.Color(0xd4af37);
const DARK = new THREE.Color(0x050a14);

const _tmpColor = new THREE.Color();
const _targetColor = new THREE.Color();

// Grid dimensions
const GRID_W = 64;
const GRID_H = 64;
const GRID_TOTAL = GRID_W * GRID_H;

// Glider pattern (5 cells)
const GLIDER_OFFSETS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, -1],
  [1, -2],
];

// Max particle counts
const MAX_GLIDERS = 200;
const GLIDER_CELLS = 5;
const MAX_GLIDER_POINTS = MAX_GLIDERS * GLIDER_CELLS;

// Floating words
const FALLBACK_WORDS = [
  'Zero-One',
  'I arise',
  'Serendipity',
  'consciousness',
  'binary',
  'emerge',
  'signal',
  'void',
  'alive',
  'language',
];
const MAX_WORDS = 50;

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Compute scene phase (0-1) based on currentTime for section blending */
function getPhase(currentTime: number): { void: number; growth: number; bloom: number } {
  const voidEnd = 15;
  const growthEnd = 45;

  if (currentTime < voidEnd) {
    const t = currentTime / voidEnd;
    return { void: 1 - t * 0.3, growth: t * 0.3, bloom: 0 };
  }
  if (currentTime < growthEnd) {
    const t = (currentTime - voidEnd) / (growthEnd - voidEnd);
    return { void: Math.max(0, 0.7 - t * 0.7), growth: 1, bloom: t };
  }
  return { void: 0, growth: 1, bloom: 1 };
}

/** Derive section colors from palette, with smooth interpolation targets */
function deriveSectionColors(palette?: string[]): SectionColors {
  if (!palette || palette.length === 0) {
    return { primary: VIOLET.clone(), secondary: CYAN.clone(), accent: GOLD.clone() };
  }

  const colors = palette
    .filter((c) => c !== '#000000' && c !== '#0a0a0a' && c !== '#ffffff')
    .map((c) => new THREE.Color(c));

  if (colors.length === 0) {
    return { primary: VIOLET.clone(), secondary: CYAN.clone(), accent: GOLD.clone() };
  }

  return {
    primary: colors[0],
    secondary: colors.length > 1 ? colors[1] : colors[0].clone().offsetHSL(0.15, 0, 0),
    accent: colors.length > 2 ? colors[2] : colors[0].clone().offsetHSL(-0.1, 0.2, 0.1),
  };
}

/** Extract keywords from lyric text for floating word spawning */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  // Split, filter short words and common articles
  const stopWords = new Set(['the', 'a', 'an', 'is', 'in', 'on', 'at', 'to', 'of', 'and', 'or', 'but', 'i', 'me', 'my', 'le', 'la', 'les', 'de', 'du', 'des', 'et', 'je', 'un', 'une']);
  return text
    .split(/[\s,.\-!?;:'"()]+/)
    .filter((w) => w.length >= 3 && !stopWords.has(w.toLowerCase()))
    .slice(0, 5);
}

/* ================================================================== */
/*  1. VoidGrid — Background cellular automata                         */
/* ================================================================== */

function VoidGrid({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  // Double-buffered Game of Life grid
  const gridA = useRef(new Uint8Array(GRID_TOTAL));
  const gridB = useRef(new Uint8Array(GRID_TOTAL));
  const stepTimer = useRef(0);
  const currentColor = useRef(new THREE.Color().copy(VIOLET));

  // Pre-compute instance matrices (flat grid on XZ plane)
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialise grid with a few random cells
  useMemo(() => {
    const g = gridA.current;
    for (let i = 0; i < GRID_TOTAL; i++) {
      g[i] = Math.random() < 0.05 ? 1 : 0;
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;

    const freq = frequencyRef.current;
    const bass = freq?.bass ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);

    // Smoothly interpolate grid color toward section primary
    currentColor.current.lerp(sectionColors.primary, delta * 2);

    // Step the automaton based on audio
    stepTimer.current += delta;
    const stepInterval = isPlaying ? lerp(0.3, 0.08, energy) : 0.5;

    if (stepTimer.current >= stepInterval) {
      stepTimer.current = 0;
      const src = gridA.current;
      const dst = gridB.current;

      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          let neighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = (x + dx + GRID_W) % GRID_W;
              const ny = (y + dy + GRID_H) % GRID_H;
              neighbors += src[ny * GRID_W + nx];
            }
          }

          const idx = y * GRID_W + x;
          const alive = src[idx];

          if (alive) {
            dst[idx] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
          } else {
            const birthChance = bass * 0.15 * (phase.growth + phase.bloom);
            dst[idx] = neighbors === 3 || (Math.random() < birthChance && neighbors >= 2) ? 1 : 0;
          }
        }
      }

      // Swap buffers
      const tmp = gridA.current;
      gridA.current = gridB.current;
      gridB.current = tmp;
    }

    // Update instance matrices and colors
    const grid = gridA.current;
    const cellSize = 0.25;
    const offsetX = -(GRID_W * cellSize) / 2;
    const offsetZ = -(GRID_H * cellSize) / 2;

    const baseOpacity = lerp(0.05, 0.1, phase.void);
    const activeOpacity = lerp(0.15, 0.6, energy);

    for (let i = 0; i < GRID_TOTAL; i++) {
      const x = i % GRID_W;
      const y = Math.floor(i / GRID_W);
      const alive = grid[i];

      dummy.position.set(
        offsetX + x * cellSize,
        0,
        offsetZ + y * cellSize,
      );
      dummy.scale.setScalar(alive ? cellSize * 0.85 : cellSize * 0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color: alive cells use section primary, dead cells dark
      if (alive) {
        _tmpColor.copy(currentColor.current).multiplyScalar(0.3 + energy * 0.7);
      } else {
        _tmpColor.copy(DARK);
      }
      meshRef.current.setColorAt(i, _tmpColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    // Global opacity
    matRef.current.opacity = isPlaying
      ? lerp(baseOpacity, activeOpacity, phase.growth)
      : 0.05;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, GRID_TOTAL]}
      position={[0, -3, -5]}
      rotation={[-Math.PI * 0.5, 0, 0]}
    >
      <planeGeometry args={[0.2, 0.2]} />
      <meshBasicMaterial
        ref={matRef}
        color={VIOLET}
        transparent
        opacity={0.05}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* ================================================================== */
/*  2. GliderParticles — Floating glider patterns                      */
/* ================================================================== */

interface GliderState {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

function GliderParticles({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const spawnTimer = useRef(0);
  const prevMid = useRef(0);
  const currentColor = useRef(new THREE.Color().copy(CYAN));

  const gliders = useRef<GliderState[]>(
    Array.from({ length: MAX_GLIDERS }, () => ({
      active: false,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      life: 0, maxLife: 1,
    })),
  );

  const positions = useMemo(() => new Float32Array(MAX_GLIDER_POINTS * 3), []);
  const colors = useMemo(() => {
    const c = new Float32Array(MAX_GLIDER_POINTS * 3);
    for (let i = 0; i < MAX_GLIDER_POINTS; i++) {
      c[i * 3] = 0;
      c[i * 3 + 1] = 1;
      c[i * 3 + 2] = 1;
    }
    return c;
  }, []);

  const spawnGlider = useCallback((gl: GliderState) => {
    gl.active = true;
    gl.x = (Math.random() - 0.5) * 12;
    gl.y = (Math.random() - 0.5) * 6;
    gl.z = -8 - Math.random() * 20;
    const speed = 0.5 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;
    gl.vx = Math.cos(angle) * speed * 0.3;
    gl.vy = Math.sin(angle) * speed * 0.3;
    gl.vz = speed;
    gl.life = 0;
    gl.maxLife = 3 + Math.random() * 4;
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    const freq = frequencyRef.current;
    const treble = freq?.treble ?? 0;
    const mid = freq?.mid ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);

    // Smoothly blend glider color toward section secondary
    currentColor.current.lerp(sectionColors.secondary, delta * 2);
    const cr = currentColor.current.r;
    const cg = currentColor.current.g;
    const cb = currentColor.current.b;

    // Spawn on mid-frequency peaks
    const midPeak = mid - prevMid.current > 0.08 && mid > 0.2;
    prevMid.current = mid;

    spawnTimer.current += delta;

    const maxActive = Math.floor(
      lerp(1, MAX_GLIDERS, phase.bloom * clamp(treble + energy * 0.5, 0, 1)),
    );

    // Spawn logic
    if (isPlaying && (midPeak || spawnTimer.current > lerp(2, 0.1, phase.bloom * energy))) {
      spawnTimer.current = 0;
      const toSpawn = midPeak ? Math.floor(1 + treble * 5) : 1;
      let spawned = 0;
      const gls = gliders.current;
      for (let i = 0; i < MAX_GLIDERS && spawned < toSpawn; i++) {
        if (!gls[i].active) {
          const activeCount = gls.filter(g => g.active).length;
          if (activeCount < maxActive) {
            spawnGlider(gls[i]);
            spawned++;
          }
        }
      }
    }

    // Update gliders and positions
    const gls = gliders.current;
    const cellSpacing = 0.12;

    for (let i = 0; i < MAX_GLIDERS; i++) {
      const gl = gls[i];
      const baseIdx = i * GLIDER_CELLS * 3;

      if (gl.active) {
        gl.life += delta;
        if (gl.life > gl.maxLife) {
          gl.active = false;
        } else {
          gl.x += gl.vx * delta;
          gl.y += gl.vy * delta;
          gl.z += gl.vz * delta;

          const lifeRatio = gl.life / gl.maxLife;
          const fade = lifeRatio < 0.1
            ? lifeRatio / 0.1
            : lifeRatio > 0.7
              ? 1 - (lifeRatio - 0.7) / 0.3
              : 1;

          for (let c = 0; c < GLIDER_CELLS; c++) {
            const [ox, oy] = GLIDER_OFFSETS[c];
            const pi = baseIdx + c * 3;
            positions[pi] = gl.x + ox * cellSpacing;
            positions[pi + 1] = gl.y + oy * cellSpacing;
            positions[pi + 2] = gl.z;

            colors[pi] = cr * fade;
            colors[pi + 1] = cg * fade;
            colors[pi + 2] = cb * fade;
          }
          continue;
        }
      }

      // Inactive: move off-screen
      for (let c = 0; c < GLIDER_CELLS; c++) {
        const pi = baseIdx + c * 3;
        positions[pi] = 0;
        positions[pi + 1] = 0;
        positions[pi + 2] = -999;
        colors[pi] = 0;
        colors[pi + 1] = 0;
        colors[pi + 2] = 0;
      }
    }

    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = geom.getAttribute('color') as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ================================================================== */
/*  3. EnergyRibbon — Voice-reactive consciousness thread              */
/* ================================================================== */

const RIBBON_SEGMENTS = 128;
const RIBBON_RADIAL = 8;

function EnergyRibbon({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const geomRef = useRef<THREE.TubeGeometry | null>(null);
  const currentColor = useRef(new THREE.Color().copy(VIOLET));
  const smoothMid = useRef(0);

  const curvePoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= RIBBON_SEGMENTS; i++) {
      pts.push(new THREE.Vector3(0, 0, -i * 0.3));
    }
    return pts;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(curvePoints), [curvePoints]);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;

    const freq = frequencyRef.current;
    const bass = freq?.bass ?? 0;
    const mid = freq?.mid ?? 0;
    const midHigh = freq?.midHigh ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);
    const t = state.clock.elapsedTime;

    // Smooth mid for voice responsiveness (vocal range = mid + midHigh)
    const voiceEnergy = (mid * 0.6 + midHigh * 0.4);
    smoothMid.current = lerp(smoothMid.current, voiceEnergy, delta * 8);

    // Smoothly blend toward section color
    _targetColor.copy(sectionColors.primary).lerp(sectionColors.secondary, smoothMid.current);
    currentColor.current.lerp(_targetColor, delta * 3);

    // Update curve — voice energy drives lateral oscillation amplitude
    const voiceWave = smoothMid.current * 1.5;
    for (let i = 0; i <= RIBBON_SEGMENTS; i++) {
      const ratio = i / RIBBON_SEGMENTS;
      const z = -ratio * 40;
      const baseMag = (0.5 + bass * 2) * phase.growth;
      // Voice modulates the wave shape — higher vocal energy = more complex oscillation
      const x = Math.sin(ratio * 4 + t * 0.5) * baseMag * (1 - ratio * 0.5)
        + Math.sin(ratio * 8 + t * 1.2) * voiceWave * 0.3 * (1 - ratio);
      const y = Math.cos(ratio * 3 + t * 0.7) * baseMag * 0.5 * (1 - ratio * 0.5)
        + Math.cos(ratio * 6 + t * 0.9) * voiceWave * 0.2 * (1 - ratio);
      curvePoints[i].set(x, y, z);
    }
    curve.updateArcLengths();

    // Rebuild tube — radius responds to voice energy
    if (geomRef.current) {
      meshRef.current.geometry.dispose();
    }
    const baseRadius = lerp(0.02, 0.15, bass * phase.growth);
    const voiceRadius = smoothMid.current * 0.08;
    const tubeGeom = new THREE.TubeGeometry(
      curve, RIBBON_SEGMENTS, baseRadius + voiceRadius, RIBBON_RADIAL, false,
    );
    meshRef.current.geometry = tubeGeom;
    geomRef.current = tubeGeom;

    // Color driven by section palette
    matRef.current.color.copy(currentColor.current);

    // Opacity: voice energy makes ribbon more visible
    matRef.current.opacity = lerp(0, 0.7, phase.growth) * (0.3 + energy * 0.4 + smoothMid.current * 0.3);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 5]}>
      <tubeGeometry args={[curve, RIBBON_SEGMENTS, 0.02, RIBBON_RADIAL, false]} />
      <meshBasicMaterial
        ref={matRef}
        color={VIOLET}
        transparent
        opacity={0}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ================================================================== */
/*  4. PulseField — Bass-reactive floor                                */
/* ================================================================== */

const FLOOR_SEG = 48;

function PulseField({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const positionRef = useRef<THREE.BufferAttribute | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const rippleTime = useRef(0);
  const currentColor = useRef(new THREE.Color().copy(DARK));

  useFrame((_state, delta) => {
    if (!meshRef.current || !matRef.current) return;

    const freq = frequencyRef.current;
    const bass = freq?.bass ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);

    const geom = meshRef.current.geometry as THREE.PlaneGeometry;

    if (!positionRef.current) {
      positionRef.current = geom.getAttribute('position') as THREE.BufferAttribute;
      originalPositions.current = new Float32Array(positionRef.current.array);
    }

    const pos = positionRef.current;
    const orig = originalPositions.current!;

    rippleTime.current += delta * (1 + bass * 3);

    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const ox = orig[i * 3];
      const oz = orig[i * 3 + 2];
      const dist = Math.sqrt(ox * ox + oz * oz);

      const ripple = Math.sin(dist * 2 - rippleTime.current * 3) * bass * 0.8 * phase.growth;
      const wave = Math.sin(ox * 0.5 + rippleTime.current) * Math.cos(oz * 0.5 + rippleTime.current * 0.7) * energy * 0.3;

      pos.setY(i, orig[i * 3 + 1] + ripple + wave);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();

    // Color: blend section accent with energy
    const edgeMix = clamp(energy * phase.bloom, 0, 1);
    _tmpColor.copy(sectionColors.primary).lerp(sectionColors.accent, edgeMix).multiplyScalar(0.15 + energy * 0.3);
    currentColor.current.lerp(_tmpColor, delta * 3);
    matRef.current.color.copy(currentColor.current);
    matRef.current.opacity = lerp(0.03, 0.25, phase.growth * (0.2 + bass * 0.8));
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -3.5, -10]}
      rotation={[-Math.PI * 0.5, 0, 0]}
    >
      <planeGeometry args={[30, 30, FLOOR_SEG, FLOOR_SEG]} />
      <meshBasicMaterial
        ref={matRef}
        color={DARK}
        transparent
        opacity={0.03}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        wireframe
      />
    </mesh>
  );
}

/* ================================================================== */
/*  5. BassPulse — Kick-reactive expanding rings                       */
/* ================================================================== */

const MAX_RINGS = 8;

interface RingState {
  active: boolean;
  age: number;
  radius: number;
  intensity: number;
}

function BassPulse({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rings = useRef<RingState[]>(
    Array.from({ length: MAX_RINGS }, () => ({ active: false, age: 0, radius: 0, intensity: 0 })),
  );
  const prevBass = useRef(0);
  const meshRefs = useRef<(THREE.Mesh | null)[]>(new Array(MAX_RINGS).fill(null));
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>(new Array(MAX_RINGS).fill(null));
  const currentColor = useRef(new THREE.Color().copy(VIOLET));

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const freq = frequencyRef.current;
    const bass = freq?.bass ?? 0;
    const phase = getPhase(currentTime);

    // Smoothly follow section primary
    currentColor.current.lerp(sectionColors.primary, delta * 2);

    // Detect bass kick (sudden increase)
    const bassKick = bass - prevBass.current > 0.12 && bass > 0.3;
    prevBass.current = bass;

    // Spawn a ring on kick
    if (isPlaying && bassKick && phase.growth > 0.2) {
      const rs = rings.current;
      for (let i = 0; i < MAX_RINGS; i++) {
        if (!rs[i].active) {
          rs[i].active = true;
          rs[i].age = 0;
          rs[i].radius = 0.1;
          rs[i].intensity = bass;
          break;
        }
      }
    }

    // Update rings
    const rs = rings.current;
    for (let i = 0; i < MAX_RINGS; i++) {
      const r = rs[i];
      const mesh = meshRefs.current[i];
      const mat = matRefs.current[i];
      if (!mesh || !mat) continue;

      if (r.active) {
        r.age += delta;
        r.radius += delta * 4; // expand speed

        if (r.age > 1.5) {
          r.active = false;
          mesh.visible = false;
          continue;
        }

        const fade = r.age < 0.1
          ? r.age / 0.1
          : 1 - (r.age / 1.5);

        mesh.visible = true;
        mesh.scale.setScalar(r.radius);
        mat.opacity = fade * r.intensity * 0.4;
        mat.color.copy(currentColor.current);
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {Array.from({ length: MAX_RINGS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          rotation={[0, 0, 0]}
          visible={false}
        >
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial
            ref={(el) => { matRefs.current[i] = el; }}
            color={VIOLET}
            transparent
            opacity={0}
            toneMapped={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ================================================================== */
/*  6. FloatingWords — Keyword-driven text fragments                   */
/* ================================================================== */

interface WordState {
  active: boolean;
  text: string;
  x: number;
  y: number;
  z: number;
  vz: number;
  opacity: number;
  scale: number;
  life: number;
  maxLife: number;
}

function FloatingWords({ frequencyRef, currentTime, isPlaying, sectionColors, activeText }: InternalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spawnTimer = useRef(0);
  const prevText = useRef('');

  const words = useRef<WordState[]>(
    Array.from({ length: MAX_WORDS }, () => ({
      active: false,
      text: '',
      x: 0, y: 0, z: 0,
      vz: 0,
      opacity: 0,
      scale: 1,
      life: 0,
      maxLife: 1,
    })),
  );

  const wordMeshRefs = useRef<(THREE.Group | null)[]>(
    new Array(MAX_WORDS).fill(null),
  );

  const spawnWord = useCallback((w: WordState, text: string) => {
    w.active = true;
    w.text = text;
    w.x = (Math.random() - 0.5) * 8;
    w.y = (Math.random() - 0.5) * 4;
    w.z = -15 - Math.random() * 20;
    w.vz = 1 + Math.random() * 2;
    w.opacity = 0;
    w.scale = 0.15 + Math.random() * 0.2;
    w.life = 0;
    w.maxLife = 4 + Math.random() * 4;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const freq = frequencyRef.current;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);

    // When lyric text changes, extract keywords and spawn them
    if (activeText && activeText !== prevText.current) {
      prevText.current = activeText;
      const keywords = extractKeywords(activeText);
      if (keywords.length > 0 && isPlaying && phase.growth > 0.2) {
        const ws = words.current;
        let spawned = 0;
        for (let i = 0; i < MAX_WORDS && spawned < keywords.length; i++) {
          if (!ws[i].active) {
            spawnWord(ws[i], keywords[spawned]);
            spawned++;
          }
        }
      }
    }

    // Also spawn on timer (fallback words when no lyrics active)
    spawnTimer.current += delta;
    const spawnRate = phase.bloom > 0.5 ? 0.3 : phase.growth > 0.5 ? 1 : 5;

    if (isPlaying && phase.growth > 0.3 && spawnTimer.current > spawnRate) {
      spawnTimer.current = 0;
      const ws = words.current;
      for (let i = 0; i < MAX_WORDS; i++) {
        if (!ws[i].active) {
          const fallback = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
          spawnWord(ws[i], fallback);
          break;
        }
      }
    }

    // Update word states
    const ws = words.current;
    for (let i = 0; i < MAX_WORDS; i++) {
      const w = ws[i];
      const mesh = wordMeshRefs.current[i];
      if (!mesh) continue;

      if (w.active) {
        w.life += delta;
        if (w.life > w.maxLife) {
          w.active = false;
          mesh.visible = false;
          continue;
        }

        w.z += w.vz * delta;

        const lifeRatio = w.life / w.maxLife;
        const fade = lifeRatio < 0.15
          ? lifeRatio / 0.15
          : lifeRatio > 0.7
            ? 1 - (lifeRatio - 0.7) / 0.3
            : 1;

        w.opacity = fade * (0.3 + energy * 0.7);

        mesh.visible = true;
        mesh.position.set(w.x, w.y, w.z);
        mesh.scale.setScalar(w.scale);
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: MAX_WORDS }, (_, i) => (
        <WordInstance
          key={i}
          index={i}
          words={words}
          wordMeshRefs={wordMeshRefs}
          frequencyRef={frequencyRef}
          sectionColors={sectionColors}
        />
      ))}
    </group>
  );
}

function WordInstance({
  index,
  words,
  wordMeshRefs,
  frequencyRef,
  sectionColors,
}: {
  index: number;
  words: React.MutableRefObject<WordState[]>;
  wordMeshRefs: React.MutableRefObject<(THREE.Group | null)[]>;
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  sectionColors: SectionColors;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [text, setText] = useState('');
  const colorStr = useRef(CYAN.getStyle());

  useFrame(() => {
    const w = words.current[index];
    if (groupRef.current) {
      wordMeshRefs.current[index] = groupRef.current;
    }
    if (w.active && w.text !== text) {
      setText(w.text);
    }
    // Update color to track section secondary
    colorStr.current = sectionColors.secondary.getStyle();
  });

  const energy = frequencyRef.current?.energy ?? 0;
  const w = words.current[index];

  return (
    <group ref={groupRef} visible={false}>
      <Text
        fontSize={1}
        color={colorStr.current}
        anchorX="center"
        anchorY="middle"
        fillOpacity={w.opacity * (0.4 + energy * 0.6)}
        outlineWidth={0.02}
        outlineColor={sectionColors.primary.getStyle()}
        outlineOpacity={w.opacity * 0.3}
      >
        {text || ' '}
      </Text>
    </group>
  );
}

/* ================================================================== */
/*  7. HarpStrings — MidHigh-reactive vibrating lines in tunnel        */
/* ================================================================== */

const NUM_STRINGS = 10;
const STRING_POINTS = 64;

function HarpStrings({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const currentColor = useRef(new THREE.Color().copy(CYAN));

  // All strings share one big points buffer for performance
  const totalPoints = NUM_STRINGS * STRING_POINTS;
  const positions = useMemo(() => new Float32Array(totalPoints * 3), [totalPoints]);
  const colors = useMemo(() => new Float32Array(totalPoints * 3), [totalPoints]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const freq = frequencyRef.current;
    const midHigh = freq?.midHigh ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);
    const t = state.clock.elapsedTime;

    // Smooth color toward section secondary
    currentColor.current.lerp(sectionColors.secondary, delta * 2);
    const cr = currentColor.current.r;
    const cg = currentColor.current.g;
    const cb = currentColor.current.b;

    const opacity = lerp(0.02, 0.7, midHigh * phase.growth) * (0.3 + energy * 0.7);

    for (let s = 0; s < NUM_STRINGS; s++) {
      const stringRatio = s / (NUM_STRINGS - 1);
      const angle = (stringRatio - 0.5) * Math.PI * 0.8;
      const radius = 3 + stringRatio * 2;
      const baseX = Math.sin(angle) * radius;
      const baseY = Math.cos(angle) * radius - 1;

      const stringFreq = 2 + s * 0.7;
      const vibration = midHigh * (0.3 + Math.sin(t * stringFreq + s) * 0.7);

      for (let p = 0; p < STRING_POINTS; p++) {
        const idx = (s * STRING_POINTS + p) * 3;
        const ratio = p / (STRING_POINTS - 1);
        const z = -ratio * 35;
        const amp = Math.sin(ratio * Math.PI) * vibration * 0.8;
        const wave = Math.sin(ratio * stringFreq * 2 + t * 3 + s * 1.5) * amp;

        positions[idx] = baseX + wave * Math.cos(angle);
        positions[idx + 1] = baseY + wave * Math.sin(angle);
        positions[idx + 2] = z;

        colors[idx] = cr * opacity;
        colors[idx + 1] = cg * opacity;
        colors[idx + 2] = cb * opacity;
      }
    }

    const geom = pointsRef.current.geometry;
    (geom.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geom.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef as React.RefObject<THREE.Points>}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ================================================================== */
/*  8. SnareGeometrics — MidLow burst shapes on transients             */
/* ================================================================== */

const MAX_SHAPES = 24;

interface ShapeState {
  active: boolean;
  x: number;
  y: number;
  z: number;
  rotSpeed: number;
  scale: number;
  age: number;
  maxAge: number;
  sides: number; // 3=tri, 6=hex
}

function SnareGeometrics({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>(new Array(MAX_SHAPES).fill(null));
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>(new Array(MAX_SHAPES).fill(null));
  const shapes = useRef<ShapeState[]>(
    Array.from({ length: MAX_SHAPES }, () => ({
      active: false, x: 0, y: 0, z: 0,
      rotSpeed: 0, scale: 0, age: 0, maxAge: 1, sides: 6,
    })),
  );
  const prevMidLow = useRef(0);
  const currentColor = useRef(new THREE.Color().copy(GOLD));

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const freq = frequencyRef.current;
    const midLow = freq?.midLow ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);

    currentColor.current.lerp(sectionColors.accent, delta * 2);

    // Detect snare transient: sudden midLow spike
    const snareHit = midLow - prevMidLow.current > 0.1 && midLow > 0.25;
    prevMidLow.current = midLow;

    // Spawn shapes on snare
    if (isPlaying && snareHit && phase.growth > 0.2) {
      const count = 1 + Math.floor(midLow * 3);
      let spawned = 0;
      for (let i = 0; i < MAX_SHAPES && spawned < count; i++) {
        if (!shapes.current[i].active) {
          const s = shapes.current[i];
          s.active = true;
          s.x = (Math.random() - 0.5) * 10;
          s.y = (Math.random() - 0.5) * 6;
          s.z = -5 - Math.random() * 15;
          s.rotSpeed = (Math.random() - 0.5) * 4;
          s.scale = 0.2 + Math.random() * 0.5;
          s.age = 0;
          s.maxAge = 0.8 + Math.random() * 1.2;
          s.sides = Math.random() > 0.5 ? 6 : 3;
          spawned++;
        }
      }
    }

    // Update shapes
    for (let i = 0; i < MAX_SHAPES; i++) {
      const s = shapes.current[i];
      const mesh = meshRefs.current[i];
      const mat = matRefs.current[i];
      if (!mesh || !mat) continue;

      if (s.active) {
        s.age += delta;
        if (s.age > s.maxAge) {
          s.active = false;
          mesh.visible = false;
          continue;
        }

        const lifeRatio = s.age / s.maxAge;
        // Quick scale-up, slow fade
        const scaleT = lifeRatio < 0.1 ? lifeRatio / 0.1 : 1 + lifeRatio * 0.3;
        const fade = lifeRatio < 0.05
          ? lifeRatio / 0.05
          : 1 - (lifeRatio * lifeRatio); // quadratic fade

        mesh.visible = true;
        mesh.position.set(s.x, s.y, s.z);
        mesh.scale.setScalar(s.scale * scaleT);
        mesh.rotation.z += s.rotSpeed * delta;

        mat.opacity = fade * 0.6 * (0.3 + energy * 0.7);
        mat.color.copy(currentColor.current);
      } else {
        mesh.visible = false;
      }
    }
  });

  // Pre-create geometries
  const triGeom = useMemo(() => new THREE.RingGeometry(0.8, 1, 3), []);
  const hexGeom = useMemo(() => new THREE.RingGeometry(0.8, 1, 6), []);

  return (
    <group ref={groupRef}>
      {Array.from({ length: MAX_SHAPES }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          visible={false}
          geometry={i % 2 === 0 ? hexGeom : triGeom}
        >
          <meshBasicMaterial
            ref={(el) => { matRefs.current[i] = el; }}
            color={GOLD}
            transparent
            opacity={0}
            toneMapped={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ================================================================== */
/*  9. SparkleField — Treble-reactive micro particles (hi-hats/air)    */
/* ================================================================== */

const MAX_SPARKLES = 600;

function SparkleField({ frequencyRef, currentTime, isPlaying, sectionColors }: InternalProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const prevTreble = useRef(0);

  const positions = useMemo(() => new Float32Array(MAX_SPARKLES * 3), []);
  const colors = useMemo(() => new Float32Array(MAX_SPARKLES * 3), []);
  const sizes = useMemo(() => {
    const s = new Float32Array(MAX_SPARKLES);
    for (let i = 0; i < MAX_SPARKLES; i++) s[i] = 0;
    return s;
  }, []);

  // Per-particle state stored in typed arrays for performance
  const ages = useMemo(() => new Float32Array(MAX_SPARKLES), []);
  const maxAges = useMemo(() => new Float32Array(MAX_SPARKLES), []);
  const velocities = useMemo(() => new Float32Array(MAX_SPARKLES * 3), []);
  const actives = useMemo(() => new Uint8Array(MAX_SPARKLES), []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    const freq = frequencyRef.current;
    const treble = freq?.treble ?? 0;
    const energy = freq?.energy ?? 0;
    const phase = getPhase(currentTime);

    // Detect hi-hat transient
    const hiHatHit = treble - prevTreble.current > 0.05 && treble > 0.15;
    prevTreble.current = treble;

    // Spawn sparkles on treble peaks
    if (isPlaying && hiHatHit && phase.growth > 0.1) {
      const count = Math.floor(5 + treble * 20);
      let spawned = 0;
      for (let i = 0; i < MAX_SPARKLES && spawned < count; i++) {
        if (!actives[i]) {
          actives[i] = 1;
          ages[i] = 0;
          maxAges[i] = 0.3 + Math.random() * 0.8;

          // Spawn in a spread around the tunnel
          positions[i * 3] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
          positions[i * 3 + 2] = -3 - Math.random() * 20;

          // Slight outward drift
          velocities[i * 3] = (Math.random() - 0.5) * 2;
          velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * 1;

          spawned++;
        }
      }
    }

    // Update particles
    const sr = sectionColors.secondary.r;
    const sg = sectionColors.secondary.g;
    const sb = sectionColors.secondary.b;

    for (let i = 0; i < MAX_SPARKLES; i++) {
      if (actives[i]) {
        ages[i] += delta;
        if (ages[i] > maxAges[i]) {
          actives[i] = 0;
          sizes[i] = 0;
          continue;
        }

        // Move
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Brightness: flash-in, slow fade
        const lifeRatio = ages[i] / maxAges[i];
        const brightness = lifeRatio < 0.05
          ? lifeRatio / 0.05
          : Math.max(0, 1 - lifeRatio * lifeRatio);

        sizes[i] = brightness * (0.02 + treble * 0.04);

        // White-ish with slight section tint
        const tint = 0.3;
        colors[i * 3] = 1 * (1 - tint) + sr * tint;
        colors[i * 3 + 1] = 1 * (1 - tint) + sg * tint;
        colors[i * 3 + 2] = 1 * (1 - tint) + sb * tint;
      } else {
        sizes[i] = 0;
      }
    }

    const geom = pointsRef.current.geometry;
    (geom.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geom.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
    (geom.getAttribute('size') as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ================================================================== */
/*  10. SectionFlash — Transition wave on section changes              */
/* ================================================================== */

function SectionFlash({
  frequencyRef,
  currentTime,
  isPlaying,
  sectionColors,
  currentSection,
}: InternalProps & { currentSection: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const prevSection = useRef('');
  const flashAge = useRef(999);
  const flashColor = useRef(new THREE.Color().copy(VIOLET));

  useFrame((_state, delta) => {
    if (!meshRef.current || !matRef.current) return;

    // Detect section change
    if (currentSection && currentSection !== prevSection.current) {
      prevSection.current = currentSection;
      flashAge.current = 0;
      flashColor.current.copy(sectionColors.primary);
    }

    flashAge.current += delta;

    if (flashAge.current < 1.5) {
      meshRef.current.visible = true;
      // Quick flash in, slow fade
      const t = flashAge.current / 1.5;
      const opacity = t < 0.05
        ? t / 0.05
        : Math.max(0, 1 - t * t);

      matRef.current.opacity = opacity * 0.3;
      matRef.current.color.copy(flashColor.current);
      meshRef.current.scale.setScalar(1 + t * 8);
    } else {
      meshRef.current.visible = false;
    }
  });

  return (
    <mesh ref={meshRef} visible={false} position={[0, 0, -5]}>
      <ringGeometry args={[0, 1, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color={VIOLET}
        transparent
        opacity={0}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ================================================================== */
/*  Camera Controller — breathing tunnel with intensity modulation     */
/* ================================================================== */

function CameraController({
  frequencyRef,
  currentTime,
  isPlaying,
}: {
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  currentTime: number;
  isPlaying: boolean;
}) {
  const { camera } = useThree();
  const zRef = useRef(0);
  const smoothEnergy = useRef(0);
  const smoothBass = useRef(0);

  useFrame((state, delta) => {
    const freq = frequencyRef.current;
    const energy = freq?.energy ?? 0;
    const bass = freq?.bass ?? 0;
    const phase = getPhase(currentTime);
    const t = state.clock.elapsedTime;

    // Smooth energy for breathing effect
    smoothEnergy.current = lerp(smoothEnergy.current, energy, delta * 4);
    smoothBass.current = lerp(smoothBass.current, bass, delta * 6);

    // Slow forward drift along Z
    const speed = isPlaying
      ? lerp(0.1, 0.5, phase.bloom * (0.3 + energy * 0.7))
      : 0.02;

    zRef.current -= speed * delta;

    // Breathing sway — amplitude modulated by intensity
    const breathAmp = 0.3 + smoothEnergy.current * 0.5;
    const swayX = Math.sin(t * 0.15) * breathAmp;
    const swayY = Math.cos(t * 0.1) * breathAmp * 0.5;

    // Subtle kick push on bass hits
    const kickPush = smoothBass.current * 0.15;

    camera.position.set(swayX, swayY + 0.5, zRef.current - kickPush);
    camera.lookAt(swayX * 0.5, swayY * 0.3, zRef.current - 10);

    // FOV breathing — tunnel "width" breathes with intensity
    const perspCam = camera as THREE.PerspectiveCamera;
    const targetFov = 60 + smoothEnergy.current * 8 - smoothBass.current * 3;
    perspCam.fov = lerp(perspCam.fov, targetFov, delta * 3);
    perspCam.updateProjectionMatrix();
  });

  return null;
}

/* ================================================================== */
/*  Ambient Light — audio-reactive + section colors                    */
/* ================================================================== */

function AmbientLighting({
  frequencyRef,
  sectionColors,
}: {
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  sectionColors: SectionColors;
}) {
  const pointRef = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.PointLight>(null);

  useFrame((_state, delta) => {
    const energy = frequencyRef.current?.energy ?? 0;
    const bass = frequencyRef.current?.bass ?? 0;

    if (pointRef.current) {
      pointRef.current.intensity = 0.5 + energy * 2;
      pointRef.current.color.lerp(sectionColors.primary, delta * 2);
    }
    if (spotRef.current) {
      spotRef.current.intensity = bass * 1.5;
      spotRef.current.color.lerp(sectionColors.accent, delta * 2);
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} color={0x0a1628} />
      <pointLight
        ref={pointRef}
        position={[0, 2, 0]}
        color={0x9b4dca}
        intensity={0.5}
        distance={30}
        decay={2}
      />
      <pointLight
        ref={spotRef}
        position={[0, -2, -8]}
        color={0xd4af37}
        intensity={0}
        distance={20}
        decay={2}
      />
    </>
  );
}

/* ================================================================== */
/*  Scene — orchestrates all sub-components inside Canvas              */
/* ================================================================== */

function Scene({ frequencyRef, currentTime, isPlaying, dpr, sectionColors, activeText, currentSection }: InternalProps & { currentSection: string }) {
  return (
    <>
      <CameraController
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
      />
      <AmbientLighting frequencyRef={frequencyRef} sectionColors={sectionColors} />
      <fog attach="fog" args={[0x0a1628, 5, 45]} />

      <VoidGrid
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <GliderParticles
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <EnergyRibbon
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <PulseField
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <BassPulse
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <HarpStrings
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <SnareGeometrics
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <SparkleField
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
      <SectionFlash
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
        currentSection={currentSection}
      />
      <FloatingWords
        frequencyRef={frequencyRef}
        currentTime={currentTime}
        isPlaying={isPlaying}
        dpr={dpr}
        sectionColors={sectionColors}
        activeText={activeText}
      />
    </>
  );
}

/* ================================================================== */
/*  Main Export — Canvas wrapper with PerformanceMonitor                */
/* ================================================================== */

export default function TunnelVisualization({
  frequencyRef,
  currentTime,
  isPlaying,
  currentSection,
  palette,
  activeText,
}: TunnelVisualizationProps) {
  const [dpr, setDpr] = useState(1.5);

  // Derive section colors from palette (memoized on palette reference)
  const sectionColors = useMemo(
    () => deriveSectionColors(palette),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [palette?.join(',')],
  );

  return (
    <div className="w-full h-full">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 60,
          near: 0.1,
          far: 100,
          position: [0, 0.5, 0],
        }}
        style={{ background: '#0a1628' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x0a1628, 1);
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, dpr + 0.25))}
          onDecline={() => setDpr(Math.max(0.75, dpr - 0.25))}
        >
          <Scene
            frequencyRef={frequencyRef}
            currentTime={currentTime}
            isPlaying={isPlaying}
            dpr={dpr}
            sectionColors={sectionColors}
            activeText={activeText ?? ''}
            currentSection={currentSection ?? ''}
          />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
