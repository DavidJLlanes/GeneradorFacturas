import { LineCapStyle, rgb } from 'pdf-lib';
import { parseCssColor } from '../color/css-color';
import { boxOf, PT_PER_PX, type PaintContext } from './context';

const attr = (el: Element, name: string, fallback = ''): string =>
  el.getAttribute(name) ?? fallback;
const colorOf = (value: string): ReturnType<typeof rgb> | null => {
  const c = parseCssColor(value);
  return c && c.a > 0 ? rgb(c.r, c.g, c.b) : null;
};

// Dibuja un `<svg>` sencillo (rectángulos, trazos y líneas: lo que generan las piezas línea y QR).
export function paintSvg(ctx: PaintContext, svg: SVGSVGElement): void {
  const box = boxOf(ctx, svg.getBoundingClientRect());
  const view = svg.viewBox.baseVal;
  if (box.w <= 0 || box.h <= 0 || view.width <= 0 || view.height <= 0) return;
  // `meet`: escala uniforme y centrado, como hace el navegador.
  const k = Math.min(box.w / view.width, box.h / view.height);
  const x0 = box.x + (box.w - view.width * k) / 2 - view.x * k;
  const top0 = box.top + (box.h - view.height * k) / 2 - view.y * k;
  const pageH = ctx.page.getHeight();

  for (const child of svg.children) {
    if (child.tagName === 'rect') {
      const color = colorOf(attr(child, 'fill', '#000'));
      if (!color) continue;
      const w = parseFloat(attr(child, 'width')) * k;
      const h = parseFloat(attr(child, 'height')) * k;
      const x = x0 + (parseFloat(attr(child, 'x', '0')) || 0) * k;
      const top = top0 + (parseFloat(attr(child, 'y', '0')) || 0) * k;
      ctx.page.drawRectangle({
        x,
        y: pageH - top - h,
        width: w,
        height: h,
        color,
        opacity: ctx.opacity,
      });
    } else if (child.tagName === 'path') {
      const color = colorOf(attr(child, 'fill', '#000'));
      if (!color) continue;
      ctx.page.drawSvgPath(attr(child, 'd'), {
        x: x0,
        y: pageH - top0,
        scale: k,
        color,
        opacity: ctx.opacity,
        borderWidth: 0,
      });
    } else if (child.tagName === 'line') {
      const color = colorOf(attr(child, 'stroke', '#000'));
      if (!color) continue;
      const thickness = (parseFloat(attr(child, 'stroke-width', '1')) || 1) * k;
      const dash = attr(child, 'stroke-dasharray')
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((n) => parseFloat(n) * k);
      const at = (name: string): number => parseFloat(attr(child, name, '0')) || 0;
      ctx.page.drawLine({
        start: { x: x0 + at('x1') * k, y: pageH - (top0 + at('y1') * k) },
        end: { x: x0 + at('x2') * k, y: pageH - (top0 + at('y2') * k) },
        thickness: Math.max(thickness, 0.05 * PT_PER_PX),
        color,
        opacity: ctx.opacity,
        ...(dash.length > 0 ? { dashArray: dash } : {}),
        ...(attr(child, 'stroke-linecap') === 'round' ? { lineCap: LineCapStyle.Round } : {}),
      });
    }
  }
}
