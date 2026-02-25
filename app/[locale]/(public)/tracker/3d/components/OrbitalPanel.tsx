'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── Types ──────────────────────────────────────────────────────────────

export interface OrbitalPanelProps {
  /** Horizontal angle in degrees (0 = front, 90 = right, -90 = left, 180 = behind) */
  azimuth: number;
  /** Vertical angle in degrees (0 = eye level, 30 = above, -30 = below) */
  elevation: number;
  /** Distance from camera center */
  distance: number;
  /** Whether panel is visible */
  visible: boolean;
  /** Whether panel always faces the camera (default: true) */
  billboard?: boolean;
  /** CSS class for the container */
  className?: string;
  children: React.ReactNode;
}

// ─── Helpers ────────────────────────────────────────────────────────────

const DEG2RAD = Math.PI / 180;

/** Convert spherical (azimuth, elevation, distance) to Cartesian (x, y, z). */
function sphericalToCartesian(
  azimuthDeg: number,
  elevationDeg: number,
  distance: number,
): THREE.Vector3 {
  const az = azimuthDeg * DEG2RAD;
  const el = elevationDeg * DEG2RAD;

  // Spherical convention: azimuth rotates around Y, elevation tilts from XZ plane
  const x = distance * Math.sin(az) * Math.cos(el);
  const y = distance * Math.sin(el);
  const z = -distance * Math.cos(az) * Math.cos(el); // negative Z = "in front" in R3F

  return new THREE.Vector3(x, y, z);
}

// Lerp factor per frame (~60fps) — gives smooth ~200ms transitions
const LERP_SPEED = 0.08;

// ─── Component ──────────────────────────────────────────────────────────

/**
 * OrbitalPanel — positions HTML content in 3D orbital space around the camera.
 *
 * Uses spherical coordinates (azimuth, elevation, distance) to place a drei Html
 * panel in the scene. Supports billboard mode (always faces camera) and smooth
 * position lerping for animated transitions.
 *
 * Must be used inside a React Three Fiber Canvas context.
 */
export default function OrbitalPanel({
  azimuth,
  elevation,
  distance,
  visible,
  billboard = true,
  className,
  children,
}: OrbitalPanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Target position from spherical coordinates
  const targetPos = useMemo(
    () => sphericalToCartesian(azimuth, elevation, distance),
    [azimuth, elevation, distance],
  );

  // Smooth position interpolation + billboard rotation
  useFrame((state) => {
    if (!groupRef.current) return;

    // Initialize position instantly on first frame (no lerp from origin)
    if (!initialized.current) {
      currentPos.current.copy(targetPos);
      groupRef.current.position.copy(targetPos);
      initialized.current = true;
    } else {
      // Lerp toward target for smooth transitions
      currentPos.current.lerp(targetPos, LERP_SPEED);
      groupRef.current.position.copy(currentPos.current);
    }

    // Billboard: rotate group to face camera
    if (billboard) {
      groupRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  // Scale visibility via opacity — keep in DOM for smooth transitions
  // When not visible, we still render but with display:none to avoid layout cost
  if (!visible) return null;

  return (
    <group ref={groupRef}>
      <Html
        transform
        distanceFactor={10}
        zIndexRange={[1000, 0]}
        style={{
          pointerEvents: 'auto',
          transition: 'opacity 0.3s ease-out',
        }}
        className={className}
      >
        {children}
      </Html>
    </group>
  );
}
