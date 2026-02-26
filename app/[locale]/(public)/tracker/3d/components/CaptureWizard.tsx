'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type Step = 'splat' | 'mesh' | 'audio' | 'review';

interface CapturedLayers {
  splatFile?: File;
  splatPreviewUrl?: string;
  meshUploaded?: boolean;
  meshName?: string;
  audioBlob?: Blob;
  audioPreviewUrl?: string;
}

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'splat', label: 'Scaniverse Scan', icon: '📱' },
  { key: 'mesh', label: 'Quest 3 Mesh', icon: '🥽' },
  { key: 'audio', label: 'Ambient Audio', icon: '🎤' },
  { key: 'review', label: 'Review', icon: '✅' },
];

/**
 * 4-step wizard for capturing a composite environment:
 * 1. Upload Scaniverse .PLY Gaussian splat
 * 2. Quest 3 WebXR mesh capture (via QR code / link)
 * 3. Record 30s ambient audio
 * 4. Review all layers and activate
 */
export default function CaptureWizard({ onClose, onComplete }: Props) {
  const [step, setStep] = useState<Step>('splat');
  const [layers, setLayers] = useState<CapturedLayers>({});
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const canProceed = useCallback(() => {
    switch (step) {
      case 'splat': return !!layers.splatFile;
      case 'mesh': return true; // mesh is optional
      case 'audio': return true; // audio is optional
      case 'review': return !!layers.splatFile || layers.meshUploaded || !!layers.audioBlob;
    }
  }, [step, layers]);

  const nextStep = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].key);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.key === step);
    if (idx > 0) {
      setStep(STEPS[idx - 1].key);
    }
  }, [step]);

  const handleFinalize = useCallback(async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      if (layers.splatFile) {
        formData.append('splat', layers.splatFile);
      }
      if (layers.audioBlob) {
        formData.append('audio', layers.audioBlob, 'ambient_audio.webm');
      }
      formData.append('name', name || `Room Scan ${new Date().toLocaleDateString()}`);
      formData.append('set_active', 'true');
      formData.append('source', 'capture_wizard');

      const res = await fetch('/api/tracker/environments/composite', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        onComplete();
      } else {
        console.error('Composite upload failed:', await res.text());
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [layers, name, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-mono text-zinc-300 tracking-wide">Scan Room</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-white text-lg transition">
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-zinc-800/50">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <button
                onClick={() => i <= stepIndex && setStep(s.key)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition ${
                  s.key === step
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : i < stepIndex
                      ? 'text-zinc-400 hover:text-zinc-200 cursor-pointer'
                      : 'text-zinc-700 cursor-default'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span className="text-zinc-700 text-xs">{'>'}</span>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="p-5 min-h-[300px]">
          {step === 'splat' && (
            <SplatUploadStep
              file={layers.splatFile}
              onFileSelected={(file) => setLayers((l) => ({ ...l, splatFile: file }))}
            />
          )}
          {step === 'mesh' && <MeshCaptureStep />}
          {step === 'audio' && (
            <AudioRecordStep
              audioBlob={layers.audioBlob}
              onRecorded={(blob, url) =>
                setLayers((l) => ({ ...l, audioBlob: blob, audioPreviewUrl: url }))
              }
            />
          )}
          {step === 'review' && (
            <ReviewStep
              layers={layers}
              name={name}
              onNameChange={setName}
              uploading={uploading}
              onFinalize={handleFinalize}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800">
          <button
            onClick={prevStep}
            disabled={stepIndex === 0}
            className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-default transition"
          >
            Back
          </button>
          {step !== 'review' ? (
            <button
              onClick={nextStep}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-40"
            >
              {step === 'audio' ? 'Review' : 'Next'}
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              disabled={uploading || (!layers.splatFile && !layers.audioBlob)}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40 disabled:cursor-default"
            >
              {uploading ? 'Uploading...' : 'Activate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Scaniverse Splat Upload ──────────────────────────────────

function SplatUploadStep({
  file,
  onFileSelected,
}: {
  file?: File;
  onFileSelected: (f: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext && ['ply', 'splat', 'spz'].includes(ext)) {
      onFileSelected(f);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-zinc-200 font-medium">Upload Gaussian Splat</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Open <strong className="text-zinc-300">Scaniverse</strong> on your Android phone, scan your room (2-5 minutes), then export as <strong className="text-zinc-300">.PLY</strong> file.
        </p>
      </div>

      {file ? (
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <span className="text-lg">✨</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-emerald-300 truncate">{file.name}</div>
            <div className="text-[10px] text-zinc-500">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </div>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 transition"
          >
            Replace
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`p-8 border-2 border-dashed rounded-xl cursor-pointer text-center transition ${
            dragOver
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-zinc-700 hover:border-zinc-500'
          }`}
        >
          <div className="text-3xl mb-2">📱</div>
          <div className="text-xs text-zinc-400">
            Drop .PLY file here or click to browse
          </div>
          <div className="text-[10px] text-zinc-600 mt-1">
            Accepts .ply, .splat, .spz (up to 250MB)
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept=".ply,.splat,.spz"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          if (fileRef.current) fileRef.current.value = '';
        }}
      />

      <div className="p-3 bg-zinc-800/50 rounded-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">How to export from Scaniverse</div>
        <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
          <li>Open scan in Scaniverse</li>
          <li>Tap Share &gt; Export 3D Model</li>
          <li>Select <strong className="text-zinc-200">PLY</strong> format</li>
          <li>Transfer to computer or upload directly</li>
        </ol>
      </div>
    </div>
  );
}

// ─── Step 2: Quest 3 Mesh Capture ─────────────────────────────────────

function MeshCaptureStep() {
  const xrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/en/tracker/3d/xr`
    : '/en/tracker/3d/xr';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-zinc-200 font-medium">Quest 3 Mesh Detection</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Open this URL in your Quest 3 browser to capture room geometry.
          The mesh provides collision detection and spatial structure.
        </p>
      </div>

      {/* URL to open on Quest 3 */}
      <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Open on Quest 3</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs text-purple-300 font-mono break-all">
            {xrUrl}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(xrUrl)}
            className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 border border-zinc-700 rounded transition shrink-0"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="p-3 bg-zinc-800/50 rounded-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Instructions</div>
        <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
          <li>Open URL in Quest 3 browser</li>
          <li>Tap <strong className="text-purple-300">Enter AR</strong></li>
          <li>Look around — surfaces appear as colored wireframes</li>
          <li>Tap <strong className="text-emerald-300">Capture Mesh</strong></li>
          <li>Mesh auto-uploads to your environment library</li>
        </ol>
      </div>

      <div className="text-[10px] text-zinc-600 text-center">
        This step is optional — skip if you don&apos;t have a Quest 3
      </div>
    </div>
  );
}

// ─── Step 3: Ambient Audio Recording ──────────────────────────────────

function AudioRecordStep({
  audioBlob,
  onRecorded,
}: {
  audioBlob?: Blob;
  onRecorded: (blob: Blob, url: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string>('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const startRecording = useCallback(async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        onRecorded(blob, url);
      };

      recorder.start(1000); // 1s chunks
      recorderRef.current = recorder;
      setRecording(true);
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          // Auto-stop at 30s
          if (e >= 29) {
            recorder.stop();
            setRecording(false);
            clearInterval(timerRef.current);
          }
          return e + 1;
        });
      }, 1000);
    } catch (err) {
      setError('Microphone access denied');
    }
  }, [onRecorded]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-zinc-200 font-medium">Ambient Audio</h3>
        <p className="text-xs text-zinc-500 mt-1">
          Record 30 seconds of ambient room sound. This creates spatial audio
          that plays when you enter your environment in the Awareness Mirror.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        {recording ? (
          <>
            {/* Recording indicator */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 rounded-full bg-red-500" />
              </div>
            </div>
            <div className="text-sm font-mono text-red-400">
              {elapsed}s / 30s
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${(elapsed / 30) * 100}%` }}
              />
            </div>
            <button
              onClick={stopRecording}
              className="px-4 py-1.5 text-xs rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
            >
              Stop Recording
            </button>
          </>
        ) : audioBlob ? (
          <>
            {/* Playback */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl">🔊</span>
            </div>
            <div className="text-xs text-emerald-400">
              Audio captured ({(audioBlob.size / 1024).toFixed(0)} KB)
            </div>
            {previewUrl && (
              <audio ref={audioRef} src={previewUrl} controls className="w-full max-w-xs h-8" />
            )}
            <button
              onClick={startRecording}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              Re-record
            </button>
          </>
        ) : (
          <>
            {/* Ready to record */}
            <button
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-600 hover:border-purple-500 flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="text-2xl">🎤</span>
            </button>
            <div className="text-xs text-zinc-500">
              Tap to record 30s of ambient sound
            </div>
          </>
        )}

        {error && <div className="text-xs text-red-400">{error}</div>}
      </div>

      <div className="text-[10px] text-zinc-600 text-center">
        This step is optional — skip if you prefer no ambient audio
      </div>
    </div>
  );
}

// ─── Step 4: Review ───────────────────────────────────────────────────

function ReviewStep({
  layers,
  name,
  onNameChange,
  uploading,
  onFinalize,
}: {
  layers: CapturedLayers;
  name: string;
  onNameChange: (n: string) => void;
  uploading: boolean;
  onFinalize: () => void;
}) {
  const layerCount =
    (layers.splatFile ? 1 : 0) +
    (layers.meshUploaded ? 1 : 0) +
    (layers.audioBlob ? 1 : 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-zinc-200 font-medium">Review Composite Environment</h3>
        <p className="text-xs text-zinc-500 mt-1">
          {layerCount} layer{layerCount !== 1 ? 's' : ''} captured. Name your environment and activate it.
        </p>
      </div>

      {/* Name input */}
      <div>
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={`Room Scan ${new Date().toLocaleDateString()}`}
          className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Layer summary */}
      <div className="space-y-2">
        <LayerRow
          icon="✨"
          label="Gaussian Splat"
          status={layers.splatFile ? `${layers.splatFile.name} (${(layers.splatFile.size / (1024 * 1024)).toFixed(1)} MB)` : undefined}
          color="purple"
        />
        <LayerRow
          icon="🧊"
          label="WebXR Mesh"
          status={layers.meshUploaded ? (layers.meshName || 'Captured') : undefined}
          color="blue"
        />
        <LayerRow
          icon="🔊"
          label="Ambient Audio"
          status={layers.audioBlob ? `${(layers.audioBlob.size / 1024).toFixed(0)} KB` : undefined}
          color="emerald"
        />
      </div>

      {layerCount === 0 && (
        <div className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-3">
          No layers captured. Go back and add at least one layer.
        </div>
      )}
    </div>
  );
}

function LayerRow({
  icon,
  label,
  status,
  color,
}: {
  icon: string;
  label: string;
  status?: string;
  color: string;
}) {
  const present = !!status;
  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg border ${
        present
          ? `bg-${color}-500/10 border-${color}-500/30`
          : 'bg-zinc-800/50 border-zinc-800'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-xs ${present ? 'text-zinc-200' : 'text-zinc-600'}`}>
          {label}
        </div>
        {status && (
          <div className="text-[10px] text-zinc-500 truncate">{status}</div>
        )}
      </div>
      <span className={`text-[10px] ${present ? `text-${color}-400` : 'text-zinc-700'}`}>
        {present ? 'Ready' : 'Skipped'}
      </span>
    </div>
  );
}
