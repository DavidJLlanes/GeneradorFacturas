import type { PDFDocument, PDFImage, PDFPage } from 'pdf-lib';
import type { FontBook } from '../fonts/font-book';

// Lo que necesita cualquier pintor para escribir en una página del PDF.
export interface PaintContext {
  pdf: PDFDocument;
  page: PDFPage;
  fonts: FontBook;
  images: Map<string, Promise<PDFImage>>;
  /** Esquina superior izquierda de la página en pantalla, en píxeles CSS. */
  originX: number;
  originY: number;
  /** Opacidad acumulada de los elementos que contienen a este. */
  opacity: number;
}

// Un píxel CSS son 0,75 puntos del PDF.
export const PT_PER_PX = 0.75;

export interface BoxPt {
  /** Distancia al borde izquierdo y al superior de la página, en puntos. */
  x: number;
  top: number;
  w: number;
  h: number;
}

export function boxOf(ctx: PaintContext, rect: DOMRect): BoxPt {
  return {
    x: (rect.left - ctx.originX) * PT_PER_PX,
    top: (rect.top - ctx.originY) * PT_PER_PX,
    w: rect.width * PT_PER_PX,
    h: rect.height * PT_PER_PX,
  };
}
