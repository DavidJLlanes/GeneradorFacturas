import type { Editor } from '../editor/create-editor';
import { viewModelOf } from '../render/view-model';

// Cambia de página en la vista "Con datos" (la plantilla limpia siempre tiene una).
export function goToPage(editor: Editor, index: number): void {
  const { pageCount } = viewModelOf(editor);
  const next = Math.min(Math.max(0, index), pageCount - 1);
  if (next === editor.ui.get().pageIndex) return;
  editor.ui.update((s) => ({ ...s, pageIndex: next }));
}

export const nextPage = (editor: Editor): void =>
  goToPage(editor, viewModelOf(editor).pageIndex + 1);

export const previousPage = (editor: Editor): void =>
  goToPage(editor, viewModelOf(editor).pageIndex - 1);
