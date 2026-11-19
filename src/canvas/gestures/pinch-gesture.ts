import type { Point } from '../../core/geometry/rect';
import { clampZoom } from '../viewport/viewport';
import type { Gesture, GestureContext } from './gesture';

interface PinchReading {
  mid: Point;
  dist: number;
}

// Zoom y desplazamiento con dos dedos: el punto central sigue a los dedos.
export function createPinchGesture(ctx: GestureContext): Gesture {
  const { editor } = ctx;

  const read = (): PinchReading | null => {
    const [a, b] = [...ctx.pointers().values()];
    if (!a || !b) return null;
    return {
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      dist: Math.hypot(a.x - b.x, a.y - b.y),
    };
  };

  const first = read();
  const origin = editor.ui.get().viewport;

  return {
    multiTouch: true,
    move() {
      const now = read();
      if (!now || !first || first.dist < 1) return;
      const zoom = clampZoom((origin.zoom * now.dist) / first.dist);
      const px = (first.mid.x - origin.panX) / origin.zoom;
      const py = (first.mid.y - origin.panY) / origin.zoom;
      editor.setViewport({ zoom, panX: now.mid.x - px * zoom, panY: now.mid.y - py * zoom });
    },
    end() {},
    cancel() {},
  };
}
