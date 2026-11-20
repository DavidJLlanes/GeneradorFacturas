import { clipTo } from './paint/clip';
import { paintBox, radiiOf } from './paint/box';
import { boxOf, type PaintContext } from './paint/context';
import { paintImage } from './paint/image';
import { roundedRect } from './paint/shape-path';
import { paintSvg } from './paint/svg';
import { paintText } from './paint/text';

// Recorre un elemento ya maquetado y lo pinta en el PDF tal como se ve: primero su caja, luego su
// contenido (texto, imágenes, SVG y elementos hijos), recortando lo que se sale si el elemento lo oculta.
export async function paintElement(ctx: PaintContext, el: Element): Promise<void> {
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return;
  const inner: PaintContext = { ...ctx, opacity: ctx.opacity * (parseFloat(cs.opacity) || 0) };
  if (inner.opacity <= 0) return;

  if (el instanceof SVGSVGElement) {
    paintSvg(inner, el);
    return;
  }
  const rect = el.getBoundingClientRect();
  paintBox(inner, cs, rect);
  if (el instanceof HTMLImageElement) {
    await paintImage(inner, el, cs);
    return;
  }

  let undo: (() => void) | null = null;
  if (cs.overflow !== 'visible') {
    const box = boxOf(inner, rect);
    const [rx, ry] = radiiOf(cs, box);
    undo = clipTo(inner.page, roundedRect(box.w, box.h, rx, ry), box.x, box.top);
  }
  for (const child of el.childNodes) {
    if (child instanceof Text) await paintText(inner, child, cs);
    else if (child instanceof Element) await paintElement(inner, child);
  }
  undo?.();
}
