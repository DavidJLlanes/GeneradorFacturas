import {
  moveBackward,
  moveForward,
  moveToBack,
  moveToFront,
} from '../../core/document/operations/reorder';
import type { DocumentModel } from '../../core/document/types';
import type { Editor } from '../editor/create-editor';

type Reorder = (doc: DocumentModel, ids: readonly string[]) => DocumentModel;

const run = (editor: Editor, reorder: Reorder): void => {
  const selection = editor.ui.get().selection;
  if (selection.length > 0) editor.apply(reorder(editor.doc(), selection));
};

export const bringToFront = (editor: Editor): void => run(editor, moveToFront);
export const bringForward = (editor: Editor): void => run(editor, moveForward);
export const sendBackward = (editor: Editor): void => run(editor, moveBackward);
export const sendToBack = (editor: Editor): void => run(editor, moveToBack);
