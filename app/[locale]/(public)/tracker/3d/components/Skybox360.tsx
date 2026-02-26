'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSkybox360 } from './SkyboxUploader';

/** Default skybox: Nicolas's yoga room */
const DEFAULT_SKYBOX = '/skybox-default.jpg';

/**
 * R3F component: renders a 360 equirectangular photo
 * as the scene background and environment map.
 *
 * Priority: user-uploaded skybox > default yoga room skybox.
 *
 * Includes a subtle dark veil sphere so consciousness orbs and
 * substance particles remain visible against bright panoramas.
 */
export default function Skybox360() {
  const { skyboxUrl } = useSkybox360();
  const { scene } = useThree();
  const textureRef = useRef<THREE.Texture | null>(null);

  // Use uploaded skybox if available, otherwise default
  const activeUrl = skyboxUrl || DEFAULT_SKYBOX;

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      activeUrl,
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

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      scene.background = null;
      scene.environment = null;
    };
  }, [activeUrl, scene]);

  // Dark veil sphere — dims the skybox so scene elements remain visible
  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={0.35}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
