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
});
