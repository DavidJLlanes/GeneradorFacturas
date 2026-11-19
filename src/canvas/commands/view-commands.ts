import { rectOf } from '../../core/document/element-rect';
import { unionRect } from '../../core/geometry/rect';
import type { Editor } from '../editor/create-editor';
import { fitRect, pageRect, zoomAround } from '../viewport/viewport';

const SELECTION_PADDING_PX = 80;

function stageCenter(editor: Editor) {
  const { w, h } = editor.ui.get().containerSize;
  return { x: w / 2, y: h / 2 };
}

export function zoomTo(editor: Editor, zoom: number): void {
  const { viewport } = editor.ui.get();
  editor.setViewport(zoomAround(viewport, stageCenter(editor), zoom));
}

export function zoomBy(editor: Editor, factor: number): void {
  zoomTo(editor, editor.ui.get().viewport.zoom * factor);
}

export const zoomIn = (editor: Editor): void => zoomBy(editor, 1.25);
export const zoomOut = (editor: Editor): void => zoomBy(editor, 1 / 1.25);
export const zoomTo100 = (editor: Editor): void => zoomTo(editor, 1);

export function zoomToFit(editor: Editor): void {
  const { w, h } = editor.ui.get().containerSize;
  if (w <= 0 || h <= 0) return;
  editor.setViewport(fitRect({ w, h }, pageRect(editor.doc().page)));
}

// Zoom al detalle: encuadra la selección para editar zonas pequeñas.
export function zoomToSelection(editor: Editor): void {
  const { containerSize, selection } = editor.ui.get();
  const doc = editor.doc();
  const bounds = unionRect(doc.elements.filter((e) => selection.includes(e.id)).map(rectOf));
  if (!bounds || containerSize.w <= 0 || containerSize.h <= 0) return zoomToFit(editor);
  editor.setViewport(fitRect(containerSize, bounds, SELECTION_PADDING_PX));
}
