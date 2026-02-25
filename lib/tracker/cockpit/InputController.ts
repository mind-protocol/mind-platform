'use client';

/**
 * Unified input abstraction layer for the Consciousness Cockpit.
 *
 * Translates raw platform events (mouse, touch, XR hands/controllers)
 * into a single Gesture stream. The UI never listens to platform-specific
 * events — it only consumes Gestures.
 *
 * Desktop: mouse/trackpad/keyboard → Gesture
 * Mobile: touch → Gesture
 * Quest 3: hands/controllers → Gesture (via @react-three/xr, future)
 */

// ─── Gesture Types ─────────────────────────────────────────────────────

export type Gesture =
  | { type: 'SWIPE'; dir: 'left' | 'right' | 'up' | 'down'; strength: number }
  | { type: 'PINCH_START'; hand: 'left' | 'right' }
  | { type: 'PINCH_MOVE'; dx: number; dy: number; hand: 'left' | 'right' }
  | { type: 'PINCH_END'; hand: 'left' | 'right' }
  | { type: 'ZOOM'; delta: number }
  | { type: 'TAP'; x: number; y: number }
  | { type: 'LONG_PRESS'; x: number; y: number; duration: number }
  | { type: 'DRAG_START'; x: number; y: number }
  | { type: 'DRAG_MOVE'; dx: number; dy: number; x: number; y: number }
  | { type: 'DRAG_END'; x: number; y: number }
  | { type: 'KEY'; key: string; shift: boolean; ctrl: boolean; meta: boolean };

export type GestureCallback = (gesture: Gesture) => void;

// ─── Input Controller ──────────────────────────────────────────────────

export interface InputController {
  /** Subscribe to gestures. Returns unsubscribe function. */
  on(cb: GestureCallback): () => void;
  /** Start listening to platform events */
  start(): void;
  /** Stop listening and cleanup */
  stop(): void;
  /** Current platform */
  platform: 'desktop' | 'touch' | 'xr';
}

// ─── Desktop Controller ────────────────────────────────────────────────

const SWIPE_THRESHOLD = 50;   // px minimum for swipe detection
const LONG_PRESS_MS = 500;    // ms for long press detection
const SWIPE_TIME_LIMIT = 300; // ms max for a gesture to be considered swipe

