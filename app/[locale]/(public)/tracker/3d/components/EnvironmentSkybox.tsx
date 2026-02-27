'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

interface EnvironmentSkyboxProps {
  /** URL to an equirectangular panorama image (jpg/png/hdr) */
  url?: string | null;
  /** Opacity blend: 0 = fully original fog, 1 = fully skybox */
  opacity?: number;
  /** Whether to also use the skybox as environment map for reflections */
  asEnvironment?: boolean;
}

/**
 * Loads an equirectangular panorama as scene background.
 *
 * Nicolas will provide 3D captures (e.g. from iPhone LiDAR / Polycam / Luma)
 * exported as equirectangular panorama images. This component:
 *
 * 1. Loads the image as a texture
 * 2. Maps it to an equirectangular projection (sphere mapping)
 * 3. Sets it as scene.background (optionally scene.environment for reflections)
 * 4. Supports opacity blending via a tinted overlay sphere
 *
 * Supported formats:
 * - .jpg/.png: Standard panorama (from Polycam, Luma AI, etc.)
 * - .hdr/.exr: HDR panorama (future, needs RGBELoader)
 *
 * Upload workflow:
 * - POST /api/tracker/skybox with the panorama file
 * - Returns a URL that can be passed here
 * - Stored at /uploads/skybox/ on the server
 */
export default function EnvironmentSkybox({ url, opacity = 1, asEnvironment = true }: EnvironmentSkyboxProps) {
  const { scene, gl } = useThree();

  useEffect(() => {
    if (!url) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        // Set as scene background
        scene.background = texture;

        // Optionally set as environment map for PBR reflections
        if (asEnvironment) {
          scene.environment = texture;
        }
      },
      undefined,
      (err) => {
        /* panorama load failed — non-critical */
      },
    );

    return () => {
      // Cleanup: restore original background
      scene.background = null;
      if (asEnvironment) {
        scene.environment = null;
      }
    };
  }, [url, asEnvironment, scene, gl]);

  // Dim overlay sphere — darkens the skybox to keep orbs visible
  // opacity=1 means full skybox, but we always add a subtle dark veil
  if (!url) return null;

  const veilOpacity = Math.max(0, 0.4 - opacity * 0.3); // 0.4 at opacity=0, 0.1 at opacity=1

  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={veilOpacity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
