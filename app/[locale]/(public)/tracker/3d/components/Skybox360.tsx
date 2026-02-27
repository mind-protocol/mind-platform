'use client';

/* ── Skybox360 — Intelligent Environment Rendering ───────────────
 *
 * Auto-detects the correct skybox based on:
 *   - Geolocation → sun/moon position (suncalc)
 *   - Camera feed → ambient luminance + color temperature
 *   - Time of day → dawn/sunrise/noon/…/night
 *   - Smart induction → indoor vs outdoor
 *
 * Render modes:
 *   1. User-uploaded equirectangular → highest priority
 *   2. Procedural daytime sky (drei <Sky>) → outdoor + daytime
 *   3. Procedural night sky (stars + moon) → outdoor + night
 *   4. Indoor default (yoga room texture) → fallback
 *
 * Camera-adaptive veil dims the skybox so 3D elements stay visible.
 * ─────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useSkybox360 } from './SkyboxUploader';
import {
  useEnvironmentDetection,
  useSkyboxSettings,
  type EnvironmentProfile,
} from '@/lib/tracker/skybox';

/** Default skybox: Nicolas's yoga room */
const DEFAULT_SKYBOX = '/skybox-default.jpg';

/* ── Main component ──────────────────────────────────────────────── */

export default function Skybox360() {
  const { skyboxUrl } = useSkybox360();
  const { settings } = useSkyboxSettings();
  const env = useEnvironmentDetection({
    cameraEnabled: settings.autoMode && settings.cameraEnabled,
    facingMode: settings.facingMode,
  });

  // Priority: user-uploaded > auto-detection > default
  if (skyboxUrl) {
    return <TextureSkybox url={skyboxUrl} veilOpacity={env.veilOpacity} />;
  }

  if (!settings.autoMode) {
    return <TextureSkybox url={DEFAULT_SKYBOX} veilOpacity={0.35} />;
  }

  // Auto mode
  switch (env.skyboxMode) {
    case 'procedural-day':
      return <ProceduralDaySky env={env} />;
    case 'procedural-night':
      return <ProceduralNightSky env={env} />;
    case 'indoor-default':
    default:
      return <TextureSkybox url={DEFAULT_SKYBOX} veilOpacity={env.veilOpacity} />;
  }
}

/* ── Texture-based skybox (equirectangular image) ────────────────── */

function TextureSkybox({
  url,
  veilOpacity = 0.35,
}: {
  url: string;
  veilOpacity?: number;
}) {
  const { scene } = useThree();
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        if (textureRef.current) textureRef.current.dispose();
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
        scene.environment = texture;
        textureRef.current = texture;
      },
      undefined,
      () => { /* skybox texture load failed — non-critical */ },
    );

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      scene.background = null;
      scene.environment = null;
    };
  }, [url, scene]);

  return <DarkVeil opacity={veilOpacity} />;
}

/* ── Procedural daytime sky (drei <Sky> + suncalc) ───────────────── */

function ProceduralDaySky({ env }: { env: EnvironmentProfile }) {
  const { scene } = useThree();

  // Clear texture-based background when entering procedural mode
  useEffect(() => {
    scene.background = null;
    scene.environment = null;
  }, [scene]);

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={env.sun.position}
        turbidity={env.skyParams.turbidity}
        rayleigh={env.skyParams.rayleigh}
        mieCoefficient={env.skyParams.mieCoefficient}
        mieDirectionalG={env.skyParams.mieDirectionalG}
      />
      {/* Sun light — position follows real sun */}
      <directionalLight
        position={env.sun.position.map((v) => v * 50) as [number, number, number]}
        intensity={0.8 + Math.max(0, env.sun.altitude) * 0.5}
        color={env.sun.phase === 'golden-hour' || env.sun.phase === 'sunset' ? '#ffa040' : '#ffffff'}
        castShadow={false}
      />
      <DarkVeil opacity={env.veilOpacity} />
    </>
  );
}

/* ── Procedural night sky (stars + moon glow) ────────────────────── */

function ProceduralNightSky({ env }: { env: EnvironmentProfile }) {
  const { scene } = useThree();
  const moonRef = useRef<THREE.PointLight>(null);

  // Clear texture-based background
  useEffect(() => {
    scene.background = new THREE.Color('#050510');
    scene.environment = null;
  }, [scene]);

  // Moon position in Three.js space
  const moonPos = useMemo(() => {
    const phi = Math.PI / 2 - env.moon.altitude;
    const theta = env.moon.azimuth + Math.PI;
    const r = 80;
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.cos(theta),
    );
  }, [env.moon.altitude, env.moon.azimuth]);

  // Moon color based on phase (fuller = brighter)
  const moonIntensity = 0.3 + env.moon.illumination * 0.7;
  const moonColor = env.moon.illumination > 0.7 ? '#c8d8ff' : '#8898bb';

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />
      {/* Moon glow */}
      <pointLight
        ref={moonRef}
        position={moonPos}
        intensity={moonIntensity}
        color={moonColor}
        distance={200}
        decay={1.5}
      />
      {/* Moon sphere */}
      <mesh position={moonPos}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial
          color={moonColor}
          transparent
          opacity={0.6 + env.moon.illumination * 0.4}
        />
      </mesh>
      {/* Subtle ambient for night */}
      <ambientLight intensity={0.02} color="#1a1a3a" />
      <DarkVeil opacity={env.veilOpacity} />
    </>
  );
}

/* ── Dark veil — dims background so 3D elements remain visible ───── */

function DarkVeil({ opacity }: { opacity: number }) {
  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
