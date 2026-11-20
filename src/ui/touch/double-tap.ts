// Los navegadores táctiles no envían `dblclick` cuando la zona tiene `touch-action: none` (la página).
// Esta pieza detecta el doble toque y lanza un `dblclick` de verdad, para que funcione la edición del
// texto directamente sobre la página igual que con el ratón.

export interface TapState {
  time: number;
  x: number;
  y: number;
}

export const DOUBLE_TAP_MS = 350;
export const DOUBLE_TAP_PX = 28;

// ¿Este toque, a continuación del anterior, forma un doble toque?
export function isDoubleTap(previous: TapState | null, now: TapState): boolean {
  return (
    previous !== null &&
    now.time - previous.time <= DOUBLE_TAP_MS &&
    Math.hypot(now.x - previous.x, now.y - previous.y) <= DOUBLE_TAP_PX
  );
}

export function attachDoubleTap(stage: HTMLElement): () => void {
  let previous: TapState | null = null;
  let down: { x: number; y: number; id: number } | null = null;

  const onDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse') return;
    down = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onUp = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' || !down || down.id !== e.pointerId) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10;
    down = null;
    if (moved) {
      previous = null;
      return;
    }
    const tap = { time: e.timeStamp, x: e.clientX, y: e.clientY };
    if (isDoubleTap(previous, tap)) {
      previous = null;
      e.target?.dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true, clientX: tap.x, clientY: tap.y }),
      );
    } else previous = tap;
  };

  stage.addEventListener('pointerdown', onDown);
  stage.addEventListener('pointerup', onUp);
  return () => {
    stage.removeEventListener('pointerdown', onDown);
    stage.removeEventListener('pointerup', onUp);
  };
}
