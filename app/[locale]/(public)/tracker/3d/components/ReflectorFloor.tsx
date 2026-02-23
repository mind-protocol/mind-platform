'use client';

import { MeshReflectorMaterial } from '@react-three/drei';

interface ReflectorFloorProps {
  worldWidth: number;
}

export default function ReflectorFloor({ worldWidth }: ReflectorFloorProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 5]}>
      <planeGeometry args={[worldWidth + 10, 22]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.4}
        roughness={0.95}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0a0f"
        metalness={0.5}
        mirror={0.15}
      />
    </mesh>
  );
}
