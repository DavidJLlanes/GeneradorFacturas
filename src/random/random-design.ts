import type {
  DocumentTemplate,
  DocumentTypeDefinition,
  DocumentData,
} from '../core/document-type/types';
import { FONTS, type FontEntry } from '../fonts/catalog';
import { THEMES } from '../styles/themes';
import { generateData } from './fake-data';
import type { Rng } from './rng';

export interface RandomDesign {
  template: DocumentTemplate;
  data: DocumentData;
  /** Descripción corta de lo que se ha elegido, para mostrarla al usuario. */
  summary: string;
}

// Fuentes aptas para un documento: sin letra manuscrita ni de rótulo, y con negrita disponible.
const SAFE_FONTS: readonly FontEntry[] = FONTS.filter(
  (f) => (f.category === 'sans' || f.category === 'serif') && f.styles.includes('700'),
);

// Un diseño completo al azar de un tipo: una de sus plantillas, un tema de color, una fuente y
// datos ficticios. Las piezas con fuente propia cambian a la elegida; el resto no se toca.
export function randomDesign(
  type: DocumentTypeDefinition,
  rng: Rng,
  today = new Date(),
): RandomDesign {
  const base = rng.pick(type.templates);
  const theme = rng.pick(THEMES);
  const font = SAFE_FONTS.length > 0 ? rng.pick(SAFE_FONTS) : undefined;
  const elements = base.document.elements.map((el) =>
    font && typeof el.props['fontFamily'] === 'string'
      ? { ...el, props: { ...el.props, fontFamily: font.id } }
      : el,
  );
  const generated = generateData(type.schema, rng, today);
  const data = type.refineRandomData ? type.refineRandomData(generated, rng) : generated;
  return {
    template: {
      id: 'aleatorio',
      name: `${base.name} · ${theme.name}`,
      document: { ...base.document, palette: theme.palette, elements },
    },
    data,
    summary: `${base.name}, ${theme.name}${font ? `, ${font.name}` : ''}`,
  };
}
