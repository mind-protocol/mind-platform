'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  url: string;
}

/**
 * Loads equirectangular panorama as scene background + environment map.
 * Supports jpg/png/webp. HDR/EXR support via RGBELoader (auto-detected by extension).
 */
export default function PanoramaEnvironment({ url }: Props) {
  const { scene } = useThree();

  useEffect(() => {
    if (!url) return;

    const isHDR = /\.(hdr|exr)$/i.test(url);

    if (isHDR) {
      // Dynamic import for HDR loader (not always needed)
      import('three/examples/jsm/loaders/RGBELoader.js').then(({ RGBELoader }) => {
        const loader = new RGBELoader();
        loader.load(url, (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture;
          scene.environment = texture;
        });
      }).catch(() => {
        console.warn('[PanoramaEnvironment] HDR loader not available, falling back to TextureLoader');
        loadStandard();
      });
    } else {
      loadStandard();
    }

    function loadStandard() {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          scene.background = texture;
          scene.environment = texture;
        },
        undefined,
        (err) => console.warn('[PanoramaEnvironment] Failed to load:', err),
      );
    }

    return () => {
      scene.background = null;
      scene.environment = null;
    };
  }, [url, scene]);

  if (!url) return null;

  // Dark veil so orbs remain visible against bright panoramas
  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
