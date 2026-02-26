/* ── Camera Frame Analyzer ────────────────────────────────────────
 *
 * Captures frames from webcam / phone camera at low resolution,
 * computes ambient luminance and color temperature.
 *
 * Used by the skybox intelligence layer to:
 *   - Detect indoor vs outdoor
 *   - Adapt veil opacity to real-world brightness
 *   - Tint procedural sky to match ambient light
 *
 * Minimal resource usage: 160×120 @ 1fps, samples every 4th pixel.
 * ─────────────────────────────────────────────────────────────────── */

import type { CameraAnalysis } from './types';

const DEFAULT_ANALYSIS: CameraAnalysis = {
  luminance: 0.5,
  brightness: 128,
  colorTempK: 6500,
  dominantRGB: [128, 128, 128],
  isAvailable: false,
  lastCapture: 0,
};

export class CameraAnalyzerEngine {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private analysis: CameraAnalysis = { ...DEFAULT_ANALYSIS };
  private onUpdate: ((a: CameraAnalysis) => void) | null = null;

  /** Start capturing from the specified camera. Returns true if successful. */
  async start(
    onUpdate: (a: CameraAnalysis) => void,
    facingMode: 'user' | 'environment' = 'environment',
    intervalMs = 5000,
  ): Promise<boolean> {
    this.onUpdate = onUpdate;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 160 },
          height: { ideal: 120 },
          frameRate: { ideal: 1, max: 5 },
        },
        audio: false,
      });

      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.playsInline = true;
      this.video.muted = true;
      await this.video.play();

      this.canvas = document.createElement('canvas');
      this.canvas.width = this.video.videoWidth || 160;
      this.canvas.height = this.video.videoHeight || 120;
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;

      // Immediate first capture
      this.captureAndAnalyze();

      // Periodic captures
      this.intervalId = setInterval(() => this.captureAndAnalyze(), intervalMs);

      return true;
    } catch (err) {
      console.warn('[CameraAnalyzer] Camera not available:', err);
      return false;
    }
  }

  /** Stop capturing and release the camera. */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    this.analysis = { ...DEFAULT_ANALYSIS };
  }

  /** Get the latest analysis snapshot. */
  getAnalysis(): CameraAnalysis {
    return this.analysis;
  }

  private captureAndAnalyze() {
    if (!this.video || !this.ctx || !this.canvas) return;
    if (this.video.readyState < 2) return;

    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    this.analysis = analyzeFrame(imageData);
    this.onUpdate?.(this.analysis);
  }
}

/* ── Frame analysis ──────────────────────────────────────────────── */

function analyzeFrame(imageData: ImageData): CameraAnalysis {
  const data = imageData.data;
  const len = data.length;
  let r = 0, g = 0, b = 0, count = 0;

  // Sample every 4th pixel (stride 16 bytes) for performance
  for (let i = 0; i < len; i += 16) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  const avgR = r / count;
  const avgG = g / count;
  const avgB = b / count;

  // WCAG relative luminance
  const linearize = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * linearize(avgR) +
    0.7152 * linearize(avgG) +
    0.0722 * linearize(avgB);

  // Perceived brightness (BT.601)
  const brightness = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

  // Correlated Color Temperature
  const colorTempK = rgbToColorTemp(avgR, avgG, avgB);

  return {
    luminance,
    brightness,
    colorTempK,
    dominantRGB: [Math.round(avgR), Math.round(avgG), Math.round(avgB)],
    isAvailable: true,
    lastCapture: Date.now(),
  };
}

/* ── McCamy CCT approximation ─── RGB → XYZ → xy → CCT ────────── */

function rgbToColorTemp(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r), G = lin(g), B = lin(b);

  // sRGB → CIE XYZ (D65)
  const X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B;
  const Y = 0.2126729 * R + 0.7151522 * G + 0.0721750 * B;
  const Z = 0.0193339 * R + 0.1191920 * G + 0.9503041 * B;

  const sum = X + Y + Z;
  if (sum === 0) return 6500; // fallback to D65

  const x = X / sum;
  const y = Y / sum;

  // McCamy's formula (accurate 2000K–12000K)
  const n = (x - 0.332) / (0.1858 - y);
  const CCT = 449 * n ** 3 + 3525 * n ** 2 + 6823.3 * n + 5520.33;

  return Math.round(Math.max(1000, Math.min(40000, CCT)));
}
