import { applyRects } from '../../core/document/operations/update-rects';
import { alignElements, type AlignMode } from '../align/align';
import { distributeElements, type DistributeAxis } from '../align/distribute';
import type { Editor } from '../editor/create-editor';
import { boundsOf, transformableElements } from '../selection/selection-queries';
import { pageRect } from '../viewport/viewport';

// Un solo elemento se alinea con la página; varios, entre sí.
export function alignSelection(editor: Editor, mode: AlignMode): void {
  const doc = editor.doc();
  const items = transformableElements(doc, editor.ui.get().selection);
  if (items.length === 0) return;
  const reference =
    items.length === 1 ? pageRect(doc.page) : (boundsOf(items) ?? pageRect(doc.page));
  editor.apply(applyRects(doc, alignElements(items, mode, reference)));
}

export function distributeSelection(editor: Editor, axis: DistributeAxis): void {
  const doc = editor.doc();
  const items = transformableElements(doc, editor.ui.get().selection);
  editor.apply(applyRects(doc, distributeElements(items, axis)));
}
