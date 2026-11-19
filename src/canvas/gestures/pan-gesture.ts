import type { Point } from '../../core/geometry/rect';
import { stagePoint } from '../input/stage-point';
import type { Gesture, GestureContext } from './gesture';

// Desplaza la vista arrastrando (espacio + arrastrar, botón central o un dedo en táctil).
export function startPanGesture(ctx: GestureContext, start: Point): Gesture {
  const { editor, stage } = ctx;
  const origin = editor.ui.get().viewport;
  editor.ui.update((s) => ({ ...s, panning: true }));

  const stop = (): void => editor.ui.update((s) => ({ ...s, panning: false }));

  return {
    move(e) {
      const p = stagePoint(stage, e);
      editor.setViewport({
        ...editor.ui.get().viewport,
        panX: origin.panX + p.x - start.x,
        panY: origin.panY + p.y - start.y,
      });
    },
    end: stop,
    cancel: stop,
  };
}
