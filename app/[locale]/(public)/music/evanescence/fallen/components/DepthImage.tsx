'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { FrequencyData } from '@/lib/music/hooks/useAudioEngine';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface DepthImageProps {
  /** Path to manifest.json for this track's visuals */
  manifestUrl: string;
  /** Audio frequency data ref */
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  /** Current playback time in seconds */
  currentTime: number;
  /** Is audio playing */
  isPlaying: boolean;
  /** Position in 3D space */
  position?: [number, number, number];
  /** Max width/height in world units */
  scale?: number;
  /** Opacity (0-1) */
  opacity?: number;
}

interface Manifest {
  type: 'video' | 'image';
  width: number;
  height: number;
  frameCount: number;
  fps: number;
  durationSec: number;
  frames: string[];
  depths: string[];
  cover: string;
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/* ================================================================== */
/*  Shader Material                                                    */
/* ================================================================== */

const vertexShader = /* glsl */ `
  uniform sampler2D uDepthMap;
  uniform float uDisplacement;
  uniform float uTime;
  uniform float uBass;
  uniform float uMid;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;

    // Sample depth map
    float depth = texture2D(uDepthMap, uv).r;
    vDepth = depth;

    // Displacement along normal, modulated by audio
    float audioDisp = uBass * 0.3 + uMid * 0.1;
    float breathe = sin(uTime * 0.5) * 0.02;
    float totalDisp = depth * (uDisplacement + audioDisp + breathe);

    vec3 displaced = position + normal * totalDisp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uEnergy;

  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);

    // Slight glow on closer (brighter depth) areas
    float glow = vDepth * uEnergy * 0.2;
    vec3 color = texColor.rgb + glow;

    gl_FragColor = vec4(color, texColor.a * uOpacity);
  }
`;

/* ================================================================== */
/*  DepthImageMesh — The actual displaced mesh                         */
/* ================================================================== */

function DepthImageMesh({
  textureUrl,
  depthUrl,
  frequencyRef,
  isPlaying,
  width,
  height,
  maxScale,
  opacity,
}: {
  textureUrl: string;
  depthUrl: string;
  frequencyRef: React.MutableRefObject<FrequencyData | null>;
  isPlaying: boolean;
  width: number;
  height: number;
  maxScale: number;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothBass = useRef(0);
  const smoothMid = useRef(0);
  const smoothEnergy = useRef(0);

  // Load textures
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [depthTexture, setDepthTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
    loader.load(depthUrl, (tex) => {
      setDepthTexture(tex);
    });
  }, [textureUrl, depthUrl]);

  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTexture: { value: null as THREE.Texture | null },
    uDepthMap: { value: null as THREE.Texture | null },
    uDisplacement: { value: 0.5 },
    uTime: { value: 0 },
    uBass: { value: 0 },
    uMid: { value: 0 },
    uOpacity: { value: opacity },
    uEnergy: { value: 0 },
  }), [opacity]);

  // Update uniforms when textures load
  useEffect(() => {
    if (texture) uniforms.uTexture.value = texture;
  }, [texture, uniforms]);

  useEffect(() => {
    if (depthTexture) uniforms.uDepthMap.value = depthTexture;
  }, [depthTexture, uniforms]);

  // Calculate mesh dimensions to fit maxScale
  const aspect = width / height;
  const meshWidth = aspect >= 1 ? maxScale : maxScale * aspect;
  const meshHeight = aspect >= 1 ? maxScale / aspect : maxScale;

  // Subdivision for smooth displacement
  const segments = 64;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const freq = frequencyRef.current;
    const bass = freq?.bass ?? 0;
    const mid = freq?.mid ?? 0;
    const energy = freq?.energy ?? 0;

    // Smooth audio values
    smoothBass.current = lerp(smoothBass.current, bass, delta * 6);
    smoothMid.current = lerp(smoothMid.current, mid, delta * 6);
    smoothEnergy.current = lerp(smoothEnergy.current, energy, delta * 4);

    // Update uniforms
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uBass.value = smoothBass.current;
    uniforms.uMid.value = smoothMid.current;
    uniforms.uEnergy.value = smoothEnergy.current;
    uniforms.uOpacity.value = opacity;

    // Subtle rotation from mid frequencies (parallax feel)
    const rotY = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      + smoothMid.current * 0.08;
    const rotX = Math.cos(state.clock.elapsedTime * 0.15) * 0.03;
    meshRef.current.rotation.y = rotY;
    meshRef.current.rotation.x = rotX;

    // Subtle scale pulse on bass
    const scalePulse = 1 + smoothBass.current * 0.03;
    meshRef.current.scale.setScalar(scalePulse);
  });

  if (!texture || !depthTexture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[meshWidth, meshHeight, segments, segments]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ================================================================== */
/*  DepthImage — Main component (loads manifest, manages frames)       */
/* ================================================================== */

export default function DepthImage({
  manifestUrl,
  frequencyRef,
  currentTime,
  isPlaying,
  position = [0, 0, -8],
  scale = 4,
  opacity = 0.7,
}: DepthImageProps) {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  // Load manifest
  useEffect(() => {
    fetch(manifestUrl)
      .then((r) => r.json())
      .then((data) => setManifest(data))
      .catch((err) => console.warn('DepthImage: failed to load manifest', err));
  }, [manifestUrl]);

  // For video: advance frame based on currentTime
  useEffect(() => {
    if (!manifest || manifest.type !== 'video' || manifest.fps <= 0) return;
    // Loop the video duration within the track
    const videoTime = currentTime % manifest.durationSec;
    const frame = Math.min(
      Math.floor(videoTime * manifest.fps),
      manifest.frameCount - 1,
    );
    setCurrentFrame(frame);
  }, [currentTime, manifest]);

  if (!manifest || manifest.frames.length === 0) return null;

  // Build full URLs from manifest relative paths
  const basePath = manifestUrl.replace('/manifest.json', '');
  const frameUrl = `${basePath}/${manifest.frames[currentFrame]}`;
  const depthUrl = manifest.depths.length > currentFrame
    ? `${basePath}/${manifest.depths[currentFrame]}`
    : null;

  if (!depthUrl) return null;

  return (
    <group ref={groupRef} position={position}>
      <DepthImageMesh
        textureUrl={frameUrl}
        depthUrl={depthUrl}
        frequencyRef={frequencyRef}
        isPlaying={isPlaying}
        width={manifest.width}
        height={manifest.height}
        maxScale={scale}
        opacity={opacity}
      />
    </group>
  );
}
