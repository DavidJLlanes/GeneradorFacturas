import type { DataSchema, DocumentData } from '../../core/document-type/types';
import type { Rect } from '../../core/geometry/rect';
import type { GuideLine } from '../snapping/guide-line';
import type { SnapPreferences } from '../snapping/snap-settings';
import type { Size, Viewport } from '../viewport/viewport';

// Estado de la interfaz del editor. No entra en el historial de deshacer.
export interface EditorUiState {
  selection: readonly string[];
  viewport: Viewport;
  containerSize: Size;
  snap: SnapPreferences;
  showGrid: boolean;
  showMargins: boolean;
  guides: readonly GuideLine[];
  marquee: Rect | null;
  panning: boolean;
  spaceHeld: boolean;
  /** Datos del documento (no entran en el historial de diseño). */
  data: DocumentData;
  schema: DataSchema | null;
  /** Cálculos del tipo: devuelve valores derivados (totales…) a partir de los datos. */
  compute: ((data: DocumentData) => DocumentData) | null;
  /** Mostrar las variables rellenas con los datos (true) o la plantilla limpia (false). */
  fillMode: boolean;
}

export const createInitialUiState = (): EditorUiState => ({
  selection: [],
  viewport: { zoom: 1, panX: 0, panY: 0 },
  containerSize: { w: 0, h: 0 },
  snap: { gridMm: 5, snapGrid: true, snapGuides: true },
  showGrid: true,
  showMargins: true,
  guides: [],
  marquee: null,
  panning: false,
  spaceHeld: false,
  data: {},
  schema: null,
  compute: null,
  fillMode: false,
});
