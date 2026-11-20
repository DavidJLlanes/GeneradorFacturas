import type { PDFImage } from 'pdf-lib';
import { fitRect } from '../image/fit-rect';
import { boxOf, type PaintContext } from './context';
import { clipTo } from './clip';
import { roundedRect } from './shape-path';

const SVG_RASTER_FACTOR = 3;
const MAX_RASTER_SIDE = 2400;

function bytesOfDataUrl(src: string): Uint8Array {
  const binary = atob(src.slice(src.indexOf(',') + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Un SVG no cabe en un PDF como imagen: se rasteriza a buena resolución, ya ajustado a su caja.
async function rasterize(
  img: HTMLImageElement,
  box: { w: number; h: number },
  mode: string,
): Promise<Uint8Array> {
  const scale = Math.min(SVG_RASTER_FACTOR, MAX_RASTER_SIDE / Math.max(box.w, box.h, 1));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(box.w * scale));
  canvas.height = Math.max(1, Math.round(box.h * scale));
  const natural = { w: img.naturalWidth || box.w, h: img.naturalHeight || box.h };
  const fit = fitRect(mode, canvas.width, canvas.height, natural.w, natural.h);
  canvas.getContext('2d')?.drawImage(img, fit.x, fit.y, fit.w, fit.h);
  const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, 'image/png'));
  if (!blob) throw new Error('No se pudo rasterizar la imagen');
  return new Uint8Array(await blob.arrayBuffer());
}

function embed(ctx: PaintContext, key: string, make: () => Promise<PDFImage>): Promise<PDFImage> {
  let image = ctx.images.get(key);
  if (!image) {
    image = make();
    ctx.images.set(key, image);
  }
  return image;
}

// Dibuja una `<img>` con datos incrustados (PNG, JPEG o SVG) respetando `object-fit` y la opacidad.
export async function paintImage(
  ctx: PaintContext,
  img: HTMLImageElement,
  cs: CSSStyleDeclaration,
): Promise<void> {
  const box = boxOf(ctx, img.getBoundingClientRect());
  if (box.w <= 0 || box.h <= 0 || !img.src.startsWith('data:image/')) return;
  const mode = cs.objectFit || 'fill';
  const mime = /^data:(image\/[a-z+]+)/.exec(img.src)?.[1] ?? '';

  let pdfImage: PDFImage;
  let place = { x: 0, y: 0, w: box.w, h: box.h };
  if (mime === 'image/png' || mime === 'image/jpeg') {
    pdfImage = await embed(ctx, img.src, () =>
      mime === 'image/png'
        ? ctx.pdf.embedPng(bytesOfDataUrl(img.src))
        : ctx.pdf.embedJpg(bytesOfDataUrl(img.src)),
    );
    const natural = {
      w: img.naturalWidth || pdfImage.width,
      h: img.naturalHeight || pdfImage.height,
    };
    place = fitRect(mode, box.w, box.h, natural.w, natural.h);
  } else {
    const key = `${img.src}|${Math.round(box.w)}x${Math.round(box.h)}|${mode}`;
    pdfImage = await embed(ctx, key, async () =>
      ctx.pdf.embedPng(await rasterize(img, { w: box.w, h: box.h }, mode)),
    );
  }

  const undo = clipTo(ctx.page, roundedRect(box.w, box.h, 0, 0), box.x, box.top);
  ctx.page.drawImage(pdfImage, {
    x: box.x + place.x,
    y: ctx.page.getHeight() - (box.top + place.y + place.h),
    width: place.w,
    height: place.h,
    opacity: ctx.opacity,
  });
  undo();
}
