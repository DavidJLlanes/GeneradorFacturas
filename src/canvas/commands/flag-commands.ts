import { setElementsFlag, type ElementFlag } from '../../core/document/operations/set-flag';
import type { Editor } from '../editor/create-editor';

function toggleFlag(editor: Editor, flag: ElementFlag): void {
  const selection = editor.ui.get().selection;
  if (selection.length === 0) return;
  const doc = editor.doc();
  const selected = doc.elements.filter((e) => selection.includes(e.id));
  const allOn = selected.every((e) => e[flag]);
  editor.apply(setElementsFlag(doc, selection, flag, !allOn));
  if (flag === 'hidden' && !allOn) editor.select([]);
}

export const toggleLockSelection = (editor: Editor): void => toggleFlag(editor, 'locked');
export const toggleHideSelection = (editor: Editor): void => toggleFlag(editor, 'hidden');

export function toggleElementFlag(editor: Editor, id: string, flag: ElementFlag): void {
  const doc = editor.doc();
  const el = doc.elements.find((e) => e.id === id);
  if (!el) return;
  editor.apply(setElementsFlag(doc, [id], flag, !el[flag]));
}
