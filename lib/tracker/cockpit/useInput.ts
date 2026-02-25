'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createInputController, type Gesture, type GestureCallback, type InputController } from './InputController';

/**
 * React hook for the unified input system.
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const onGesture = useCallback((g: Gesture) => {
 *     if (g.type === 'SWIPE' && g.dir === 'left') switchPanel('next');
 *     if (g.type === 'ZOOM') setZoom(prev => prev + g.delta);
 *     if (g.type === 'KEY' && g.key === 'Escape') close();
 *   }, []);
 *
 *   useInput(onGesture, containerRef);
 * }
 * ```
 */
export function useInput(
  onGesture: GestureCallback,
  targetRef?: React.RefObject<HTMLElement | null>,
) {
  const controllerRef = useRef<InputController | null>(null);
  const callbackRef = useRef(onGesture);
  callbackRef.current = onGesture;

  useEffect(() => {
    const target = targetRef?.current ?? undefined;
    const controller = createInputController(target);
    controllerRef.current = controller;

    const unsub = controller.on((g) => callbackRef.current(g));
    controller.start();

    return () => {
      unsub();
      controller.stop();
      controllerRef.current = null;
    };
  }, [targetRef]);

  return {
    get platform() { return controllerRef.current?.platform ?? 'desktop'; },
  };
}

/**
 * Hook for specific gesture types only.
 *
 * Usage:
 * ```tsx
 * useGesture('SWIPE', (g) => {
 *   if (g.dir === 'left') nextPanel();
 * });
 * ```
 */
export function useGesture<T extends Gesture['type']>(
  type: T,
  handler: (gesture: Extract<Gesture, { type: T }>) => void,
  targetRef?: React.RefObject<HTMLElement | null>,
) {
  const cb = useCallback((g: Gesture) => {
    if (g.type === type) {
      handler(g as Extract<Gesture, { type: T }>);
    }
  }, [type, handler]);

  useInput(cb, targetRef);
}
