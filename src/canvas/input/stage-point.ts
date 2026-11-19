import type { Point } from '../../core/geometry/rect';

// Posición del puntero en píxeles relativos al escenario.
export function stagePoint(stage: HTMLElement, e: { clientX: number; clientY: number }): Point {
  const box = stage.getBoundingClientRect();
  return { x: e.clientX - box.left, y: e.clientY - box.top };
}
