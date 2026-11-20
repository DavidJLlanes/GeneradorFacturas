import type { DocElement, DocumentModel, Page, PieceProps } from '../../core/document/types';
import { isCurrency } from '../../data/currency';
import { PALETTE_KEYS, type Palette } from '../../styles/palette';

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const fail = (what: string): never => {
  throw new Error(`El archivo está dañado: ${what}.`);
};

function readPage(raw: unknown): Page {
  if (!isObj(raw) || !isNum(raw['widthMm']) || !isNum(raw['heightMm']))
    return fail('falta el papel');
  if (raw['widthMm'] <= 0 || raw['heightMm'] <= 0)
    return fail('el papel tiene un tamaño no válido');
  const m = raw['marginsMm'];
  if (!isObj(m)) return fail('faltan los márgenes');
  const { top, right, bottom, left } = m;
  if (!isNum(top) || !isNum(right) || !isNum(bottom) || !isNum(left))
    return fail('márgenes no válidos');
  return {
    widthMm: raw['widthMm'],
    heightMm: raw['heightMm'],
    marginsMm: { top, right, bottom, left },
  };
}

function readProps(raw: unknown, id: string): PieceProps {
  if (!isObj(raw)) return fail(`el elemento ${id} no tiene propiedades`);
  const props: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string' || typeof value === 'boolean' || isNum(value)) props[key] = value;
  }
  return props;
}

function readElement(raw: unknown): DocElement {
  if (!isObj(raw)) return fail('un elemento no es válido');
  const { id, name, kind, x, y, w, h } = raw;
  if (typeof id !== 'string' || id === '' || typeof kind !== 'string' || kind === '') {
    return fail('un elemento no tiene identificador o tipo');
  }
  if (!isNum(x) || !isNum(y) || !isNum(w) || !isNum(h))
    return fail(`el elemento ${id} no tiene medidas`);
  const element: DocElement = {
    id,
    name: typeof name === 'string' ? name : kind,
    locked: raw['locked'] === true,
    hidden: raw['hidden'] === true,
    kind,
    x,
    y,
    w,
    h,
    props: readProps(raw['props'], id),
  };
  return raw['repeat'] === true ? { ...element, repeat: true } : element;
}

function readPalette(raw: unknown): Palette | undefined {
  if (raw === undefined) return undefined;
  if (!isObj(raw)) return fail('la paleta no es válida');
  const colors: Record<string, string> = {};
  for (const key of PALETTE_KEYS) {
    const value = raw[key];
    if (typeof value !== 'string') return fail('a la paleta le faltan colores');
    colors[key] = value;
  }
  return colors as Palette;
}

// Comprueba la forma de un documento leído de un archivo y lo devuelve ya tipado.
// Ignora lo que sobra y falla con un mensaje claro si falta algo imprescindible.
export function readDocument(raw: unknown): DocumentModel {
  if (!isObj(raw)) return fail('no contiene un documento');
  if (!Array.isArray(raw['elements'])) return fail('faltan los elementos');
  const palette = readPalette(raw['palette']);
  const doc: DocumentModel = {
    page: readPage(raw['page']),
    elements: raw['elements'].map(readElement),
  };
  const withPalette = palette ? { ...doc, palette } : doc;
  return isCurrency(raw['currency']) ? { ...withPalette, currency: raw['currency'] } : withPalette;
}
