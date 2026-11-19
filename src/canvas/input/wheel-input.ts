import type { Editor } from '../editor/create-editor';
import { zoomAround } from '../viewport/viewport';
import { stagePoint } from './stage-point';

// Rueda: desplaza la vista. Ctrl/⌘ + rueda (o pellizco en el panel táctil): zoom bajo el cursor.
export function attachWheelInput(editor: Editor, stage: HTMLElement): () => void {
  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const { viewport } = editor.ui.get();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? stage.clientHeight : 1;
    const dx = e.deltaX * unit;
    const dy = e.deltaY * unit;

    if (e.ctrlKey || e.metaKey) {
      // Una muesca de ratón es grande (≈100); el pellizco del panel táctil, pequeño.
      const sensitivity = Math.abs(dy) >= 40 ? 0.0025 : 0.01;
      const zoom = viewport.zoom * Math.exp(-dy * sensitivity);
      editor.setViewport(zoomAround(viewport, stagePoint(stage, e), zoom));
      return;
    }

    const horizontal = e.shiftKey && dx === 0;
    editor.setViewport({
      ...viewport,
      panX: viewport.panX - (horizontal ? dy : dx),
      panY: viewport.panY - (horizontal ? 0 : dy),
    });
  };

  stage.addEventListener('wheel', onWheel, { passive: false });
  return () => stage.removeEventListener('wheel', onWheel);
}
