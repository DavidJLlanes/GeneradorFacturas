import { clearCustomFonts } from '../../fonts/custom/custom-fonts';
import type { RecordStore } from './record';

// Borra todo lo guardado en este navegador: sesión, plantillas y fuentes propias en memoria.
export async function clearEverything(store: RecordStore): Promise<void> {
  await store.clear();
  clearCustomFonts();
}
