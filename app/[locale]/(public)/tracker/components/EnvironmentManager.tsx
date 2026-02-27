'use client';

import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/components/Toast';
import { useEnvironments } from '@/lib/tracker/hooks/useEnvironments';
import type { EnvironmentCapture } from '@/lib/tracker/types/environment';

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  panorama: { label: 'Panorama', color: 'text-blue-400 bg-blue-500/10' },
  mesh: { label: '3D Mesh', color: 'text-green-400 bg-green-500/10' },
  splat: { label: 'Splat', color: 'text-purple-400 bg-purple-500/10' },
  composite: { label: 'Composite', color: 'text-amber-400 bg-amber-500/10' },
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** Get browser geolocation as a promise. */
function getGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 60000 },
    );
  });
}

export default function EnvironmentManager() {
  const { toast } = useToast();
  const { environments, active, loading, upload, setActive, remove, suggestName } = useEnvironments();
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-upload naming state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingName, setPendingName] = useState('');
  const [pendingGeo, setPendingGeo] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pendingLocationName, setPendingLocationName] = useState('');
  const [suggesting, setSuggesting] = useState(false);

  // When a file is selected, get geolocation + suggest name
  const prepareFile = useCallback(async (file: File) => {
    setPendingFile(file);
    setPendingName(file.name.replace(/\.[^.]+$/, ''));
    setSuggesting(true);

    // Get geolocation in parallel with name suggestion
    const geo = await getGeolocation();
    setPendingGeo(geo);

    const suggestion = await suggestName(file, geo ?? undefined);
    if (suggestion) {
      setPendingName(suggestion.suggested_name);
      if (suggestion.location_hint) {
        // Extract short location from the hint
        const parts = suggestion.location_hint.split(',').slice(0, 2);
        setPendingLocationName(parts.join(',').trim());
      }
    }
    setSuggesting(false);
  }, [suggestName]);

  const confirmUpload = useCallback(async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const geo = pendingGeo
        ? { ...pendingGeo, location_name: pendingLocationName || undefined }
        : undefined;
      await upload(pendingFile, pendingName, 'manual', '', true, geo);
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setUploading(false);
      setPendingFile(null);
      setPendingName('');
      setPendingGeo(null);
      setPendingLocationName('');
    }
  }, [pendingFile, pendingName, pendingGeo, pendingLocationName, upload]);

  const cancelUpload = useCallback(() => {
    setPendingFile(null);
    setPendingName('');
    setPendingGeo(null);
    setPendingLocationName('');
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) prepareFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) prepareFile(file);
    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = '';
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

      {/* Pre-upload naming panel */}
      {pendingFile ? (
        <div className="mx-2 mt-2 p-3 border border-zinc-700 rounded-lg space-y-2">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Name this environment</div>
          {suggesting ? (
            <div className="text-xs text-purple-400 animate-pulse">Getting suggestion...</div>
          ) : (
            <>
              <input
                type="text"
                value={pendingName}
                onChange={(e) => setPendingName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmUpload(); }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                autoFocus
                placeholder="Environment name..."
              />
              {pendingGeo && (
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <span className="text-green-400">&#x25CF;</span>
                  {pendingLocationName || `${pendingGeo.latitude.toFixed(4)}, ${pendingGeo.longitude.toFixed(4)}`}
                </div>
              )}
              <div className="flex gap-1.5">
                <button
                  onClick={confirmUpload}
                  disabled={uploading || !pendingName.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-xs rounded px-2 py-1 transition"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={cancelUpload}
                  className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Upload drop zone */
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
          <div className="text-xs text-zinc-500">
            Drop panorama, mesh, or splat file
            <br />
            <span className="text-zinc-600">jpg / png / glb / ply / splat</span>
          </div>
        </div>
      )}

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
              setActive(active.id).catch(() => toast('Failed to update environment', 'error'));
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
  const locationLabel = env.geo?.location_name;

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
        {env.type === 'panorama' ? '🖼️' : env.type === 'mesh' ? '🧊' : env.type === 'composite' ? '🏠' : '✨'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-zinc-300 truncate">{env.name}</div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`text-[9px] px-1 rounded ${badge.color}`}>{badge.label}</span>
          <span className="text-[9px] text-zinc-600">{formatSize(env.size_bytes)}</span>
          {locationLabel && (
            <span className="text-[9px] px-1 rounded text-amber-400 bg-amber-500/10 truncate max-w-[100px]" title={locationLabel}>
              {locationLabel}
            </span>
          )}
          {env.geo && !locationLabel && (
            <span className="text-[9px] text-zinc-600" title={`${env.geo.lat.toFixed(4)}, ${env.geo.lng.toFixed(4)}`}>
              &#x25CF; geo
            </span>
          )}
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
