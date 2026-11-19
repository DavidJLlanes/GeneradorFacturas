import { rectOf } from '../../core/document/element-rect';
import { applyRects } from '../../core/document/operations/update-rects';
import type { Point } from '../../core/geometry/rect';
import { stagePoint } from '../input/stage-point';
import type { GuideLine } from '../snapping/guide-line';
import { snapResize } from '../snapping/snap-resize';
import { toSnapSettings } from '../snapping/snap-settings';
import { buildTargets } from '../snapping/targets';
import { boundsOf, transformableElements } from '../selection/selection-queries';
import type { HandleId } from '../transform/handles';
import { resizeRect } from '../transform/resize-rect';
import { mapRectsBetweenBoxes } from '../transform/scale-rects';
import { screenDeltaToMm } from '../viewport/viewport';
import { DRAG_THRESHOLD_PX, MIN_SIZE_MM, type Gesture, type GestureContext } from './gesture';

// Redimensiona la selección con un tirador. Shift mantiene la proporción; Alt escala desde el centro.
export function startResizeGesture(
  ctx: GestureContext,
  handle: HandleId,
  start: Point,
): Gesture | null {
  const { editor, stage } = ctx;
  const baseDoc = editor.doc();
  const items = transformableElements(baseDoc, editor.ui.get().selection);
  const box = boundsOf(items);
  if (!box) return null;

  const originals = new Map(items.map((e) => [e.id, rectOf(e)]));
  const targets = buildTargets(
    baseDoc.elements.filter((e) => !originals.has(e.id) && !e.hidden).map(rectOf),
    baseDoc.page,
  );
  let started = false;

  const clearGuides = (): void => editor.ui.update((s) => ({ ...s, guides: [] }));

  return {
    move(e) {
      const p = stagePoint(stage, e);
      if (!started && Math.hypot(p.x - start.x, p.y - start.y) < DRAG_THRESHOLD_PX) return;
      if (!started) {
        started = true;
        editor.history.beginTransient();
      }
      const ui = editor.ui.get();
      const dx = screenDeltaToMm(ui.viewport, p.x - start.x);
      const dy = screenDeltaToMm(ui.viewport, p.y - start.y);
      const options = { keepRatio: e.shiftKey, fromCenter: e.altKey, minSizeMm: MIN_SIZE_MM };

      let next = resizeRect(box, handle, dx, dy, options);
      let guides: GuideLine[] = [];
      if (!options.keepRatio && !options.fromCenter) {
        const snapped = snapResize(
          next,
          handle,
          targets,
          toSnapSettings(ui.snap, ui.viewport.zoom),
          MIN_SIZE_MM,
        );
        next = snapped.rect;
        guides = snapped.guides;
      }
      editor.history.setTransient(applyRects(baseDoc, mapRectsBetweenBoxes(originals, box, next)));
      editor.ui.update((s) => ({ ...s, guides }));
    },
    end() {
      if (started) editor.history.commitTransient();
      clearGuides();
    },
    cancel() {
      if (started) editor.history.cancelTransient();
      clearGuides();
    },
  };
}
