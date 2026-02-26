'use client';

import { Suspense, lazy, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { CompositeEnvironmentData } from '@/lib/tracker/types/environment';
import SpatialAudioEnvironment from './SpatialAudioEnvironment';

const SplatEnvironment = lazy(() => import('./SplatEnvironment'));

interface Props {
  data: CompositeEnvironmentData;
  showMeshWireframe?: boolean;
  audioVolume?: number;
}

/**
 * Dual-layer composite environment renderer.
 * Renders simultaneously:
 * - Gaussian Splat (Luma AI) — visual/photoreal layer
 * - GLTF Mesh — collision/geometry layer (semi-transparent wireframe)
 * - Spatial Audio — HRTF ambient sound
 *
 * The splat provides visual fidelity, the mesh provides spatial structure,
 * and the audio provides ambient immersion. Orbs float inside the combined space.
 */
export default function CompositeEnvironment({
  data,
  showMeshWireframe = false,
  audioVolume = 0.6,
}: Props) {
  return (
    <group>
      {/* Visual layer — Gaussian Splat (photoreal) */}
      {data.splat_url && (
        <Suspense fallback={null}>
          <SplatEnvironment url={data.splat_url} />
        </Suspense>
      )}

      {/* Geometry layer — GLTF mesh (semi-transparent for spatial structure) */}
      {data.mesh_url && (
        <CompositeGeometryLayer
          url={data.mesh_url}
          wireframe={showMeshWireframe}
        />
      )}

      {/* Audio layer — HRTF spatial ambient */}
      {data.audio_url && (
        <SpatialAudioEnvironment
          url={data.audio_url}
          volume={audioVolume}
          loop
        />
      )}
    </group>
  );
}

/**
 * Semi-transparent mesh overlay for spatial geometry.
 * When splat is present, mesh is nearly invisible (opacity 0.1) — provides collision geometry.
 * Toggle wireframe mode for debugging alignment.
 */
function CompositeGeometryLayer({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Apply semi-transparent material for geometry overlay
  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = wireframe ? 0.4 : 0.1;
        mat.wireframe = wireframe;
        mat.depthWrite = false;
        if (wireframe) {
          mat.color = new THREE.Color(0x4488ff);
          mat.emissive = new THREE.Color(0x112244);
        } else {
          mat.color.multiplyScalar(0.2);
        }
      }
    });
  }, [scene, wireframe]);

  // Scale to fit scene within radius ~40
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 40 / maxDim : 1;
  }, [scene]);

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene.clone()} scale={scale} />
      </Center>
    </group>
  );
}