export function createDesktopController(target?: HTMLElement): InputController {
  const listeners = new Set<GestureCallback>();
  const el = () => target || document.body;

  let dragState: {
    startX: number;
    startY: number;
    startTime: number;
    isDragging: boolean;
    longPressTimer: ReturnType<typeof setTimeout> | null;
  } | null = null;

  const emit = (g: Gesture) => {
    for (const cb of listeners) cb(g);
  };

  // ── Mouse handlers ──

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return; // left button only
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      isDragging: false,
      longPressTimer: setTimeout(() => {
        if (dragState && !dragState.isDragging) {
          emit({ type: 'LONG_PRESS', x: e.clientX, y: e.clientY, duration: LONG_PRESS_MS });
          dragState = null;
        }
      }, LONG_PRESS_MS),
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const dist = Math.hypot(dx, dy);

    if (!dragState.isDragging && dist > 5) {
      dragState.isDragging = true;
      if (dragState.longPressTimer) {
        clearTimeout(dragState.longPressTimer);
        dragState.longPressTimer = null;
      }
      emit({ type: 'DRAG_START', x: dragState.startX, y: dragState.startY });
    }

    if (dragState.isDragging) {
      emit({ type: 'DRAG_MOVE', dx, dy, x: e.clientX, y: e.clientY });
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!dragState) return;

    if (dragState.longPressTimer) {
      clearTimeout(dragState.longPressTimer);
    }

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const dist = Math.hypot(dx, dy);
    const elapsed = Date.now() - dragState.startTime;

    if (dragState.isDragging) {
      emit({ type: 'DRAG_END', x: e.clientX, y: e.clientY });

      // Check if the drag was actually a swipe (fast + long enough)
      if (elapsed < SWIPE_TIME_LIMIT && dist > SWIPE_THRESHOLD) {
        const strength = Math.min(1, dist / 300);
        if (Math.abs(dx) > Math.abs(dy)) {
          emit({ type: 'SWIPE', dir: dx > 0 ? 'right' : 'left', strength });
        } else {
          emit({ type: 'SWIPE', dir: dy > 0 ? 'down' : 'up', strength });
        }
      }
    } else if (dist < 5 && elapsed < LONG_PRESS_MS) {
      emit({ type: 'TAP', x: e.clientX, y: e.clientY });
    }

    dragState = null;
  };

  // ── Wheel (zoom) ──

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    // Normalize: trackpad pinch-to-zoom sends ctrlKey + deltaY
    const delta = e.ctrlKey
      ? -e.deltaY * 0.01  // pinch-to-zoom (trackpad)
      : -e.deltaY * 0.003; // scroll wheel
    emit({ type: 'ZOOM', delta });
  };

  // ── Keyboard ──

  const onKeyDown = (e: KeyboardEvent) => {
    // Don't capture when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    emit({
      type: 'KEY',
      key: e.key,
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      meta: e.metaKey,
    });
  };

  // ── Lifecycle ──

  let started = false;

  return {
    platform: 'desktop',

    on(cb) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },

    start() {
      if (started) return;
      started = true;
      const t = el();
      t.addEventListener('mousedown', onMouseDown, { passive: true });
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseup', onMouseUp, { passive: true });
      t.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('keydown', onKeyDown, { passive: true });
    },

    stop() {
      if (!started) return;
      started = false;
      const t = el();
      t.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      t.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      if (dragState?.longPressTimer) clearTimeout(dragState.longPressTimer);
      dragState = null;
    },
  };
}

// ─── Touch Controller ──────────────────────────────────────────────────

