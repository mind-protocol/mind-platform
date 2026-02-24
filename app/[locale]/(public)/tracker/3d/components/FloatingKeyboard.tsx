'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AZERTY_ROWS, ALL_KEY_CODES, type KeyState } from '@/lib/tracker/hooks/useKeyboardReactive';

// ── Constants ──────────────────────────────────────────────────────────
const KEY_UNIT = 0.09;       // base key depth (Z) in 3D units
const KEY_GAP = 0.008;       // gap between keys
const KEY_HEIGHT = 0.025;    // key thickness (Y) — visible chiclet

// Colors — cold, subtle, living blue (not neon gaming)
const GLOW_COLOR = new THREE.Color(0x5aaaff);   // hit impact
const HALO_COLOR = new THREE.Color(0x468cff);    // softer halo
const IDLE_COLOR = new THREE.Color(0x1a1a40);    // visible idle blue
const LABEL_COLOR = '#8ab4ff';

// ── Neighbor map for glow spill ────────────────────────────────────────
function buildNeighborMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();

  const positions = new Map<string, { row: number; col: number }>();
  AZERTY_ROWS.forEach((row, rowIdx) => {
    row.forEach((key, colIdx) => {
      positions.set(key.code, { row: rowIdx, col: colIdx });
    });
  });

  positions.forEach(({ row, col }, code) => {
    const neighbors: string[] = [];
    const rowKeys = AZERTY_ROWS[row];
    if (col > 0) neighbors.push(rowKeys[col - 1].code);
    if (col < rowKeys.length - 1) neighbors.push(rowKeys[col + 1].code);
    if (row > 0) {
      const above = AZERTY_ROWS[row - 1];
      const start = Math.max(0, col - 1);
      const end = Math.min(above.length - 1, col + 1);
      for (let i = start; i <= end; i++) neighbors.push(above[i].code);
    }
    if (row < AZERTY_ROWS.length - 1) {
      const below = AZERTY_ROWS[row + 1];
      const start = Math.max(0, col - 1);
      const end = Math.min(below.length - 1, col + 1);
      for (let i = start; i <= end; i++) neighbors.push(below[i].code);
    }
    map.set(code, neighbors);
  });

  return map;
}

const NEIGHBOR_MAP = buildNeighborMap();

// ── Single Key mesh (BoxGeometry — reliable rendering) ───────────────
function KeyMesh({
  code,
  label,
  width,
  position,
  keyStatesRef,
}: {
  code: string;
  label: string;
  width: number;
  position: [number, number, number];
  keyStatesRef: React.RefObject<Map<string, KeyState>>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const labelRef = useRef<{ fillOpacity: number } | null>(null);

  useFrame(() => {
    if (!matRef.current || !keyStatesRef.current) return;
    const state = keyStatesRef.current.get(code);
    const glow = state?.glow || 0;

    // Neighbor spill (8% of strongest neighbor)
    let neighborGlow = 0;
    const neighbors = NEIGHBOR_MAP.get(code);
    if (neighbors) {
      for (const nCode of neighbors) {
        const nState = keyStatesRef.current.get(nCode);
        if (nState && nState.glow > neighborGlow) {
          neighborGlow = nState.glow;
        }
      }
    }
    const spillGlow = neighborGlow * 0.08;
    const totalGlow = Math.min(1, glow + spillGlow);

    // Emissive: baseline blue glow + stronger on hit
    matRef.current.emissive.lerpColors(HALO_COLOR, GLOW_COLOR, totalGlow);
    matRef.current.emissiveIntensity = 0.8 + totalGlow * 2.5;

    // Base color: visible blue idle → brighter on hit
    matRef.current.color.copy(IDLE_COLOR).lerp(GLOW_COLOR, 0.1 + totalGlow * 0.25);

    // Opacity: clearly visible idle, brighter on hit
    matRef.current.opacity = 0.4 + totalGlow * 0.45;

    // Label opacity
    if (labelRef.current) {
      labelRef.current.fillOpacity = 0.4 + totalGlow * 0.5;
    }

    // Subtle Y press displacement
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + KEY_HEIGHT / 2 - glow * 0.006;
    }
  });

  const showLabel = label.length <= 3;
  const fontSize = label.length === 1 ? 0.026 : 0.016;

  return (
    <group position={position}>
      {/* Key cap — BoxGeometry (centered at half-extents) */}
      <mesh
        ref={meshRef}
        position={[width / 2, KEY_HEIGHT / 2, KEY_UNIT / 2]}
      >
        <boxGeometry args={[width * 0.94, KEY_HEIGHT, KEY_UNIT * 0.94]} />
        <meshStandardMaterial
          ref={matRef}
          color={IDLE_COLOR}
          roughness={0.6}
          metalness={0.15}
          emissive={HALO_COLOR}
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Label */}
      {showLabel && (
        <Text
          ref={labelRef as React.Ref<never>}
          position={[width / 2, KEY_HEIGHT + 0.002, KEY_UNIT / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color={LABEL_COLOR}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.4}
          font={undefined}
        >
          {label}
        </Text>
      )}
    </group>
  );
}

