'use client';

export default function AmbientLighting() {
  return (
    <>
      {/* Base ambient — dark blue for cyberpunk feel */}
      <ambientLight intensity={0.15} color="#4a5568" />
      {/* Key light from above-right */}
      <directionalLight position={[10, 15, 5]} intensity={0.4} color="#e2e8f0" />
      {/* Rim light from behind for glow */}
      <pointLight position={[0, 5, -15]} intensity={0.3} color="#7c3aed" distance={40} />
      {/* Fill from below for terrain visibility */}
      <pointLight position={[0, -3, 0]} intensity={0.1} color="#06b6d4" distance={20} />
    </>
  );
}
