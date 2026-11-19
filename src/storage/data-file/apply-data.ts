import type { Editor } from '../../canvas/editor/create-editor';
import type { DataFile } from './data-file';

// Carga unos datos en el editor y pasa a la vista con datos.
export function applyData(editor: Editor, file: DataFile): void {
  editor.ui.update((s) => ({
    ...s,
    data: file.datos,
    fillMode: true,
    selection: [],
    pageIndex: 0,
  }));
}
