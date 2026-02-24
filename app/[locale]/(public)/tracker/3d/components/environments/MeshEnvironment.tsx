'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  url: string;
}

/**
 * Loads a GLB/GLTF 3D mesh as environment.
 * Auto-centers, scales to fit, dims materials so substance orbs remain visible.
 */
export default function MeshEnvironment({ url }: Props) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Dim all materials to ~30% brightness
  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.color) {
          mat.color.multiplyScalar(0.3);
        }
        mat.emissiveIntensity = 0;
        mat.roughness = Math.max(mat.roughness, 0.7);
      }
    });
  }, [scene]);

  // Compute scale to fit scene within radius ~40
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 40 / maxDim : 1;
  }, [scene]);

  // Very slow rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene.clone()} scale={scale} />
      </Center>
    </group>
  );
}
