import type { Editor } from '../canvas/editor/create-editor';
import { buildPrintRoot, planPrint, type PrintMode } from './build-print-root';

let root: HTMLElement | null = null;
let lastMode: PrintMode = 'filled';

const clear = (): void => {
  root?.remove();
  root = null;
};

function prepare(editor: Editor, mode: PrintMode): void {
  clear();
  lastMode = mode;
  const doc = editor.doc();
  root = buildPrintRoot(doc, planPrint(doc, editor.ui.get(), mode));
  document.body.append(root);
}

// Cuántas páginas tendrá lo que se va a imprimir.
export const pageCountFor = (editor: Editor, mode: PrintMode): number =>
  planPrint(editor.doc(), editor.ui.get(), mode).pages.length;

// Abre el diálogo de impresión del navegador con el documento listo; ahí se elige "Guardar como PDF".
// El PDF es vectorial: el texto se puede seleccionar y las fuentes van incrustadas.
export async function printDocument(editor: Editor, mode: PrintMode): Promise<void> {
  prepare(editor, mode);
  await document.fonts.ready;
  const images = [...(root?.querySelectorAll('img') ?? [])];
  await Promise.all(images.map((img) => img.decode().catch(() => undefined)));
  window.print();
}

// Prepara y retira el documento imprimible alrededor de cualquier impresión (también con Ctrl+P).
export function attachPrint(editor: Editor): () => void {
  const onBefore = (): void => {
    if (!root) prepare(editor, lastMode);
  };
  window.addEventListener('beforeprint', onBefore);
  window.addEventListener('afterprint', clear);
  return () => {
    window.removeEventListener('beforeprint', onBefore);
    window.removeEventListener('afterprint', clear);
    clear();
  };
}