export function createTouchController(target?: HTMLElement): InputController {
  const listeners = new Set<GestureCallback>();
  const el = () => target || document.body;

  let touchState: {
    startX: number;
    startY: number;
    startTime: number;
    isDragging: boolean;
    longPressTimer: ReturnType<typeof setTimeout> | null;
    identifier: number;
  } | null = null;

  let pinchState: {
    initialDist: number;
    lastDist: number;
  } | null = null;

  const emit = (g: Gesture) => {
    for (const cb of listeners) cb(g);
  };

  const getTouchDist = (t1: Touch, t2: Touch) =>
    Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      pinchState = { initialDist: dist, lastDist: dist };
      emit({ type: 'PINCH_START', hand: 'right' });
      if (touchState?.longPressTimer) clearTimeout(touchState.longPressTimer);
      touchState = null;
      return;
    }

    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchState = {
        startX: t.clientX,
        startY: t.clientY,
        startTime: Date.now(),
        isDragging: false,
        identifier: t.identifier,
        longPressTimer: setTimeout(() => {
          if (touchState && !touchState.isDragging) {
            emit({ type: 'LONG_PRESS', x: t.clientX, y: t.clientY, duration: LONG_PRESS_MS });
            touchState = null;
          }
        }, LONG_PRESS_MS),
      };
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    // Pinch move
    if (e.touches.length === 2 && pinchState) {
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      const dx = dist - pinchState.lastDist;
      pinchState.lastDist = dist;
      emit({ type: 'PINCH_MOVE', dx: dx * 0.5, dy: 0, hand: 'right' });
      // Also emit zoom
      const zoomDelta = (dist - pinchState.initialDist) * 0.002;
      emit({ type: 'ZOOM', delta: zoomDelta });
      return;
    }

    if (!touchState || e.touches.length !== 1) return;
    const t = Array.from(e.touches).find(tt => tt.identifier === touchState!.identifier);
    if (!t) return;

    const dx = t.clientX - touchState.startX;
    const dy = t.clientY - touchState.startY;
    const dist = Math.hypot(dx, dy);

    if (!touchState.isDragging && dist > 10) {
      touchState.isDragging = true;
      if (touchState.longPressTimer) {
        clearTimeout(touchState.longPressTimer);
        touchState.longPressTimer = null;
      }
      emit({ type: 'DRAG_START', x: touchState.startX, y: touchState.startY });
    }

    if (touchState.isDragging) {
      emit({ type: 'DRAG_MOVE', dx, dy, x: t.clientX, y: t.clientY });
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    // Pinch end
    if (pinchState && e.touches.length < 2) {
      emit({ type: 'PINCH_END', hand: 'right' });
      pinchState = null;
      return;
    }

    if (!touchState) return;
    if (touchState.longPressTimer) clearTimeout(touchState.longPressTimer);

    const t = e.changedTouches[0];
    const dx = t.clientX - touchState.startX;
    const dy = t.clientY - touchState.startY;
    const dist = Math.hypot(dx, dy);
    const elapsed = Date.now() - touchState.startTime;

    if (touchState.isDragging) {
      emit({ type: 'DRAG_END', x: t.clientX, y: t.clientY });

      if (elapsed < SWIPE_TIME_LIMIT && dist > SWIPE_THRESHOLD) {
        const strength = Math.min(1, dist / 300);
        if (Math.abs(dx) > Math.abs(dy)) {
          emit({ type: 'SWIPE', dir: dx > 0 ? 'right' : 'left', strength });
        } else {
          emit({ type: 'SWIPE', dir: dy > 0 ? 'down' : 'up', strength });
        }
      }
    } else if (dist < 10 && elapsed < LONG_PRESS_MS) {
      emit({ type: 'TAP', x: t.clientX, y: t.clientY });
    }

    touchState = null;
  };

  let started = false;

  return {
    platform: 'touch',

    on(cb) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },

    start() {
      if (started) return;
      started = true;
      const t = el();
      t.addEventListener('touchstart', onTouchStart, { passive: true });
      t.addEventListener('touchmove', onTouchMove, { passive: true });
      t.addEventListener('touchend', onTouchEnd, { passive: true });
    },

    stop() {
      if (!started) return;
      started = false;
      const t = el();
      t.removeEventListener('touchstart', onTouchStart);
      t.removeEventListener('touchmove', onTouchMove);
      t.removeEventListener('touchend', onTouchEnd);
      if (touchState?.longPressTimer) clearTimeout(touchState.longPressTimer);
      touchState = null;
      pinchState = null;
    },
  };
}

// ─── XR Controller (stub — Quest 3 ready) ──────────────────────────────

/**
 * Stub for WebXR hand/controller input.
 * Will be implemented when @react-three/xr is integrated.
 *
 * Quest 3 hand tracking maps:
 * - Pinch (thumb+index) → PINCH_START/MOVE/END
 * - Swipe (palm sweep) → SWIPE
 * - Point + squeeze → TAP
 * - Distance hands apart → ZOOM
 */
export function createXRController(): InputController {
  const listeners = new Set<GestureCallback>();

  return {
    platform: 'xr',

    on(cb) {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },

    start() {
      // TODO: Connect to @react-three/xr hand tracking events
      // See: https://github.com/pmndrs/react-xr
      console.log('[InputController] XR stub — no hand tracking connected');
    },

    stop() {
      // noop
    },
  };
}

// ─── Auto-detect Platform ──────────────────────────────────────────────

export function createInputController(target?: HTMLElement): InputController {
  if (typeof window === 'undefined') {
    // SSR fallback
    return createDesktopController(target);
  }

  // Check for XR session (future)
  if (typeof navigator !== 'undefined' && 'xr' in navigator) {
    // Could check for active XR session, but for now default to desktop/touch
  }

  // Touch device detection
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch && window.innerWidth < 1024) {
    return createTouchController(target);
  }

  return createDesktopController(target);
}
