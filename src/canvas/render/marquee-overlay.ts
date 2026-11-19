import type { EditorUiState } from '../editor/editor-state';
import { rectToScreen } from '../viewport/viewport';

export function updateMarqueeOverlay(layer: HTMLElement, ui: EditorUiState): void {
  if (!ui.marquee) {
    layer.replaceChildren();
    return;
  }
  const r = rectToScreen(ui.viewport, ui.marquee);
  const node = document.createElement('div');
  node.className = 'cv-marquee';
  node.style.left = `${r.x}px`;
  node.style.top = `${r.y}px`;
  node.style.width = `${r.w}px`;
  node.style.height = `${r.h}px`;
  layer.replaceChildren(node);
}
