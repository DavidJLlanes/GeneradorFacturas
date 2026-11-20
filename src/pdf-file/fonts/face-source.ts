import { FONTS, type FontEntry, type FontStyleId } from '../../fonts/catalog';
import { CUSTOM_PREFIX, customFontById } from '../../fonts/custom/custom-fonts';
import { SUBSETS } from '../../fonts/subsets';

// De qué archivos sale un tipo de letra pedido por el navegador (familia, peso y cursiva).

export interface FaceRequest {
  /** Valor `font-family` calculado, p. ej. `"Inter", sans-serif`. */
  family: string;
  weight: number;
  italic: boolean;
}

export interface FaceSource {
  /** Identifica el tipo de letra para no incrustarlo dos veces. */
  key: string;
  /** Un archivo por subconjunto de caracteres, por orden de preferencia. */
  files: ReadonlyArray<() => Promise<Uint8Array>>;
}

export const firstFamily = (family: string): string =>
  (family.split(',')[0] ?? '').trim().replace(/^["']|["']$/g, '');

// Estilo del catálogo más cercano al pedido.
export function pickStyle(font: FontEntry, weight: number, italic: boolean): FontStyleId {
  const w = weight >= 600 ? '700' : '400';
  const wanted = `${w}${italic ? 'i' : ''}` as FontStyleId;
  if (font.styles.includes(wanted)) return wanted;
  const upright = w as FontStyleId;
  if (font.styles.includes(upright)) return upright;
  const other = (w === '700' ? '400' : '700') as FontStyleId;
  if (font.styles.includes(other)) return other;
  return font.styles[0] ?? '400';
}

const downloads = new Map<string, Promise<Uint8Array>>();

function download(url: string): Promise<Uint8Array> {
  let pending = downloads.get(url);
  if (!pending) {
    pending = fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`No se pudo leer la fuente (${response.status})`);
      return new Uint8Array(await response.arrayBuffer());
    });
    downloads.set(url, pending);
  }
  return pending;
}

function fromBase64(data: string): Uint8Array {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function faceSource(request: FaceRequest, baseUrl: string): FaceSource | null {
  const name = firstFamily(request.family);
  if (name.startsWith(CUSTOM_PREFIX)) {
    const custom = customFontById(name);
    if (!custom) return null;
    return { key: name, files: [async () => fromBase64(custom.data)] };
  }
  const font = FONTS.find((f) => f.name === name);
  if (!font) return null;
  const style = pickStyle(font, request.weight, request.italic);
  const weight = style.replace('i', '');
  const kind = style.endsWith('i') ? 'italic' : 'normal';
  return {
    key: `${font.id}:${style}`,
    files: SUBSETS.map(
      (s) => () =>
        download(`${baseUrl}fonts/${font.id}/${font.id}-${s.id}-${weight}-${kind}.woff2`),
    ),
  };
}
