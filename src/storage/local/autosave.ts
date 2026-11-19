import type { Editor } from '../../canvas/editor/create-editor';
import { saveCurrent } from './records';
import type { RecordStore } from './record';

// Guarda la sesión sola poco después de cada cambio de diseño o de datos. Los cambios de
// interfaz (selección, zoom…) no cuentan. Devuelve una función para parar el autoguardado.
export function attachAutosave(
  editor: Editor,
  typeId: string,
  store: RecordStore,
  delayMs = 800,
): () => void {
  let lastDoc = editor.doc();
  let lastData = editor.ui.get().data;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = (): void => {
    timer = null;
    void saveCurrent(store, editor, typeId).catch(() => undefined);
  };

  const off = editor.onChange(() => {
    const doc = editor.doc();
    const data = editor.ui.get().data;
    if (doc === lastDoc && data === lastData) return;
    lastDoc = doc;
    lastData = data;
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, delayMs);
  });
  const onHide = (): void => {
    if (timer) {
      clearTimeout(timer);
      flush();
    }
  };
  window.addEventListener('pagehide', onHide);

  return () => {
    off();
    window.removeEventListener('pagehide', onHide);
    if (timer) clearTimeout(timer);
  };
}
