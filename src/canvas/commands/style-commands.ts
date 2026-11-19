import { paletteOf, samePalette, type Palette } from '../../styles/palette';
import type { Editor } from '../editor/create-editor';

// Cambia la paleta del documento como un único paso del historial. Todas las piezas enlazadas a la
// paleta (`@principal`…) se recolorean; las que tienen un color propio no cambian.
export function setPalette(editor: Editor, palette: Palette): void {
  const doc = editor.doc();
  if (samePalette(paletteOf(doc), palette)) return;
  editor.apply({ ...doc, palette });
}
