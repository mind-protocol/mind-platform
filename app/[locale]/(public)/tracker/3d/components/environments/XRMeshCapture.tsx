'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useXRMeshExport, type MeshSemantic } from '@/lib/tracker/hooks/useXRMeshExport';

// Semantic color mapping for wireframe overlay
const SEMANTIC_COLORS: Record<string, THREE.Color> = {
  wall: new THREE.Color(0x4488ff),
  floor: new THREE.Color(0x44ff88),
  ceiling: new THREE.Color(0x8844ff),
  table: new THREE.Color(0xffaa44),
  couch: new THREE.Color(0xff4488),
  door: new THREE.Color(0x44ffff),
  window: new THREE.Color(0xffff44),
  other: new THREE.Color(0xcccccc),
  'global mesh': new THREE.Color(0xaaaaaa),
};

interface Props {
  /** Whether to render the wireframe mesh overlay. */
  visible?: boolean;
  /** Callback when capture is complete with upload status. */
  onCaptured?: (success: boolean) => void;
  /** External trigger to capture. */
  captureRequested?: boolean;
  /** Reset capture trigger after processing. */
  onCaptureProcessed?: () => void;
}

/**
 * WebXR Mesh Detection overlay for Quest 3.
 *
 * Uses the WebXR mesh detection API (available in Quest 3 browser)
 * to detect room geometry: walls, floor, ceiling, furniture.
 *
 * Renders semi-transparent colored wireframe overlay showing detected surfaces.
 * When capture is triggered, exports all meshes to GLB and uploads to backend.
 */
export default function XRMeshCapture({
  visible = true,
  onCaptured,
  captureRequested,
  onCaptureProcessed,
}: Props) {
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshObjsRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const meshIdCounter = useRef(0);
  const { updateMesh, removeMesh, exportAndUpload, exporting, meshCount } = useXRMeshExport();
  const [status, setStatus] = useState<string>('Scanning...');

  // Process XR meshes each frame
  useFrame(() => {
    const xrSession = gl.xr?.getSession?.();
    const frame = gl.xr?.getFrame?.();
    const refSpace = gl.xr?.getReferenceSpace?.();

    if (!xrSession || !frame || !refSpace) return;

    // WebXR Mesh Detection API
    const detectedMeshes = (frame as any).detectedMeshes as Set<any> | undefined;
    if (!detectedMeshes) return;

    const currentIds = new Set<number>();

    detectedMeshes.forEach((xrMesh: any) => {
      // Derive a stable ID from the mesh (use object identity via WeakMap if needed)
      let meshId = (xrMesh as any).__captureId;
      if (meshId === undefined) {
        meshId = meshIdCounter.current++;
        (xrMesh as any).__captureId = meshId;
      }
      currentIds.add(meshId);

      const pose = frame.getPose(xrMesh.meshSpace, refSpace);
      if (!pose) return;

      const vertices = xrMesh.vertices as Float32Array;
      const indices = xrMesh.indices as Uint32Array;
      const semantic: string = xrMesh.semanticLabel || 'other';

      // Build Three.js geometry
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
      if (indices && indices.length > 0) {
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
      }
      geometry.computeVertexNormals();

      // Transform matrix from XR pose
      const matrix = new THREE.Matrix4();
      matrix.fromArray(pose.transform.matrix);

      // Update export hook
      updateMesh(meshId, geometry, matrix, semantic);

      // Update visual representation
      if (visible && groupRef.current) {
        let meshObj = meshObjsRef.current.get(meshId);
        if (!meshObj) {
          const color = SEMANTIC_COLORS[semantic] || SEMANTIC_COLORS.other;
          const material = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
          });
          meshObj = new THREE.Mesh(geometry, material);
          meshObj.name = `xr_${semantic}_${meshId}`;
          groupRef.current.add(meshObj);
          meshObjsRef.current.set(meshId, meshObj);
        } else {
          meshObj.geometry.dispose();
          meshObj.geometry = geometry;
        }
        meshObj.matrix.copy(matrix);
        meshObj.matrixAutoUpdate = false;
        meshObj.visible = visible;
      }
    });

    // Remove meshes no longer detected
    meshObjsRef.current.forEach((obj, id) => {
      if (!currentIds.has(id)) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
        groupRef.current?.remove(obj);
        meshObjsRef.current.delete(id);
        removeMesh(id);
      }
    });

    setStatus(meshCount > 0 ? `${meshCount} surfaces detected` : 'Scanning...');
  });

  // Handle capture request
  useEffect(() => {
    if (!captureRequested || exporting) return;

    async function doCapture() {
      setStatus('Exporting mesh...');
      const success = await exportAndUpload();
      setStatus(success ? 'Mesh captured!' : 'Capture failed');
      onCaptured?.(success);
      onCaptureProcessed?.();
    }
    doCapture();
  }, [captureRequested, exporting, exportAndUpload, onCaptured, onCaptureProcessed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      meshObjsRef.current.forEach((obj) => {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      });
      meshObjsRef.current.clear();
    };
  }, []);

  return <group ref={groupRef} />;
}
