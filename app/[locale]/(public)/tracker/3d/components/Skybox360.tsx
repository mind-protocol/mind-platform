'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSkybox360 } from './SkyboxUploader';

/**
 * R3F component: renders a user-uploaded 360 equirectangular photo
 * as the scene background and environment map.
 *
 * Reads from localStorage via the useSkybox360 hook.
 * Falls back gracefully (renders nothing) when no skybox is set.
 *
 * Includes a subtle dark veil sphere so consciousness orbs and
 * substance particles remain visible against bright panoramas.
 */
export default function Skybox360() {
  const { skyboxUrl } = useSkybox360();
  const { scene } = useThree();
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (!skyboxUrl) {
      // Clean up any previous texture
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      scene.background = null;
      scene.environment = null;
      return;
    }

    // Detect HDR/EXR from data URL mime type or fallback to standard loader
    const isHDR = /^data:image\/(hdr|x-hdr|vnd\.radiance)/i.test(skyboxUrl) ||
                  /^data:application\/octet-stream/i.test(skyboxUrl);

    if (isHDR) {
      // HDR data URLs are unlikely but handle gracefully — fall through to standard
      loadStandard(skyboxUrl);
    } else {
      loadStandard(skyboxUrl);
    }

    function loadStandard(url: string) {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          // Dispose previous texture
          if (textureRef.current) {
            textureRef.current.dispose();
          }
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.colorSpace = THREE.SRGBColorSpace;
          scene.background = texture;
          scene.environment = texture;
          textureRef.current = texture;
        },
        undefined,
        (err) => {
          console.warn('[Skybox360] Failed to load skybox texture:', err);
        },
      );
    }

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      scene.background = null;
      scene.environment = null;
    };
  }, [skyboxUrl, scene]);

  // No skybox set — render nothing
  if (!skyboxUrl) return null;

  // Dark veil sphere — dims the skybox so scene elements remain visible
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
