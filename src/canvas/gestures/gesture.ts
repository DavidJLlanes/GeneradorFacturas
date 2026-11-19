import type { Point } from '../../core/geometry/rect';
import type { Editor } from '../editor/create-editor';

// Un gesto es una interacción con el puntero desde que empieza hasta que termina.
export interface Gesture {
  /** Gestos de dos dedos: terminan en cuanto se levanta uno. */
  readonly multiTouch?: boolean;
  move(e: PointerEvent): void;
  end(e: PointerEvent): void;
  cancel(): void;
}

export interface GestureContext {
  editor: Editor;
  stage: HTMLElement;
  /** Posiciones actuales de los punteros activos, en píxeles del escenario. */
  pointers: () => ReadonlyMap<number, Point>;
}

/** Distancia mínima en píxeles para considerar que hay arrastre y no un simple clic. */
export const DRAG_THRESHOLD_PX = 3;

/** Tamaño mínimo (mm) al redimensionar. */
export const MIN_SIZE_MM = 1;
