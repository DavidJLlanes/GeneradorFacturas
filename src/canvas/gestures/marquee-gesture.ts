import { rectFromPoints, type Point } from '../../core/geometry/rect';
import { stagePoint } from '../input/stage-point';
import { elementsInRect } from '../selection/marquee';
import { mergeIds } from '../selection/selection-ops';
import { screenToPage } from '../viewport/viewport';
import { DRAG_THRESHOLD_PX, type Gesture, type GestureContext } from './gesture';

// Rectángulo de selección sobre zona vacía. Con shift se suma a la selección actual.
export function startMarqueeGesture(ctx: GestureContext, start: Point, additive: boolean): Gesture {
  const { editor, stage } = ctx;
  const initial = additive ? editor.ui.get().selection : [];
  let moved = false;

  const clearMarquee = (): void => editor.ui.update((s) => ({ ...s, marquee: null }));

  return {
    move(e) {
      const p = stagePoint(stage, e);
      if (!moved && Math.hypot(p.x - start.x, p.y - start.y) < DRAG_THRESHOLD_PX) return;
      moved = true;
      const vp = editor.ui.get().viewport;
      const rect = rectFromPoints(screenToPage(vp, start), screenToPage(vp, p));
      const inside = elementsInRect(editor.doc(), rect);
      editor.ui.update((s) => ({ ...s, marquee: rect, selection: mergeIds(initial, inside) }));
    },
    end() {
      if (!moved && !additive) editor.select([]);
      clearMarquee();
    },
    cancel: clearMarquee,
  };
}