// ── Floating Keyboard assembly ─────────────────────────────────────────
export default function FloatingKeyboard({
  keyStatesRef,
  decayKeys,
  position = [0, -2.5, 2],
  rotation = [-0.35, 0, 0],
  scale = 1.2,
}: {
  keyStatesRef: React.RefObject<Map<string, KeyState>>;
  decayKeys: (delta: number) => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  // Run decay in useFrame
  useFrame((_, delta) => {
    decayKeys(delta);
  });

  // Build all keys with positions
  const keys = useMemo(() => {
    const result: {
      code: string;
      label: string;
      width: number;
      pos: [number, number, number];
    }[] = [];

    const rowWidths = AZERTY_ROWS.map(row =>
      row.reduce((sum, k) => sum + k.w * KEY_UNIT + KEY_GAP, -KEY_GAP)
    );
    const maxWidth = Math.max(...rowWidths);

    AZERTY_ROWS.forEach((row, rowIdx) => {
      let x = -maxWidth / 2;
      const z = rowIdx * (KEY_UNIT + KEY_GAP);

      row.forEach((key) => {
        const keyWidth = key.w * KEY_UNIT + (key.w - 1) * KEY_GAP;
        result.push({
          code: key.code,
          label: key.label,
          width: keyWidth,
          pos: [x, 0, z],
        });
        x += keyWidth + KEY_GAP;
      });
    });

    return result;
  }, []);

  // Keyboard total dimensions for base plate
  const kbdWidth = useMemo(() => {
    const xs = keys.map(k => k.pos[0]);
    const ws = keys.map(k => k.width);
    return Math.max(...xs.map((x, i) => x + ws[i])) - Math.min(...xs) + 0.02;
  }, [keys]);

  const kbdDepth = AZERTY_ROWS.length * (KEY_UNIT + KEY_GAP) + 0.02;

  return (
    <group position={position} rotation={rotation} scale={scale} frustumCulled={false}>
      {/* Subtle base plate — dark, barely visible */}
      <mesh position={[0, -0.002, kbdDepth / 2]}>
        <boxGeometry args={[kbdWidth, 0.004, kbdDepth]} />
        <meshStandardMaterial
          color="#0a0a1e"
          roughness={0.8}
          metalness={0.1}
          emissive={HALO_COLOR}
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Key caps */}
      {keys.map((k) => (
        <KeyMesh
          key={k.code}
          code={k.code}
          label={k.label}
          width={k.width}
          position={k.pos}
          keyStatesRef={keyStatesRef}
        />
      ))}

      {/* Underglow light — soft blue from below */}
      <pointLight
        position={[0, -0.15, kbdDepth / 2]}
        color="#4488ff"
        intensity={0.6}
        distance={3}
        decay={2}
      />
    </group>
  );
}
