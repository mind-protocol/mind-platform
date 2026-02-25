'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AZERTY_ROWS, type KeyState } from '@/lib/tracker/hooks/useKeyboardReactive';

// ── Constants ──────────────────────────────────────────────────────────
const KEY_UNIT = 0.09;       // base key depth (Z) in 3D units
const KEY_GAP = 0.008;       // gap between keys
const KEY_HEIGHT = 0.025;    // key thickness (Y)

// Colors — solid meshBasicMaterial (proven to render, no transparency)
const IDLE_COLOR = new THREE.Color(0x2a3580);    // medium blue idle
const GLOW_COLOR = new THREE.Color(0x5aaaff);    // bright blue on hit
const LABEL_COLOR = '#b0d0ff';
const _tmpColor = new THREE.Color();

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

// ── Single Key mesh (meshBasicMaterial — proven to render) ────────────
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
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
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

    // Color: dark blue idle → bright blue on hit
    _tmpColor.copy(IDLE_COLOR).lerp(GLOW_COLOR, totalGlow);
    matRef.current.color.copy(_tmpColor);

    // Label brightness follows glow
    if (labelRef.current) {
      labelRef.current.fillOpacity = 0.6 + totalGlow * 0.4;
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
      <mesh
        ref={meshRef}
        position={[width / 2, KEY_HEIGHT / 2, KEY_UNIT / 2]}
      >
        <boxGeometry args={[width * 0.94, KEY_HEIGHT, KEY_UNIT * 0.94]} />
        <meshBasicMaterial
          ref={matRef}
          color={IDLE_COLOR}
          toneMapped={false}
        />
      </mesh>
      {showLabel && (
        <Text
          ref={labelRef as React.Ref<never>}
          position={[width / 2, KEY_HEIGHT + 0.002, KEY_UNIT / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color={LABEL_COLOR}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.7}
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
  useFrame((_, delta) => {
    decayKeys(delta);
  });

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

  const kbdWidth = useMemo(() => {
    const xs = keys.map(k => k.pos[0]);
    const ws = keys.map(k => k.width);
    return Math.max(...xs.map((x, i) => x + ws[i])) - Math.min(...xs) + 0.02;
  }, [keys]);

  const kbdDepth = AZERTY_ROWS.length * (KEY_UNIT + KEY_GAP) + 0.02;

  return (
    <group position={position} rotation={rotation} scale={scale} frustumCulled={false} renderOrder={100}>
      {/* DEBUG: bright magenta plate — confirms component mounts + renders */}
      <mesh position={[0, 0.05, kbdDepth / 2]} renderOrder={9999}>
        <boxGeometry args={[kbdWidth, 0.06, kbdDepth]} />
        <meshBasicMaterial color="#ff00ff" toneMapped={false} />
      </mesh>

      {/* Underglow — ambient spill from below keyboard */}
      <pointLight position={[0, -0.15, kbdDepth / 2]} intensity={0.6} color="#4060ff" distance={4} decay={2} />

      {/* Base plate */}
      <mesh position={[0, -0.003, kbdDepth / 2]}>
        <boxGeometry args={[kbdWidth, 0.004, kbdDepth]} />
        <meshBasicMaterial color="#151535" toneMapped={false} />
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
    </group>
  );
}
