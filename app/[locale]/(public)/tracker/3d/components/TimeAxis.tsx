'use client';

import { Grid, Text, Line } from '@react-three/drei';
import type { GridLine } from '@/lib/tracker/hooks/useTimeScale';
import { SUBSTANCE_CONFIG, SUBSTANCE_KEYS } from '@/lib/tracker/constants';

interface TimeAxisProps {
  gridLines: GridLine[];
  worldWidth: number;
}

export default function TimeAxis({ gridLines, worldWidth }: TimeAxisProps) {
  return (
    <group>
      {/* Tron-style grid floor */}
      <Grid
        position={[0, -0.5, 5]}
        args={[worldWidth + 10, 20]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#27272a"
        sectionSize={5}
        sectionThickness={0.6}
        sectionColor="#3f3f46"
        fadeDistance={50}
        infiniteGrid={false}
      />

      {/* Time grid lines — vertical markers */}
      {gridLines.map((gl, i) => (
        <group key={i}>
          <Line
            points={[[gl.x, -0.5, -1], [gl.x, -0.5, 12]]}
            color="#3f3f46"
            lineWidth={0.5}
            transparent
            opacity={0.3}
          />
          <Text
            position={[gl.x, -0.5, 13]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.35}
            color="#52525b"
            anchorX="center"
            anchorY="top"
          >
            {gl.label}
          </Text>
        </group>
      ))}

      {/* Lane labels on the left edge */}
      {SUBSTANCE_KEYS.map((key) => {
        const cfg = SUBSTANCE_CONFIG[key];
        return (
          <Text
            key={key}
            position={[-(worldWidth / 2) - 2, cfg.laneY, 0]}
            fontSize={0.5}
            color={cfg.color}
            anchorX="right"
            anchorY="middle"
            fontWeight="bold"
          >
            {cfg.label}
          </Text>
        );
      })}
    </group>
  );
}
