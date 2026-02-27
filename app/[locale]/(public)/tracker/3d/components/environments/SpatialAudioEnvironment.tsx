'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

interface Props {
  url: string;
  volume?: number;
  loop?: boolean;
}

/**
 * Spatial audio environment layer using Web Audio API with HRTF panning.
 * Audio source positioned at scene center, listener synced to R3F camera.
 * Rotation of camera = perceived rotation of ambient sound (3D spatialization).
 */
export default function SpatialAudioEnvironment({ url, volume = 0.6, loop = true }: Props) {
  const { camera } = useThree();
  const ctxRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<PannerNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sync AudioListener position/orientation with R3F camera every frame
  useFrame(() => {
    const ctx = ctxRef.current;
    if (!ctx?.listener) return;

    const listener = ctx.listener;
    const pos = camera.position;
    const fwd = camera.getWorldDirection({ x: 0, y: 0, z: 0 } as any);

    if (listener.positionX) {
      // Modern API
      listener.positionX.value = pos.x;
      listener.positionY.value = pos.y;
      listener.positionZ.value = pos.z;
      listener.forwardX.value = fwd.x;
      listener.forwardY.value = fwd.y;
      listener.forwardZ.value = fwd.z;
      listener.upX.value = 0;
      listener.upY.value = 1;
      listener.upZ.value = 0;
    } else {
      // Legacy API
      listener.setPosition(pos.x, pos.y, pos.z);
      listener.setOrientation(fwd.x, fwd.y, fwd.z, 0, 1, 0);
    }
  });

  const cleanup = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (pannerRef.current) {
      pannerRef.current.disconnect();
      pannerRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => { /* AudioContext close failed */ });
      ctxRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    async function loadAudio() {
      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) { ctx.close(); return; }

        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (cancelled) { ctx.close(); return; }

        // Create panner with HRTF for 3D spatial audio
        const panner = ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 100;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 360;
        // Position audio source at scene center
        panner.positionX.value = 0;
        panner.positionY.value = 0;
        panner.positionZ.value = 0;
        pannerRef.current = panner;

        // Gain node for volume control
        const gain = ctx.createGain();
        gain.gain.value = volume;
        gainRef.current = gain;

        // Source → Panner → Gain → Destination
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = loop;
        source.connect(panner);
        panner.connect(gain);
        gain.connect(ctx.destination);
        sourceRef.current = source;

        source.start(0);
      } catch (err) {
        /* spatial audio load failed — non-critical */
      }
    }

    loadAudio();
    return () => { cancelled = true; cleanup(); };
  }, [url, loop, cleanup]);

  // Update volume dynamically
  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  return null;
}
