import type { Editor } from '../../canvas/editor/create-editor';
import { transformableElements } from '../../canvas/selection/selection-queries';

export const hasSelection = (editor: Editor): boolean => editor.ui.get().selection.length > 0;

export const transformableCount = (editor: Editor): number =>
  transformableElements(editor.doc(), editor.ui.get().selection).length;

export const canTransform = (editor: Editor): boolean => transformableCount(editor) >= 1;
export const canDistribute = (editor: Editor): boolean => transformableCount(editor) >= 3;
