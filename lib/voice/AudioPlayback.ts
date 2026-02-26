/**
 * AudioPlayback — MSE-based MP3 streaming playback.
 *
 * Uses MediaSource Extensions with an <audio> element for reliable MP3
 * chunk playback. Exposes an AnalyserNode via createMediaElementSource
 * for real-time 3D visualization.
 */

export class AudioPlayback {
  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private pendingChunks: ArrayBuffer[] = [];
  private sourceOpen = false;
  private ended = false;
  private playbackEndResolve: (() => void) | null = null;

  /** Get the AnalyserNode for 3D visualization */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /** Initialize the playback pipeline. Call once on voice call start. */
  init(): AnalyserNode | null {
    this.cleanup();

    // Audio element
    this.audioEl = new Audio();
    this.audioEl.autoplay = true;

    // AudioContext + AnalyserNode for 3D reactivity
    this.ctx = new AudioContext({ sampleRate: 44100 });
    const source = this.ctx.createMediaElementSource(this.audioEl);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.6;
    source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    return this.analyser;
  }

  /** Prepare for a new utterance — set up MediaSource */
  prepareUtterance() {
    if (!this.audioEl) return;

    this.pendingChunks = [];
    this.ended = false;
    this.sourceOpen = false;
    this.sourceBuffer = null;
    this.playbackEndResolve = null;

    // Resume AudioContext if suspended (browser policy)
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }

    this.mediaSource = new MediaSource();
    this.audioEl.src = URL.createObjectURL(this.mediaSource);

    this.mediaSource.addEventListener('sourceopen', () => {
      if (!this.mediaSource) return;
      try {
        this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');
        this.sourceBuffer.mode = 'sequence';
        this.sourceBuffer.addEventListener('updateend', () => this.flushPending());
        this.sourceOpen = true;
        this.flushPending();
      } catch (e) {
        console.error('[AudioPlayback] addSourceBuffer failed:', e);
      }
    }, { once: true });
  }

  /** Append an MP3 chunk */
  appendChunk(chunk: ArrayBuffer) {
    this.pendingChunks.push(chunk);
    this.flushPending();
  }

  /** Signal that all chunks have been sent */
  endStream() {
    this.ended = true;
    this.flushPending();
  }

  /**
   * Returns a promise that resolves when the audio element finishes playing.
   * Call after endStream() to wait for full playback before transitioning state.
   */
  waitForPlaybackEnd(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.audioEl) { resolve(); return; }

      // If audio already ended or paused with nothing to play
      if (this.audioEl.ended || (this.audioEl.paused && this.ended && this.pendingChunks.length === 0)) {
        resolve();
        return;
      }

      this.playbackEndResolve = resolve;

      // Listen for the 'ended' event from the audio element
      this.audioEl.addEventListener('ended', () => {
        if (this.playbackEndResolve) {
          this.playbackEndResolve();
          this.playbackEndResolve = null;
        }
      }, { once: true });

      // Safety timeout: resolve after 60s max to prevent hanging
      setTimeout(() => {
        if (this.playbackEndResolve) {
          console.warn('[AudioPlayback] Playback timeout — forcing resolve');
          this.playbackEndResolve();
          this.playbackEndResolve = null;
        }
      }, 60000);
    });
  }

  /** Stop playback immediately */
  stop() {
    // Resolve any pending playback wait
    if (this.playbackEndResolve) {
      this.playbackEndResolve();
      this.playbackEndResolve = null;
    }

    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    this.pendingChunks = [];
    this.ended = true;
    this.tryEndOfStream();
  }

  /** Full cleanup */
  cleanup() {
    this.stop();
    if (this.audioEl) {
      this.audioEl.src = '';
      this.audioEl = null;
    }
    if (this.mediaSource) {
      this.mediaSource = null;
    }
    this.sourceBuffer = null;
    this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
  }

  private flushPending() {
    if (!this.sourceBuffer || !this.sourceOpen) return;
    if (this.sourceBuffer.updating) return;

    if (this.pendingChunks.length > 0) {
      const chunk = this.pendingChunks.shift()!;
      try {
        this.sourceBuffer.appendBuffer(chunk);
      } catch (e) {
        // QuotaExceededError or InvalidStateError — skip chunk
        console.warn('[AudioPlayback] appendBuffer error:', e);
        // Try next chunk
        this.flushPending();
      }
    } else if (this.ended) {
      this.tryEndOfStream();
    }
  }

  private tryEndOfStream() {
    if (!this.mediaSource || this.mediaSource.readyState !== 'open') return;
    if (this.sourceBuffer?.updating) return;
    if (this.pendingChunks.length > 0) return;
    try {
      this.mediaSource.endOfStream();
    } catch {
      // Already ended or not open
    }
  }
}
