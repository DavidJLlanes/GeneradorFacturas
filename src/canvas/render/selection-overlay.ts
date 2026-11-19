import { rectOf } from '../../core/document/element-rect';
import type { DocumentModel } from '../../core/document/types';
import type { Rect } from '../../core/geometry/rect';
import type { EditorUiState } from '../editor/editor-state';
import { boundsOf, transformableElements } from '../selection/selection-queries';
import { HANDLE_IDS, handlePosition } from '../transform/handles';
import { rectToScreen } from '../viewport/viewport';

function box(className: string, r: Rect): HTMLElement {
  const node = document.createElement('div');
  node.className = className;
  node.style.left = `${r.x}px`;
  node.style.top = `${r.y}px`;
  node.style.width = `${r.w}px`;
  node.style.height = `${r.h}px`;
  return node;
}

// Contornos de la selección y tiradores, dibujados en píxeles de pantalla (tamaño fijo con cualquier zoom).
export function updateSelectionOverlay(
  layer: HTMLElement,
  doc: DocumentModel,
  ui: EditorUiState,
): void {
  const nodes: HTMLElement[] = [];

  for (const el of doc.elements) {
    if (!ui.selection.includes(el.id) || el.hidden) continue;
    const outline = box('cv-sel', rectToScreen(ui.viewport, rectOf(el)));
    outline.classList.toggle('is-locked', el.locked);
    nodes.push(outline);
  }

  const bounds = boundsOf(transformableElements(doc, ui.selection));
  if (bounds) {
    const screen = rectToScreen(ui.viewport, bounds);
    nodes.push(box('cv-sel-box', screen));
    if (!ui.panning) {
      for (const id of HANDLE_IDS) {
        const { fx, fy } = handlePosition(id);
        const handle = document.createElement('div');
        handle.className = 'cv-handle';
        handle.dataset.handle = id;
        handle.style.left = `${screen.x + fx * screen.w}px`;
        handle.style.top = `${screen.y + fy * screen.h}px`;
        nodes.push(handle);
      }
    }
  }

  layer.replaceChildren(...nodes);
}
