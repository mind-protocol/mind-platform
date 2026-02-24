'use client';

import { useState, useRef } from 'react';
import { useEnvironments } from '@/lib/tracker/hooks/useEnvironments';
import type { EnvironmentCapture } from '@/lib/tracker/types/environment';

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  panorama: { label: 'Panorama', color: 'text-blue-400 bg-blue-500/10' },
  mesh: { label: '3D Mesh', color: 'text-green-400 bg-green-500/10' },
  splat: { label: 'Splat', color: 'text-purple-400 bg-purple-500/10' },
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function EnvironmentManager() {
  const { environments, active, loading, upload, setActive, remove } = useEnvironments();
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      await upload(file, file.name.replace(/\.[^.]+$/, ''), 'manual', '', true);
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition flex items-center gap-2"
      >
        <span>🌍</span>
        <span>{active ? active.name : 'Environment'}</span>
      </button>
    );
  }

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl w-72 max-h-[400px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Environments</span>
        <button onClick={() => setExpanded(false)} className="text-zinc-600 hover:text-white text-sm">
          ✕
        </button>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`mx-2 mt-2 p-3 border-2 border-dashed rounded-lg cursor-pointer text-center transition ${
          dragOver
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-zinc-700 hover:border-zinc-500'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.hdr,.exr,.webp,.glb,.gltf,.ply,.splat,.spz"
          onChange={handleFileInput}
        />
        {uploading ? (
          <div className="text-xs text-purple-400 animate-pulse">Uploading...</div>
        ) : (
          <div className="text-xs text-zinc-500">
            Drop panorama, mesh, or splat file
            <br />
            <span className="text-zinc-600">jpg / png / glb / ply / splat</span>
          </div>
        )}
      </div>

      {/* Environment list */}
      <div className="p-2 space-y-1">
        {loading && environments.length === 0 && (
          <div className="text-xs text-zinc-600 text-center py-3">Loading...</div>
        )}

        {!loading && environments.length === 0 && (
          <div className="text-xs text-zinc-600 text-center py-3">
            No environments yet. Upload a 3D capture.
          </div>
        )}

        {/* Default night preset */}
        <button
          onClick={() => {
            // Deactivate current — active becomes null → fallback to night
            if (active) {
              setActive(active.id).catch(() => {});
              // Actually we need a "deactivate" — PATCH active: false
              fetch(`/api/tracker/environments/${active.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: false }),
              }).then(() => window.location.reload());
            }
          }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition ${
            !active
              ? 'bg-purple-500/10 border border-purple-500/30'
              : 'hover:bg-zinc-800'
          }`}
        >
          <span className="text-sm">🌙</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-300 truncate">Night (default)</div>
          </div>
          {!active && <span className="text-[10px] text-purple-400">Active</span>}
        </button>

        {environments.map((env) => (
          <EnvironmentRow
            key={env.id}
            env={env}
            isActive={env.id === active?.id}
            onActivate={() => setActive(env.id)}
            onRemove={() => remove(env.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EnvironmentRow({
  env,
  isActive,
  onActivate,
  onRemove,
}: {
  env: EnvironmentCapture;
  isActive: boolean;
  onActivate: () => void;
  onRemove: () => void;
}) {
  const badge = TYPE_BADGES[env.type] || TYPE_BADGES.panorama;

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded transition group ${
        isActive
          ? 'bg-purple-500/10 border border-purple-500/30'
          : 'hover:bg-zinc-800 cursor-pointer'
      }`}
      onClick={() => !isActive && onActivate()}
    >
      <span className="text-sm">
        {env.type === 'panorama' ? '🖼️' : env.type === 'mesh' ? '🧊' : '✨'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-zinc-300 truncate">{env.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[9px] px-1 rounded ${badge.color}`}>{badge.label}</span>
          <span className="text-[9px] text-zinc-600">{formatSize(env.size_bytes)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isActive && <span className="text-[10px] text-purple-400">Active</span>}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="text-zinc-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}
