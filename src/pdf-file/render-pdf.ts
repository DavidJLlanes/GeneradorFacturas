import { PDFDocument } from 'pdf-lib';
import { FontBook } from './fonts/font-book';
import type { PaintContext } from './paint/context';
import { paintElement } from './walk';
import { waitForFonts } from './wait-for-fonts';

const PT_PER_MM = 72 / 25.4;

export interface PdfSize {
  widthMm: number;
  heightMm: number;
}

export interface PdfInfo {
  title?: string;
}

// Convierte el documento imprimible `root` (una `.pdf-page` por página, ya en el documento HTML)
// en un PDF vectorial: texto real, fuentes incrustadas y sin pasar por el diálogo de impresión.
export async function renderPdf(
  root: HTMLElement,
  size: PdfSize,
  info: PdfInfo = {},
): Promise<Uint8Array> {
  await waitForFonts(root);
  const pdf = await PDFDocument.create();
  pdf.setProducer('Generador de documentos');
  pdf.setCreator('Generador de documentos');
  if (info.title) pdf.setTitle(info.title);
  const fonts = new FontBook(pdf, import.meta.env.BASE_URL);
  const images: PaintContext['images'] = new Map();

  for (const node of root.querySelectorAll<HTMLElement>('.pdf-page')) {
    const page = pdf.addPage([size.widthMm * PT_PER_MM, size.heightMm * PT_PER_MM]);
    const origin = node.getBoundingClientRect();
    const ctx: PaintContext = {
      pdf,
      page,
      fonts,
      images,
      originX: origin.left,
      originY: origin.top,
      opacity: 1,
    };
    for (const child of node.children) await paintElement(ctx, child);
  }
  return pdf.save();
}
