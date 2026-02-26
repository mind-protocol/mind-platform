/** Voice call phase state machine */
export type VoicePhase = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

/** JSON messages from voice server → client */
export interface VoiceServerMessage {
  type: 'state' | 'transcript' | 'response' | 'response_delta' | 'audio_start' | 'audio_end';
  phase?: VoicePhase;
  text?: string;
  codec?: string;
}

/** Configuration for the voice call hook */
export interface VoiceCallConfig {
  /** WebSocket URL for voice server (default: ws://localhost:8766/voice/ws) */
  wsUrl?: string;
  /** RMS energy threshold to detect speech start (default: 0.015) */
  vadThreshold?: number;
  /** Silence duration (ms) before end-of-utterance (default: 600) */
  vadSilenceMs?: number;
}
