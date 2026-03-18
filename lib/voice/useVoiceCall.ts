'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { VoicePhase, VoiceCallConfig, VoiceServerMessage } from './types';
import { AudioPlayback } from './AudioPlayback';

const VOICE_WS_ENV = process.env.NEXT_PUBLIC_VOICE_WS_URL || '';
const MIND_HOME_URL = process.env.NEXT_PUBLIC_MIND_HOME_URL || 'https://api.mindprotocol.ai';

function resolveWsUrl(): string {
  // Explicit override (e.g. Cloudflare tunnel for testing)
  if (VOICE_WS_ENV) return VOICE_WS_ENV;
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'ws://localhost:8766/voice/ws';
    }
    // Production: derive WSS from Mind Home API host (nginx proxies /voice/ws → uvicorn)
    const host = MIND_HOME_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `wss://${host}/voice/ws`;
  }
  return 'ws://localhost:8766/voice/ws';
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
  /** Mind's response text */
  responseText: string;
  /** AnalyserNode for Mind's voice (for 3D reactivity) */
  mindAnalyser: AnalyserNode | null;
}

export function useVoiceCall(config?: VoiceCallConfig): UseVoiceCallReturn {
  const wsUrl = config?.wsUrl || resolveWsUrl();
  const vadThreshold = config?.vadThreshold || DEFAULT_VAD_THRESHOLD;
  const vadSilenceMs = config?.vadSilenceMs || DEFAULT_VAD_SILENCE_MS;

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>('idle');
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [mindAnalyser, setMindAnalyser] = useState<AnalyserNode | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const playbackRef = useRef<AudioPlayback | null>(null);
  const responseAccRef = useRef('');
  const phaseRef = useRef<VoicePhase>('idle');

  // Anti-double guard
  const connectingRef = useRef(false);

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
          if (msg.phase && msg.phase !== 'listening') {
            // Server-driven phase changes (except listening — we handle that after playback)
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
          // Signal end of MP3 stream, then wait for playback to finish
          const playback = playbackRef.current;
          if (playback) {
            playback.endStream();
            // Wait for audio element to finish playing before going back to listening
            playback.waitForPlaybackEnd().then(() => {
              setPhase('listening');
            });
          } else {
            setPhase('listening');
          }
          break;
        }
      }
    } catch {
      // Ignore malformed messages
    }
  }, []);

  // ── Cleanup existing connection ───────────────────────────────────
  const cleanupConnection = useCallback(() => {
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
  }, []);

  // ── Start call ─────────────────────────────────────────────────────
  const start = useCallback(async () => {
    // Anti-double: reject if already active or connecting
    if (isActive || connectingRef.current) return;
    // Guard: close any zombie WS
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      wsRef.current = null;
    }
    connectingRef.current = true;

    try {
      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Set up mic AnalyserNode for VAD
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Initialize MSE playback for Mind voice
      const playback = new AudioPlayback();
      playbackRef.current = playback;
      const mindNode = playback.init();
      setMindAnalyser(mindNode);

      // Connect WebSocket
      const ws = new WebSocket(wsUrl);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onmessage = handleWsMessage;
      ws.onerror = () => console.error('[VoiceCall] WebSocket error');
      ws.onclose = () => {
        connectingRef.current = false;
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

      connectingRef.current = false;
      // Start client-side VAD loop
      startVAD();

    } catch (err) {
      console.error('[VoiceCall] Failed to start:', err);
      cleanupConnection();
      connectingRef.current = false;
      setIsActive(false);
      setPhase('idle');
      throw err; // Re-throw so VoiceCallControls can show the error
    }
  }, [isActive, wsUrl, handleWsMessage, startVAD, cleanupConnection]);

  // ── Stop call ──────────────────────────────────────────────────────
  const stop = useCallback(() => {
    cleanupConnection();
    connectingRef.current = false;
    setIsActive(false);
    setPhase('idle');
  }, [cleanupConnection]);

  return {
    start,
    stop,
    isActive,
    phase,
    transcript,
    responseText,
    mindAnalyser,
  };
}
