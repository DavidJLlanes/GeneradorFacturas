import type { Editor } from '../../canvas/editor/create-editor';
import { documentTypes } from '../../core/document-type/discover';
import type { DocumentData } from '../../core/document-type/types';
import { applyDesign } from '../design-file/apply-design';
import type { DesignFile } from '../design-file/format';
import { currentId } from '../local/record';
import { recordFromDesign } from '../local/records';
import { getSession } from './session-context';

export type OpenResult = 'here' | 'reload';

// Abre un diseño (y, si se dan, sus datos) en su tipo de documento.
// - Si es del tipo abierto: se aplica en el editor como un paso que se puede deshacer.
// - Si es de otro tipo: se deja como sesión de ese tipo y se recarga la página en él.
export async function openDesign(
  editor: Editor,
  file: DesignFile,
  data?: DocumentData,
): Promise<OpenResult> {
  const { typeId, store } = getSession();
  if (file.tipoDocumento === typeId) {
    applyDesign(editor, file);
    if (data) editor.ui.update((s) => ({ ...s, data, fillMode: true }));
    return 'here';
  }
  const other = documentTypes.get(file.tipoDocumento);
  if (!other)
    throw new Error(`Este diseño es de un tipo que no existe aquí («${file.tipoDocumento}»).`);
  await store.put(recordFromDesign(file, 'actual', currentId(other.id), data));
  window.location.hash = `#tipo=${other.id}${data ? '&vista=datos' : ''}`;
  window.location.reload();
  return 'reload';
}
