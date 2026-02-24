'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AZERTY_ROWS, ALL_KEY_CODES, type KeyState } from '@/lib/tracker/hooks/useKeyboardReactive';

// ── Constants ──────────────────────────────────────────────────────────
const KEY_UNIT = 0.09;       // base key size in 3D units
const KEY_GAP = 0.008;       // gap between keys
const KEY_HEIGHT = 0.012;    // key thickness (thin chiclet)
const CORNER_RADIUS = 0.004;

// Colors — cold, subtle, living blue (not neon gaming)
const BASE_COLOR = new THREE.Color(0x0c0c20);
const GLOW_COLOR = new THREE.Color(0x5aaaff);   // rgba(90, 170, 255) — hit impact
const HALO_COLOR = new THREE.Color(0x468cff);    // rgba(70, 140, 255) — softer halo
const IDLE_COLOR = new THREE.Color(0x161630);    // visible idle — not invisible
const LABEL_COLOR = '#8ab4ff';

// ── Neighbor map for glow spill ────────────────────────────────────────
// Pre-compute adjacency: for each key, which keys are physically next to it
function buildNeighborMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();

  // Build position lookup
  const positions = new Map<string, { row: number; col: number }>();
  AZERTY_ROWS.forEach((row, rowIdx) => {
    row.forEach((key, colIdx) => {
      positions.set(key.code, { row: rowIdx, col: colIdx });
    });
  });

  positions.forEach(({ row, col }, code) => {
    const neighbors: string[] = [];
    // Same row: left and right
    const rowKeys = AZERTY_ROWS[row];
    if (col > 0) neighbors.push(rowKeys[col - 1].code);
    if (col < rowKeys.length - 1) neighbors.push(rowKeys[col + 1].code);
    // Row above
    if (row > 0) {
      const above = AZERTY_ROWS[row - 1];
      // Nearest 1-2 keys above (by column index proximity)
      const start = Math.max(0, col - 1);
      const end = Math.min(above.length - 1, col + 1);
      for (let i = start; i <= end; i++) neighbors.push(above[i].code);
    }
    // Row below
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

// ── Single Key mesh ────────────────────────────────────────────────────
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

    // Compute neighbor spill (5-12% of strongest neighbor)
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
    const spillGlow = neighborGlow * 0.08; // 8% spill
    const totalGlow = Math.min(1, glow + spillGlow);

    // Emissive: baseline blue glow + stronger on hit
    matRef.current.emissive.lerpColors(HALO_COLOR, GLOW_COLOR, totalGlow);
    matRef.current.emissiveIntensity = 0.8 + totalGlow * 2.5;

    // Base color: visible blue idle → brighter on hit
    matRef.current.color.copy(IDLE_COLOR).lerp(GLOW_COLOR, 0.1 + totalGlow * 0.25);

    // Opacity: clearly visible idle, brighter on hit
    matRef.current.opacity = 0.35 + totalGlow * 0.45;

    // Label opacity follows glow but always readable
    if (labelRef.current) {
      labelRef.current.fillOpacity = 0.35 + totalGlow * 0.5;
    }

    // Subtle Y press displacement
    if (meshRef.current) {
      meshRef.current.position.y = position[1] - glow * 0.004;
    }
  });

  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = width;
    const h = KEY_UNIT;
    const r = CORNER_RADIUS;
    shape.moveTo(r, 0);
    shape.lineTo(w - r, 0);
    shape.quadraticCurveTo(w, 0, w, r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(r, h);
    shape.quadraticCurveTo(0, h, 0, h - r);
    shape.lineTo(0, r);
    shape.quadraticCurveTo(0, 0, r, 0);

    return new THREE.ExtrudeGeometry(shape, {
      depth: KEY_HEIGHT,
      bevelEnabled: true,
      bevelThickness: 0.0008,
      bevelSize: 0.0008,
      bevelSegments: 1,
    });
  }, [width]);

  const showLabel = label.length <= 3;
  const fontSize = label.length === 1 ? 0.026 : 0.016;

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={matRef}
          color={IDLE_COLOR}
          roughness={0.65}
          metalness={0.2}
          emissive={HALO_COLOR}
          emissiveIntensity={0.8}
          transparent
          opacity={0.35}
        />
      </mesh>
      {/* Label */}
      {showLabel && (
        <Text
          ref={labelRef as React.Ref<never>}
          position={[width / 2, KEY_HEIGHT / 2 + 0.001, KEY_UNIT / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color={LABEL_COLOR}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.35}
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
  // Run decay + neighbor spill in useFrame
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
      {/* DEBUG: single large magenta box inside FloatingKeyboard group */}
      <mesh position={[0, 0.05, kbdDepth / 2]} renderOrder={9000}>
        <boxGeometry args={[kbdWidth, 0.08, kbdDepth]} />
        <meshBasicMaterial color="#ff00ff" depthTest={false} />
      </mesh>

      {/* DEBUG: simple colored boxes for first row of keys (no ExtrudeGeometry) */}
      {keys.slice(0, 14).map((k, i) => (
        <mesh key={k.code} position={[k.pos[0] + k.width / 2, 0.05, k.pos[2] + KEY_UNIT / 2]}>
          <boxGeometry args={[k.width * 0.95, 0.04, KEY_UNIT * 0.95]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#3388ff' : '#55aaff'} />
        </mesh>
      ))}

      {/* Original keys — temporarily kept for comparison */}
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
    </group>
  );
}
