'use client';

import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';

// Semantic labels from WebXR mesh detection
export type MeshSemantic =
  | 'wall'
  | 'floor'
  | 'ceiling'
  | 'table'
  | 'couch'
  | 'door'
  | 'window'
  | 'other'
  | 'global mesh';

interface XRMeshData {
  geometry: THREE.BufferGeometry;
  transform: THREE.Matrix4;
  semantic?: MeshSemantic;
}

interface ExportResult {
  blob: Blob;
  meshCount: number;
  semantics: MeshSemantic[];
}

/**
 * Hook for collecting WebXR meshes and exporting as GLB.
 * Collects meshes from the XR mesh detection API, merges them,
 * and exports via Three.js GLTFExporter.
 */
export function useXRMeshExport() {
  const meshesRef = useRef<Map<number, XRMeshData>>(new Map());
  const [exporting, setExporting] = useState(false);
  const [meshCount, setMeshCount] = useState(0);

  /**
   * Register or update a detected XR mesh.
   * Called from XRMeshCapture on each frame when meshes change.
   */
  const updateMesh = useCallback(
    (id: number, geometry: THREE.BufferGeometry, transform: THREE.Matrix4, semantic?: string) => {
      meshesRef.current.set(id, {
        geometry: geometry.clone(),
        transform: transform.clone(),
        semantic: (semantic as MeshSemantic) || 'other',
      });
      setMeshCount(meshesRef.current.size);
    },
    [],
  );

  /** Remove a mesh that's no longer detected. */
  const removeMesh = useCallback((id: number) => {
    meshesRef.current.delete(id);
    setMeshCount(meshesRef.current.size);
  }, []);

  /**
   * Export all collected meshes as a single GLB file.
   * Each mesh is a child of the root scene with semantic label in userData.
   */
  const exportGLB = useCallback(async (): Promise<ExportResult | null> => {
    const meshes = meshesRef.current;
    if (meshes.size === 0) return null;

    setExporting(true);
    try {
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

      const scene = new THREE.Scene();
      const semantics: MeshSemantic[] = [];

      meshes.forEach((data, id) => {
        const material = new THREE.MeshStandardMaterial({
          color: getSemanticColor(data.semantic),
          roughness: 0.8,
          metalness: 0.1,
        });

        const mesh = new THREE.Mesh(data.geometry.clone(), material);
        mesh.applyMatrix4(data.transform);
        mesh.name = `xr_mesh_${id}_${data.semantic || 'other'}`;
        mesh.userData.semantic = data.semantic;
        scene.add(mesh);

        if (data.semantic && !semantics.includes(data.semantic)) {
          semantics.push(data.semantic);
        }
      });

      const exporter = new GLTFExporter();
      const glb = await new Promise<ArrayBuffer>((resolve, reject) => {
        exporter.parse(
          scene,
          (result) => resolve(result as ArrayBuffer),
          reject,
          { binary: true },
        );
      });

      const blob = new Blob([glb], { type: 'model/gltf-binary' });
      return { blob, meshCount: meshes.size, semantics };
    } catch (err) {
      console.error('[useXRMeshExport] Export failed:', err);
      return null;
    } finally {
      setExporting(false);
    }
  }, []);

  /**
   * Export and upload to the Manemus backend in one step.
   */
  const exportAndUpload = useCallback(
    async (name?: string): Promise<boolean> => {
      const result = await exportGLB();
      if (!result) return false;

      const formData = new FormData();
      const filename = `xr_mesh_${Date.now()}.glb`;
      formData.append('file', result.blob, filename);
      formData.append('name', name || `Quest 3 Mesh (${result.meshCount} surfaces)`);
      formData.append('source', 'webxr_mesh_detection');
      formData.append('notes', `Semantics: ${result.semantics.join(', ')}`);
      formData.append('set_active', 'false');

      try {
        const res = await fetch('/api/tracker/environments', {
          method: 'POST',
          body: formData,
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    [exportGLB],
  );

  return {
    updateMesh,
    removeMesh,
    exportGLB,
    exportAndUpload,
    exporting,
    meshCount,
  };
}

/** Map semantic labels to colors for visual debugging. */
function getSemanticColor(semantic?: MeshSemantic): THREE.Color {
  switch (semantic) {
    case 'wall':
      return new THREE.Color(0x4488ff);
    case 'floor':
      return new THREE.Color(0x44ff88);
    case 'ceiling':
      return new THREE.Color(0x8844ff);
    case 'table':
      return new THREE.Color(0xffaa44);
    case 'couch':
      return new THREE.Color(0xff4488);
    case 'door':
      return new THREE.Color(0x44ffff);
    case 'window':
      return new THREE.Color(0xffff44);
    default:
      return new THREE.Color(0xcccccc);
  }
}
