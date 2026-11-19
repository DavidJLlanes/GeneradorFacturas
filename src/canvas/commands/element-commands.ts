import { rectOf } from '../../core/document/element-rect';
import { addElement } from '../../core/document/operations/add-element';
import { duplicateElements } from '../../core/document/operations/duplicate-elements';
import { removeElements } from '../../core/document/operations/remove-elements';
import { applyRects } from '../../core/document/operations/update-rects';
import { translateRect, type Rect } from '../../core/geometry/rect';
import type { Editor } from '../editor/create-editor';
import { transformableElements } from '../selection/selection-queries';

export function addTestBox(editor: Editor): void {
  const doc = editor.doc();
  const n = doc.elements.length + 1;
  const w = 40;
  const h = 25;
  const rect: Rect = {
    x: (doc.page.widthMm - w) / 2 + (n % 5) * 5,
    y: (doc.page.heightMm - h) / 2 + (n % 5) * 5,
    w,
    h,
  };
  const { doc: next, id } = addElement(doc, rect, `Caja ${n}`);
  editor.apply(next);
  editor.select([id]);
}

export function deleteSelection(editor: Editor): void {
  const doc = editor.doc();
  const ids = doc.elements
    .filter((e) => editor.ui.get().selection.includes(e.id) && !e.locked)
    .map((e) => e.id);
  if (ids.length > 0) editor.apply(removeElements(doc, ids));
}

export function duplicateSelection(editor: Editor): void {
  const selection = editor.ui.get().selection;
  if (selection.length === 0) return;
  const { doc, newIds } = duplicateElements(editor.doc(), selection);
  if (newIds.length === 0) return;
  editor.apply(doc);
  editor.select(newIds);
}

export function selectAll(editor: Editor): void {
  editor.select(
    editor
      .doc()
      .elements.filter((e) => !e.locked && !e.hidden)
      .map((e) => e.id),
  );
}

export function clearSelection(editor: Editor): void {
  editor.select([]);
}

export function nudgeSelection(editor: Editor, dxMm: number, dyMm: number): void {
  const doc = editor.doc();
  const items = transformableElements(doc, editor.ui.get().selection);
  const rects = new Map(items.map((e) => [e.id, translateRect(rectOf(e), dxMm, dyMm)]));
  editor.apply(applyRects(doc, rects));
}
