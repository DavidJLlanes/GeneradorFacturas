import type { DocumentModel } from '../../core/document/types';

// Fuentes propias del usuario (`.ttf`, `.otf`, `.woff`, `.woff2`). Viven en memoria con sus bytes en
// base64, para poder guardarlas dentro del archivo de diseño y en el almacenamiento local.
export interface CustomFont {
  id: string;
  name: string;
  mime: string;
  /** Bytes del archivo de fuente, en base64. */
  data: string;
}

export const CUSTOM_PREFIX = 'custom:';

const registry = new Map<string, CustomFont>();

export const isCustomFontId = (id: string): boolean => id.startsWith(CUSTOM_PREFIX);

export const customFontById = (id: string): CustomFont | undefined => registry.get(id);

export const listCustomFonts = (): readonly CustomFont[] => [...registry.values()];

export function registerCustomFont(font: CustomFont): void {
  registry.set(font.id, font);
}

export function clearCustomFonts(): void {
  registry.clear();
}

const FORMATS: Readonly<Record<string, string>> = {
  'font/ttf': 'truetype',
  'font/otf': 'opentype',
  'font/woff': 'woff',
  'font/woff2': 'woff2',
};

// Regla `@font-face` de una fuente propia. Su `font-family` es su propio id; un solo archivo sirve
// para todos los pesos (el navegador sintetiza la negrita si hace falta).
export function customFontFaceCss(font: CustomFont): string {
  const format = FORMATS[font.mime] ?? 'truetype';
  return (
    `@font-face{font-family:"${font.id}";font-weight:100 900;font-style:normal;font-display:swap;` +
    `src:url("data:${font.mime};base64,${font.data}") format("${format}")}`
  );
}

// Fuentes propias que usa un documento (cualquier propiedad de texto con un id `custom:…`).
export function customFontsUsedBy(doc: DocumentModel): readonly CustomFont[] {
  const found = new Map<string, CustomFont>();
  for (const el of doc.elements) {
    for (const value of Object.values(el.props)) {
      if (typeof value !== 'string' || !isCustomFontId(value)) continue;
      const font = registry.get(value);
      if (font) found.set(font.id, font);
    }
  }
  return [...found.values()];
}
