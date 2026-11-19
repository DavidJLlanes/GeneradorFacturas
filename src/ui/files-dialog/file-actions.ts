import type { Editor } from '../../canvas/editor/create-editor';
import { applyData } from '../../storage/data-file/apply-data';
import {
  buildDataFile,
  dataToJson,
  DATA_EXTENSION,
  parseDataFile,
} from '../../storage/data-file/data-file';
import { buildDesign, designToJson } from '../../storage/design-file/build-design';
import { DESIGN_EXTENSION } from '../../storage/design-file/format';
import { parseDesign } from '../../storage/design-file/parse-design';
import { downloadText } from '../../storage/files/download-text';
import { fileSlug } from '../../storage/files/file-name';
import { pickTextFile } from '../../storage/files/pick-text-file';
import { openDesign } from '../../storage/session/open-design';
import { getSession } from '../../storage/session/session-context';

// Acciones de archivo del diálogo. Devuelven el mensaje que se muestra al usuario.

export function exportDesign(editor: Editor, name: string): string {
  const { typeId } = getSession();
  const title = name.trim() || 'Diseño';
  downloadText(
    fileSlug(title, 'diseno') + DESIGN_EXTENSION,
    designToJson(buildDesign(editor.doc(), typeId, title)),
  );
  return 'Diseño guardado en un archivo (sin datos).';
}

export async function importDesign(editor: Editor): Promise<string> {
  const picked = await pickTextFile('.json,application/json');
  if (!picked) return '';
  const file = parseDesign(picked.text);
  const result = await openDesign(editor, file);
  return result === 'here'
    ? `Diseño «${file.nombre}» abierto. Se puede deshacer.`
    : 'Abriendo el diseño en su tipo de documento…';
}

export function exportData(editor: Editor): string {
  const { typeId } = getSession();
  downloadText(
    `datos-${typeId}${DATA_EXTENSION}`,
    dataToJson(buildDataFile(editor.ui.get().data, typeId)),
  );
  return 'Datos guardados en un archivo.';
}

export async function importData(editor: Editor): Promise<string> {
  const picked = await pickTextFile('.json,application/json');
  if (!picked) return '';
  const file = parseDataFile(picked.text);
  if (file.tipoDocumento !== getSession().typeId) {
    throw new Error(`Estos datos son de otro tipo de documento («${file.tipoDocumento}»).`);
  }
  applyData(editor, file);
  return 'Datos cargados.';
}
