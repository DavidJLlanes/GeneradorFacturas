import type { Editor } from '../../canvas/editor/create-editor';
import { registerCustomFont } from '../../fonts/custom/custom-fonts';
import type { DesignFile } from './format';

// Abre un diseño en el editor como un paso más del historial (se puede deshacer). Los datos del
// documento no se tocan: el diseño y los datos viajan por separado.
export function applyDesign(editor: Editor, file: DesignFile): void {
  for (const font of file.fuentes) registerCustomFont(font);
  editor.apply(file.documento);
  editor.ui.update((s) => ({ ...s, selection: [], pageIndex: 0 }));
}
