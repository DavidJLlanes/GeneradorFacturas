import fontkit from '@pdf-lib/fontkit';
import { StandardFonts, type PDFDocument, type PDFFont } from 'pdf-lib';
import { faceSource, type FaceRequest } from './face-source';

export type Fontkit = ReturnType<typeof fontkit.create>;

export interface Face {
  /** Archivos de la fuente por orden de preferencia (cada uno cubre un subconjunto de caracteres). */
  fonts: readonly Fontkit[];
  /** Fuente estándar del PDF: dibuja lo que ningún archivo cubre y el texto invisible seleccionable. */
  fallback: PDFFont;
  /** Ascendente y descendente como fracción del tamaño de letra. */
  ascent: number;
  descent: number;
}

export interface Run {
  text: string;
  /** Fuente con los contornos para dibujarlo; sin ella se usa la estándar. */
  kit: Fontkit | null;
}

// Ascendente y descendente típicos de la fuente estándar cuando no hay archivo de fuente.
const STANDARD = { ascent: 0.905, descent: 0.212 };

// Fuentes del PDF. El texto se dibuja con los contornos de los glifos (no se incrusta la fuente: el
// recorte de fuentes de fontkit falla con muchas fuentes con acentos), así que el resultado es idéntico
// a la pantalla con cualquier fuente. Cada tipo de letra se lee una sola vez.
export class FontBook {
  private readonly faces = new Map<string, Promise<Face>>();
  private readonly standard = new Map<string, Promise<PDFFont>>();

  constructor(
    private readonly pdf: PDFDocument,
    private readonly baseUrl: string,
  ) {}

  face(request: FaceRequest): Promise<Face> {
    const source = faceSource(request, this.baseUrl);
    const key = source?.key ?? `std:${request.weight >= 600}:${request.italic}`;
    let face = this.faces.get(key);
    if (!face) {
      face = this.build(request, source);
      this.faces.set(key, face);
    }
    return face;
  }

  private standardFont(bold: boolean, italic: boolean): Promise<PDFFont> {
    const name =
      bold && italic
        ? StandardFonts.HelveticaBoldOblique
        : bold
          ? StandardFonts.HelveticaBold
          : italic
            ? StandardFonts.HelveticaOblique
            : StandardFonts.Helvetica;
    let font = this.standard.get(name);
    if (!font) {
      font = this.pdf.embedFont(name);
      this.standard.set(name, font);
    }
    return font;
  }

  private async build(request: FaceRequest, source: ReturnType<typeof faceSource>): Promise<Face> {
    const fallback = await this.standardFont(request.weight >= 600, request.italic);
    const fonts: Fontkit[] = [];
    for (const load of source?.files ?? []) {
      try {
        fonts.push(fontkit.create(await load()) as Fontkit);
      } catch {
        // Un subconjunto que falta no impide usar los demás.
      }
    }
    const first = fonts[0];
    return {
      fonts,
      fallback,
      ascent: first ? first.ascent / first.unitsPerEm : STANDARD.ascent,
      descent: first ? -first.descent / first.unitsPerEm : STANDARD.descent,
    };
  }
}

// Texto que la fuente estándar sabe escribir (el resto se cambia por «?»).
export function standardSafe(face: Face, text: string): string {
  const known = new Set(face.fallback.getCharacterSet());
  return [...text].map((c) => (known.has(c.codePointAt(0) ?? 0) ? c : '?')).join('');
}

// Trocea un texto en tramos, cada uno con la fuente que tiene los glifos de sus caracteres.
export function runsFor(face: Face, text: string): Run[] {
  const runs: Run[] = [];
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    const kit = face.fonts.find((f) => f.hasGlyphForCodePoint(code)) ?? null;
    const last = runs[runs.length - 1];
    if (last && last.kit === kit) last.text += char;
    else runs.push({ text: char, kit });
  }
  return runs;
}
