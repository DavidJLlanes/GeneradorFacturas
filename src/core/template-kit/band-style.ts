import type { DocumentTemplate } from '../document-type/types';
import { piece, repeating } from './pieces';

// Piezas que se escriben en blanco al ponerlas sobre la banda (ids de los bloques de `blocks.ts`).
const ON_BAND = new Set(['titulo', 'numero']);

export interface BandOptions {
  id: string;
  name: string;
  /** Alto de la banda en mm. */
  height?: number;
}

// Variante «con banda»: toma una plantilla y le pone una banda de color a todo el ancho arriba, con
// el título y el número en blanco. No cambia la posición de nada; solo añade la banda por debajo.
export function bandStyle(base: DocumentTemplate, options: BandOptions): DocumentTemplate {
  const { page } = base.document;
  const band = repeating(
    piece('banda', 'Banda superior', 'shape', [0, 0, page.widthMm, options.height ?? 33], {
      fill: '@primary',
      bordered: false,
    }),
  );
  const elements = base.document.elements.map((el) =>
    ON_BAND.has(el.id) ? { ...el, props: { ...el.props, color: '@onPrimary' } } : el,
  );
  return {
    id: options.id,
    name: options.name,
    document: { ...base.document, elements: [band, ...elements] },
  };
}
