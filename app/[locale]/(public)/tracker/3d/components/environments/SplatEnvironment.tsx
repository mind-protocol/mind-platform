'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  url: string;
}

/**
 * Gaussian splat renderer for .ply/.splat/.spz files.
 * Uses @lumaai/luma-web when available, with graceful fallback.
 */
export default function SplatEnvironment({ url }: Props) {
  const { scene } = useThree();
  const splatRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    async function loadSplat() {
      try {
        // Dynamic import — @lumaai/luma-web may not be installed
        const { LumaSplatsThree } = await import('@lumaai/luma-web');

        if (cancelled) return;

        const splat = new LumaSplatsThree({
          source: url,
        });

        // Scale and position to surround the scene
        splat.scale.setScalar(30);
        splat.position.set(0, 0, 0);

        scene.add(splat);
        splatRef.current = splat;
      } catch {
        console.warn(
          '[SplatEnvironment] @lumaai/luma-web not available. Install with: npm install @lumaai/luma-web',
        );
      }
    }

    loadSplat();

    return () => {
      cancelled = true;
      if (splatRef.current) {
        scene.remove(splatRef.current);
        splatRef.current = null;
      }
    };
  }, [url, scene]);

  return null;
}
