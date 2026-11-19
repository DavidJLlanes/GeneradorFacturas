import type { Editor } from '../editor/create-editor';

export const undo = (editor: Editor): void => void editor.history.undo();
export const redo = (editor: Editor): void => void editor.history.redo();
