import type { Point } from '../../core/geometry/rect';
import type { Editor } from '../editor/create-editor';
import type { Gesture, GestureContext } from '../gestures/gesture';
import { createPinchGesture } from '../gestures/pinch-gesture';
import { chooseGesture } from './choose-gesture';
import { stagePoint } from './stage-point';

// Reparte los eventos del puntero (ratón, lápiz y táctil) entre los gestos.
export function attachPointerInput(editor: Editor, stage: HTMLElement): () => void {
  const pointers = new Map<number, Point>();
  let gesture: Gesture | null = null;
  const ctx: GestureContext = { editor, stage, pointers: () => pointers };

  const onDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 1) return;
    if (e.button === 1) e.preventDefault();
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, stagePoint(stage, e));
    if (pointers.size >= 2) {
      gesture?.cancel();
      gesture = createPinchGesture(ctx);
      return;
    }
    gesture = chooseGesture(ctx, e);
  };

  const onMove = (e: PointerEvent): void => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, stagePoint(stage, e));
    gesture?.move(e);
  };

  const onUp = (e: PointerEvent): void => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size === 0 || gesture?.multiTouch) {
      gesture?.end(e);
      gesture = null;
    }
  };

  const onCancel = (): void => {
    gesture?.cancel();
    gesture = null;
    pointers.clear();
  };

  stage.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointermove', onMove);
  stage.addEventListener('pointerup', onUp);
  stage.addEventListener('pointercancel', onCancel);
  return () => {
    stage.removeEventListener('pointerdown', onDown);
    stage.removeEventListener('pointermove', onMove);
    stage.removeEventListener('pointerup', onUp);
    stage.removeEventListener('pointercancel', onCancel);
  };
}
