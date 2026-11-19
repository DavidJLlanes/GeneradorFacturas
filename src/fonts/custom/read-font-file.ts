import { CUSTOM_PREFIX, type CustomFont } from './custom-fonts';

export const MAX_FONT_BYTES = 1_500_000;

const ascii = (bytes: Uint8Array, from: number): string =>
  String.fromCharCode(...bytes.slice(from, from + 4));

// Tipo MIME según los primeros bytes del archivo; `null` si no parece una fuente.
export function sniffFontMime(bytes: Uint8Array): string | null {
  const tag = ascii(bytes, 0);
  if (tag === 'wOF2') return 'font/woff2';
  if (tag === 'wOFF') return 'font/woff';
  if (tag === 'OTTO') return 'font/otf';
  if (tag === 'true' || tag === '\u0000\u0001\u0000\u0000') return 'font/ttf';
  return null;
}

export function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

// Identificador estable: el mismo archivo da siempre el mismo id (no se duplican al reimportar).
function hashOf(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i += 7) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36) + text.length.toString(36);
}

const nameFromFile = (fileName: string): string =>
  fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim() || 'Fuente propia';

// Convierte los bytes de un archivo en una fuente propia, o lanza un error legible.
export function fontFromBytes(fileName: string, bytes: Uint8Array): CustomFont {
  if (bytes.length > MAX_FONT_BYTES) throw new Error('La fuente pesa demasiado (máximo 1,5 MB).');
  const mime = sniffFontMime(bytes);
  if (!mime) throw new Error('El archivo no es una fuente válida (.ttf, .otf, .woff o .woff2).');
  const data = toBase64(bytes);
  return { id: `${CUSTOM_PREFIX}${hashOf(data)}`, name: nameFromFile(fileName), mime, data };
}

export async function readFontFile(file: File): Promise<CustomFont> {
  return fontFromBytes(file.name, new Uint8Array(await file.arrayBuffer()));
}
