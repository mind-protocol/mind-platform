'use client';

import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR, XROrigin } from '@react-three/xr';
import XRMeshCapture from '../components/environments/XRMeshCapture';

// Create XR store with mesh + plane detection enabled
const xrStore = createXRStore({
  meshDetection: true,
  planeDetection: true,
});

/**
 * WebXR Awareness Mirror — standalone XR page for Quest 3.
 *
 * Enables immersive-ar session with mesh detection overlay.
 * User can capture room geometry and upload to the environment system.
 *
 * Access: /tracker/3d/xr (open in Quest 3 browser)
 */
export default function XRPage() {
  const [captureRequested, setCaptureRequested] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [meshVisible, setMeshVisible] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  const handleCapture = useCallback(() => {
    setCapturing(true);
    setCaptureRequested(true);
  }, []);

  const handleCaptured = useCallback((success: boolean) => {
    setCapturing(false);
    setCaptured(success);
    if (success) {
      setTimeout(() => setCaptured(false), 3000);
    }
  }, []);

  const handleCaptureProcessed = useCallback(() => {
    setCaptureRequested(false);
  }, []);

  const enterAR = useCallback(async () => {
    try {
      await xrStore.enterAR();
      setSessionActive(true);
    } catch (err) {
      console.error('Failed to enter AR:', err);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white">
      {/* HUD overlay — visible in both normal and AR mode */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-zinc-400">Mind Protocol</span>
          <span className="text-xs text-zinc-600">|</span>
          <span className="text-xs text-purple-400">XR Mesh Capture</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle mesh wireframe */}
          <button
            onClick={() => setMeshVisible(!meshVisible)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
              meshVisible
                ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                : 'border-zinc-700 text-zinc-500'
            }`}
          >
            {meshVisible ? 'Mesh ON' : 'Mesh OFF'}
          </button>

          {/* Enter AR button */}
          {!sessionActive && (
            <button
              onClick={enterAR}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition"
            >
              Enter AR
            </button>
          )}

          {/* Capture button */}
          {sessionActive && (
            <button
              onClick={handleCapture}
              disabled={capturing}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition ${
                captured
                  ? 'bg-green-600 text-white'
                  : capturing
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {captured ? 'Captured!' : capturing ? 'Exporting...' : 'Capture Mesh'}
            </button>
          )}
        </div>
      </div>

      {/* Instructions (pre-AR) */}
      {!sessionActive && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="text-center space-y-6 max-w-md px-6">
            <div className="text-4xl">🥽</div>
            <h1 className="text-xl font-light tracking-wide">Quest 3 Mesh Capture</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Scan your room with Quest 3 mesh detection.
              Walls, floors, tables, and furniture will be detected and exported as a 3D model.
            </p>
            <div className="space-y-2 text-xs text-zinc-500">
              <p>1. Tap <strong className="text-purple-400">Enter AR</strong> to start mesh detection</p>
              <p>2. Look around your room — surfaces appear as colored wireframes</p>
              <p>3. Tap <strong className="text-emerald-400">Capture Mesh</strong> when ready</p>
              <p>4. Mesh uploads to your Awareness Mirror automatically</p>
            </div>
            <button
              onClick={enterAR}
              className="px-8 py-3 text-sm font-medium rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all hover:scale-105"
            >
              Enter AR
            </button>
          </div>
        </div>
      )}

      {/* R3F Canvas with XR */}
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'fixed', inset: 0 }}
      >
        <XR store={xrStore}>
          <XROrigin />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} />

          <Suspense fallback={null}>
            <XRMeshCapture
              visible={meshVisible}
              captureRequested={captureRequested}
              onCaptured={handleCaptured}
              onCaptureProcessed={handleCaptureProcessed}
            />
          </Suspense>
        </XR>
      </Canvas>
    </div>
  );
}
