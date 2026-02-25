// Cockpit Core — unified consciousness dashboard runtime
export { useCockpitState, type CockpitState, type CockpitMode, type CockpitSignal } from '../hooks/useCockpitState';
export { createInputController, createDesktopController, createTouchController, createXRController, type Gesture, type GestureCallback, type InputController } from './InputController';
export { useInput, useGesture } from './useInput';
