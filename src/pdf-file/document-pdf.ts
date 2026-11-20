import type { EditorUiState } from '../canvas/editor/editor-state';
import type { DocumentModel } from '../core/document/types';
import { buildPrintRoot, planPrint, type PrintMode } from '../pdf/build-print-root';
import { renderPdf } from './render-pdf';

// PDF de un documento con los datos de `ui`, sin tocar lo que hay en pantalla: maqueta el documento
// fuera de la vista, lo convierte y lo retira.
export async function documentToPdf(
  doc: DocumentModel,
  ui: EditorUiState,
  mode: PrintMode = 'filled',
  title?: string,
): Promise<Uint8Array> {
  const root = buildPrintRoot(doc, planPrint(doc, ui, mode));
  document.body.append(root);
  try {
    return await renderPdf(root, doc.page, title ? { title } : {});
  } finally {
    root.remove();
  }
}
