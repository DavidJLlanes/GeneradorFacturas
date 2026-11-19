import type { DocumentModel } from '../../core/document/types';
import { mmToPx } from '../../core/units/units';
import { paletteOf } from '../../styles/palette';
import type { EditorUiState } from '../editor/editor-state';
import { createElementsLayer } from './elements-layer';
import type { ViewModel } from './view-model';

// Separación mínima entre líneas de rejilla (px de pantalla) por debajo de la cual se oculta.
const MIN_GRID_SPACING_PX = 4;

// Mundo transformado (zoom y desplazamiento): página, rejilla y elementos.
export function createWorldView(): {
  element: HTMLElement;
  update(doc: DocumentModel, ui: EditorUiState, model: ViewModel): void;
} {
  const world = document.createElement('div');
  world.className = 'cv-world';
  const page = document.createElement('div');
  page.className = 'cv-page';
  const grid = document.createElement('div');
  grid.className = 'cv-grid';
  const elements = createElementsLayer();
  const margins = document.createElement('div');
  margins.className = 'cv-margins';
  page.append(grid, margins, elements.element);
  world.append(page);

  return {
    element: world,
    update(doc, ui, model) {
      const { zoom, panX, panY } = ui.viewport;
      world.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
      world.style.setProperty('--zoom', String(zoom));
      page.style.width = `${mmToPx(doc.page.widthMm)}px`;
      page.style.height = `${mmToPx(doc.page.heightMm)}px`;

      const spacing = mmToPx(ui.snap.gridMm);
      // Con datos se ve el documento tal cual saldrá: sin rejilla ni márgenes de ayuda.
      const helpers = !ui.fillMode;
      grid.style.display =
        helpers && ui.showGrid && spacing * zoom >= MIN_GRID_SPACING_PX ? 'block' : 'none';
      grid.style.backgroundSize = `${spacing}px ${spacing}px`;

      const m = doc.page.marginsMm;
      margins.style.display = helpers && ui.showMargins ? 'block' : 'none';
      margins.style.inset = `${mmToPx(m.top)}px ${mmToPx(m.right)}px ${mmToPx(m.bottom)}px ${mmToPx(m.left)}px`;

      elements.update(model.items, model.context, paletteOf(doc));
    },
  };
}
