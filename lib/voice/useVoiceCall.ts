'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { VoicePhase, VoiceCallConfig, VoiceServerMessage } from './types';
import { AudioPlayback } from './AudioPlayback';

const VOICE_WS_ENV = process.env.NEXT_PUBLIC_VOICE_WS_URL || '';

function resolveWsUrl(): string {
  if (VOICE_WS_ENV) return VOICE_WS_ENV;
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'ws://localhost:8766/voice/ws';
  }
  // Production: Cloudflare tunnel to local voice server
  return 'wss://naples-strap-ads-expanded.trycloudflare.com/voice/ws';
}
const DEFAULT_VAD_THRESHOLD = 0.015;
const DEFAULT_VAD_SILENCE_MS = 600;

export interface UseVoiceCallReturn {
  /** Start a voice call — requests mic, connects WebSocket */
  start: () => Promise<void>;
  /** Stop the voice call — closes mic and WebSocket */
  stop: () => void;
  /** Whether the call is currently active */
  isActive: boolean;
  /** Current phase of the voice pipeline */
  phase: VoicePhase;
  /** Last transcribed text (what Nicolas said) */
  transcript: string;
  /** Manemus's response text */
  responseText: string;
  /** AnalyserNode for Manemus's voice (for 3D reactivity) */
  manemusAnalyser: AnalyserNode | null;
}

export function useVoiceCall(config?: VoiceCallConfig): UseVoiceCallReturn {
  const wsUrl = config?.wsUrl || resolveWsUrl();
  const vadThreshold = config?.vadThreshold || DEFAULT_VAD_THRESHOLD;
  const vadSilenceMs = config?.vadSilenceMs || DEFAULT_VAD_SILENCE_MS;

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>('idle');
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [manemusAnalyser, setManemusAnalyser] = useState<AnalyserNode | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const playbackRef = useRef<AudioPlayback | null>(null);
  const responseAccRef = useRef('');
  const phaseRef = useRef<VoicePhase>('idle');

  // VAD state
  const vadRafRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const silenceStartRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(vadRafRef.current);
      wsRef.current?.close();
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      playbackRef.current?.cleanup();
    };
  }, []);

  // ── Client-side VAD (energy-based with hysteresis) ─────────────────
  const startVAD = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Float32Array(analyser.fftSize);

    const loop = () => {
      // Only run VAD during listening phase
      if (phaseRef.current !== 'listening') {
        vadRafRef.current = requestAnimationFrame(loop);
        return;
      }

      analyser.getFloatTimeDomainData(dataArray);

      // Compute RMS energy
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);

      const now = performance.now();

      if (rms > vadThreshold) {
        // Speech detected
        if (!isSpeakingRef.current) {
          // Start recording
          isSpeakingRef.current = true;
          startRecording();
        }
        silenceStartRef.current = 0;
      } else if (isSpeakingRef.current) {
        // Below threshold while speaking — track silence duration
        if (silenceStartRef.current === 0) {
          silenceStartRef.current = now;
        } else if (now - silenceStartRef.current > vadSilenceMs) {
          // End of utterance — stop recording and send
          isSpeakingRef.current = false;
          silenceStartRef.current = 0;
          stopRecordingAndSend();
        }
      }

      vadRafRef.current = requestAnimationFrame(loop);
    };

    vadRafRef.current = requestAnimationFrame(loop);
  }, [vadThreshold, vadSilenceMs]);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    recordedChunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.start(100); // Small timeslice to accumulate chunks
  }, []);

  const stopRecordingAndSend = useCallback(async () => {
    const recorder = recorderRef.current;
    const ws = wsRef.current;
    if (!recorder || !ws || ws.readyState !== WebSocket.OPEN) return;

    // Stop recorder and wait for final data
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });

    const chunks = recordedChunksRef.current;
    if (chunks.length === 0) return;

    // Combine all chunks into single blob
    const blob = new Blob(chunks, { type: chunks[0].type });
    recordedChunksRef.current = [];

    if (blob.size < 1000) return; // Too small — likely just noise

    // Send complete utterance as single binary frame
    const buffer = await blob.arrayBuffer();
    setPhase('processing');
    ws.send(buffer);
  }, []);

  // ── WebSocket message handler ──────────────────────────────────────
  const handleWsMessage = useCallback((event: MessageEvent) => {
    if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
      // Binary = MP3 audio chunk from TTS
      const playback = playbackRef.current;
      if (!playback) return;
      if (event.data instanceof Blob) {
        event.data.arrayBuffer().then(buf => playback.appendChunk(buf));
      } else {
        playback.appendChunk(event.data);
      }
      return;
    }

    // Text = JSON control message
    try {
      const msg: VoiceServerMessage = JSON.parse(event.data);

      switch (msg.type) {
        case 'state':
          if (msg.phase) {
            setPhase(msg.phase as VoicePhase);
          }
          break;

        case 'transcript':
          if (msg.text) setTranscript(msg.text);
          break;

        case 'response_delta':
          if (msg.text) {
            responseAccRef.current += msg.text;
            setResponseText(responseAccRef.current);
          }
          break;

        case 'response':
          if (msg.text) setResponseText(msg.text);
          break;

        case 'audio_start': {
          // Prepare MSE playback for incoming MP3 stream
          responseAccRef.current = '';
          playbackRef.current?.prepareUtterance();
          break;
        }

        case 'audio_end': {
          // Signal end of MP3 stream
          playbackRef.current?.endStream();
          break;
        }
      }
    } catch {
      // Ignore malformed messages
    }
  }, []);

  // ── Start call ─────────────────────────────────────────────────────
  const start = useCallback(async () => {
    console.log('[VoiceCall] start() called, isActive:', isActive);
    if (isActive) return;

    try {
      // Request microphone
      console.log('[VoiceCall] Requesting microphone...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      console.log('[VoiceCall] Mic acquired, connecting WebSocket to', wsUrl);

      // Set up mic AnalyserNode for VAD
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Initialize MSE playback for Manemus voice
      const playback = new AudioPlayback();
      playbackRef.current = playback;
      const manemusNode = playback.init();
      setManemusAnalyser(manemusNode);

      // Connect WebSocket
      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onmessage = handleWsMessage;
      ws.onerror = () => console.error('[VoiceCall] WebSocket error');
      ws.onclose = () => {
        setIsActive(false);
        setPhase('idle');
      };

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => resolve();
        const onErr = () => reject(new Error('WebSocket connection failed'));
        ws.addEventListener('error', onErr, { once: true });
      });

      setIsActive(true);
      setPhase('listening');
      setTranscript('');
      setResponseText('');
      responseAccRef.current = '';

      console.log('[VoiceCall] Connected! Starting VAD...');
      // Start client-side VAD loop
      startVAD();

    } catch (err) {
      console.error('[VoiceCall] Failed to start:', err);
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      wsRef.current?.close();
      playbackRef.current?.cleanup();
      setIsActive(false);
      setPhase('idle');
    }
  }, [isActive, wsUrl, handleWsMessage, startVAD]);

  // ── Stop call ──────────────────────────────────────────────────────
  const stop = useCallback(() => {
    cancelAnimationFrame(vadRafRef.current);
    recorderRef.current?.stop();
    recorderRef.current = null;

    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;

    wsRef.current?.close();
    wsRef.current = null;

    playbackRef.current?.stop();

    isSpeakingRef.current = false;
    silenceStartRef.current = 0;
    setIsActive(false);
    setPhase('idle');
  }, []);

  return {
    start,
    stop,
    isActive,
    phase,
    transcript,
    responseText,
    manemusAnalyser,
  };
}
