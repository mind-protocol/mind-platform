'use client';

import { OrbitControls } from '@react-three/drei';

export default function SceneControls() {
  return (
    <OrbitControls
      makeDefault
      minDistance={5}
      maxDistance={60}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.1}
      enableDamping
      dampingFactor={0.05}
    />
  );
}
