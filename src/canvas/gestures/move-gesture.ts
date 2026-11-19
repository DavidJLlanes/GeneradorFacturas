import { rectOf } from '../../core/document/element-rect';
import { applyRects } from '../../core/document/operations/update-rects';
import { translateRect, type Point, type Rect } from '../../core/geometry/rect';
import { stagePoint } from '../input/stage-point';
import { snapMove } from '../snapping/snap-move';
import { toSnapSettings } from '../snapping/snap-settings';
import { buildTargets } from '../snapping/targets';
import { toggleId } from '../selection/selection-ops';
import { boundsOf, transformableElements } from '../selection/selection-queries';
import { screenDeltaToMm } from '../viewport/viewport';
import { DRAG_THRESHOLD_PX, type Gesture, type GestureContext } from './gesture';

// Selecciona (o alterna con shift/ctrl) el elemento pulsado y lo mueve con imán a guías y rejilla.
export function startMoveGesture(
  ctx: GestureContext,
  start: Point,
  hitId: string,
  toggle: boolean,
): Gesture | null {
  const { editor, stage } = ctx;
  const current = editor.ui.get().selection;
  if (toggle) {
    const next = toggleId(current, hitId);
    editor.select(next);
    if (!next.includes(hitId)) return null;
  } else if (!current.includes(hitId)) {
    editor.select([hitId]);
  }

  const baseDoc = editor.doc();
  const movable = transformableElements(baseDoc, editor.ui.get().selection);
  const box = boundsOf(movable);
  if (!box) return null;

  const originals = new Map(movable.map((e) => [e.id, rectOf(e)]));
  const targets = buildTargets(
    baseDoc.elements.filter((e) => !originals.has(e.id) && !e.hidden).map(rectOf),
    baseDoc.page,
  );
  let moved = false;

  const clearGuides = (): void => editor.ui.update((s) => ({ ...s, guides: [] }));

  return {
    move(e) {
      const p = stagePoint(stage, e);
      if (!moved && Math.hypot(p.x - start.x, p.y - start.y) < DRAG_THRESHOLD_PX) return;
      if (!moved) {
        moved = true;
        editor.history.beginTransient();
      }
      const ui = editor.ui.get();
      let dx = screenDeltaToMm(ui.viewport, p.x - start.x);
      let dy = screenDeltaToMm(ui.viewport, p.y - start.y);
      if (e.shiftKey) {
        if (Math.abs(dx) > Math.abs(dy)) dy = 0;
        else dx = 0;
      }
      const snap = snapMove(
        translateRect(box, dx, dy),
        targets,
        toSnapSettings(ui.snap, ui.viewport.zoom),
      );
      dx += snap.dx;
      dy += snap.dy;
      const rects = new Map<string, Rect>();
      for (const [id, r] of originals) rects.set(id, translateRect(r, dx, dy));
      editor.history.setTransient(applyRects(baseDoc, rects));
      editor.ui.update((s) => ({ ...s, guides: snap.guides }));
    },
    end() {
      if (moved) editor.history.commitTransient();
      else if (!toggle && editor.ui.get().selection.length > 1) editor.select([hitId]);
      clearGuides();
    },
    cancel() {
      if (moved) editor.history.cancelTransient();
      clearGuides();
    },
  };
}
