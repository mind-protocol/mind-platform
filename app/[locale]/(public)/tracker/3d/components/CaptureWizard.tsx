'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

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

const STEP_KEYS: { key: Step; labelKey: string; icon: string }[] = [
  { key: 'splat', labelKey: 'scaniverseScan', icon: '📱' },
  { key: 'mesh', labelKey: 'quest3Mesh', icon: '🥽' },
  { key: 'audio', labelKey: 'ambientAudio', icon: '🎤' },
  { key: 'review', labelKey: 'reviewStep', icon: '✅' },
];

/**
 * 4-step wizard for capturing a composite environment:
 * 1. Upload Scaniverse .PLY Gaussian splat
 * 2. Quest 3 WebXR mesh capture (via QR code / link)
 * 3. Record 30s ambient audio
 * 4. Review all layers and activate
 */
export default function CaptureWizard({ onClose, onComplete }: Props) {
  const t = useTranslations('Tracker');
  const [step, setStep] = useState<Step>('splat');
  const [layers, setLayers] = useState<CapturedLayers>({});
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');

  const stepIndex = STEP_KEYS.findIndex((s) => s.key === step);

  const canProceed = useCallback(() => {
    switch (step) {
      case 'splat': return !!layers.splatFile;
      case 'mesh': return true; // mesh is optional
      case 'audio': return true; // audio is optional
      case 'review': return !!layers.splatFile || layers.meshUploaded || !!layers.audioBlob;
    }
  }, [step, layers]);

  const nextStep = useCallback(() => {
    const idx = STEP_KEYS.findIndex((s) => s.key === step);
    if (idx < STEP_KEYS.length - 1) {
      setStep(STEP_KEYS[idx + 1].key);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    const idx = STEP_KEYS.findIndex((s) => s.key === step);
    if (idx > 0) {
      setStep(STEP_KEYS[idx - 1].key);
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
      formData.append('name', name || `${t('scanRoom')} ${new Date().toLocaleDateString()}`);
      formData.append('set_active', 'true');
      formData.append('source', 'capture_wizard');

      const res = await fetch('/api/tracker/environments/composite', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        onComplete();
      } else {
        /* composite upload failed — non-critical */
      }
    } catch {
      /* upload error — non-critical */
    } finally {
      setUploading(false);
    }
  }, [layers, name, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-mono text-zinc-300 tracking-wide">{t('scanRoom')}</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-white text-lg transition">
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-zinc-800/50">
          {STEP_KEYS.map((s, i) => (
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
                <span className="hidden sm:inline">{t(s.labelKey)}</span>
              </button>
              {i < STEP_KEYS.length - 1 && (
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
            {t('backBtn')}
          </button>
          {step !== 'review' ? (
            <button
              onClick={nextStep}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-40"
            >
              {step === 'audio' ? t('reviewStep') : t('nextBtn')}
            </button>
          ) : (
            <button
              onClick={handleFinalize}
              disabled={uploading || (!layers.splatFile && !layers.audioBlob)}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40 disabled:cursor-default"
            >
              {uploading ? t('uploadingDots') : t('activateEnv')}
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
  const t = useTranslations('Tracker');
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
        <h3 className="text-sm text-zinc-200 font-medium">{t('uploadGaussianSplat')}</h3>
        <p className="text-xs text-zinc-500 mt-1">
          {t('scaniverseExportDesc')}
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
            {t('replaceFile')}
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
            {t('dropPlyFile')}
          </div>
          <div className="text-[10px] text-zinc-600 mt-1">
            {t('acceptsPly')}
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
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{t('howToExport')}</div>
        <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
          <li>{t('exportStep1')}</li>
          <li>{t('exportStep2')}</li>
          <li>{t('exportStep3')}</li>
          <li>{t('exportStep4')}</li>
        </ol>
      </div>
    </div>
  );
}

// ─── Step 2: Quest 3 Mesh Capture ─────────────────────────────────────

function MeshCaptureStep() {
  const t = useTranslations('Tracker');
  const xrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/en/tracker/3d/xr`
    : '/en/tracker/3d/xr';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-zinc-200 font-medium">{t('quest3MeshDetection')}</h3>
        <p className="text-xs text-zinc-500 mt-1">
          {t('quest3MeshDesc')}
        </p>
      </div>

      {/* URL to open on Quest 3 */}
      <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{t('openOnQuest3')}</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs text-purple-300 font-mono break-all">
            {xrUrl}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(xrUrl)}
            className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 border border-zinc-700 rounded transition shrink-0"
          >
            {t('copyLabel')}
          </button>
        </div>
      </div>

      <div className="p-3 bg-zinc-800/50 rounded-lg">
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{t('quest3Instructions')}</div>
        <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
          <li>{t('quest3InstStep1')}</li>
          <li>{t('quest3InstStep2', { btn: '' })}<strong className="text-purple-300">{t('enterAR')}</strong></li>
          <li>{t('quest3InstStep3')}</li>
          <li>{t('quest3InstStep4', { btn: '' })}<strong className="text-emerald-300">{t('captureMesh')}</strong></li>
          <li>{t('quest3InstStep5')}</li>
        </ol>
      </div>

      <div className="text-[10px] text-zinc-600 text-center">
        {t('quest3Optional')}
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
  const t = useTranslations('Tracker');
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
      setError(t('micDenied'));
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
        <h3 className="text-sm text-zinc-200 font-medium">{t('ambientAudioTitle')}</h3>
        <p className="text-xs text-zinc-500 mt-1">
          {t('ambientAudioDesc')}
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
              {t('stopRecording')}
            </button>
          </>
        ) : audioBlob ? (
          <>
            {/* Playback */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl">🔊</span>
            </div>
            <div className="text-xs text-emerald-400">
              {t('audioCaptured', { size: (audioBlob.size / 1024).toFixed(0) })}
            </div>
            {previewUrl && (
              <audio ref={audioRef} src={previewUrl} controls className="w-full max-w-xs h-8" />
            )}
            <button
              onClick={startRecording}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition"
            >
              {t('reRecord')}
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
              {t('tapToRecord')}
            </div>
          </>
        )}

        {error && <div className="text-xs text-red-400">{error}</div>}
      </div>

      <div className="text-[10px] text-zinc-600 text-center">
        {t('audioOptional')}
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
  const t = useTranslations('Tracker');
  const layerCount =
    (layers.splatFile ? 1 : 0) +
    (layers.meshUploaded ? 1 : 0) +
    (layers.audioBlob ? 1 : 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm text-zinc-200 font-medium">{t('reviewComposite')}</h3>
        <p className="text-xs text-zinc-500 mt-1">
          {t('layersCaptured', { count: layerCount })}
        </p>
      </div>

      {/* Name input */}
      <div>
        <label className="text-[10px] text-zinc-500 uppercase tracking-wider">{t('nameLabel')}</label>
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
          label={t('gaussianSplat')}
          status={layers.splatFile ? `${layers.splatFile.name} (${(layers.splatFile.size / (1024 * 1024)).toFixed(1)} MB)` : undefined}
          color="purple"
        />
        <LayerRow
          icon="🧊"
          label={t('webxrMesh')}
          status={layers.meshUploaded ? (layers.meshName || 'Captured') : undefined}
          color="blue"
        />
        <LayerRow
          icon="🔊"
          label={t('ambientAudio')}
          status={layers.audioBlob ? `${(layers.audioBlob.size / 1024).toFixed(0)} KB` : undefined}
          color="emerald"
        />
      </div>

      {layerCount === 0 && (
        <div className="text-xs text-amber-400 bg-amber-500/10 rounded-lg p-3">
          {t('noLayersCaptured')}
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
  const t = useTranslations('Tracker');
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
        {present ? t('readyStatus') : t('skippedStatus')}
      </span>
    </div>
  );
}
