import type { EditorUiState } from '../editor/editor-state';
import { pageToScreen } from '../viewport/viewport';

// Líneas guía magnéticas visibles mientras se arrastra.
export function updateGuidesOverlay(layer: HTMLElement, ui: EditorUiState): void {
  const nodes = ui.guides.map((guide) => {
    const node = document.createElement('div');
    node.className = `cv-guide cv-guide-${guide.axis}`;
    const at = pageToScreen(ui.viewport, { x: guide.posMm, y: guide.posMm });
    if (guide.axis === 'x') node.style.left = `${at.x}px`;
    else node.style.top = `${at.y}px`;
    return node;
  });
  layer.replaceChildren(...nodes);
}
