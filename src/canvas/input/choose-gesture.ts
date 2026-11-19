import type { Gesture, GestureContext } from '../gestures/gesture';
import { startMarqueeGesture } from '../gestures/marquee-gesture';
import { startMoveGesture } from '../gestures/move-gesture';
import { startPanGesture } from '../gestures/pan-gesture';
import { startResizeGesture } from '../gestures/resize-gesture';
import { hitTestElement } from '../selection/hit-test';
import { isHandleId } from '../transform/handles';
import { screenToPage } from '../viewport/viewport';
import { stagePoint } from './stage-point';

// Decide qué gesto empieza según dónde y cómo se pulsa.
export function chooseGesture(ctx: GestureContext, e: PointerEvent): Gesture | null {
  const { editor, stage } = ctx;
  const ui = editor.ui.get();
  const point = stagePoint(stage, e);

  if (e.button === 1 || ui.spaceHeld) return startPanGesture(ctx, point);

  const handle = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-handle]')?.dataset
    .handle;
  if (isHandleId(handle)) return startResizeGesture(ctx, handle, point);

  const hit = hitTestElement(editor.doc(), screenToPage(ui.viewport, point));
  if (hit) return startMoveGesture(ctx, point, hit.id, e.shiftKey || e.ctrlKey || e.metaKey);

  // En táctil, un dedo sobre zona vacía desplaza la vista; con ratón se dibuja el rectángulo de selección.
  if (e.pointerType === 'touch') return startPanGesture(ctx, point);
  return startMarqueeGesture(ctx, point, e.shiftKey);
}
