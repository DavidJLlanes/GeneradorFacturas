import { rgb } from 'pdf-lib';
import { parseCssColor, type Rgba } from '../color/css-color';
import { boxOf, PT_PER_PX, type BoxPt, type PaintContext } from './context';
import { roundedRect, toSvgPath } from './shape-path';

const px = (value: string): number => parseFloat(value) || 0;

// Radio de las esquinas en puntos (horizontal y vertical). Acepta píxeles y porcentajes.
export function radiiOf(cs: CSSStyleDeclaration, box: BoxPt): [number, number] {
  const part = (v: string, whole: number): number =>
    v.endsWith('%') ? (parseFloat(v) / 100) * whole : px(v) * PT_PER_PX;
  const [h = '0px', v = h] = cs.borderTopLeftRadius.split(' ');
  return [part(h, box.w), part(v, box.h)];
}

const color = (c: Rgba): ReturnType<typeof rgb> => rgb(c.r, c.g, c.b);

function fill(
  ctx: PaintContext,
  box: BoxPt,
  rx: number,
  ry: number,
  c: Rgba,
  grow = 0,
  dy = 0,
  opacity = 1,
): void {
  const path = toSvgPath(roundedRect(box.w + grow * 2, box.h + grow * 2, rx + grow, ry + grow));
  ctx.page.drawSvgPath(path, {
    x: box.x - grow,
    y: ctx.page.getHeight() - (box.top - grow + dy),
    color: color(c),
    opacity: c.a * ctx.opacity * opacity,
    borderWidth: 0,
  });
}

// Sombra aproximada con capas translúcidas cada vez más anchas (el PDF no tiene desenfoque).
function paintShadow(
  ctx: PaintContext,
  cs: CSSStyleDeclaration,
  box: BoxPt,
  rx: number,
  ry: number,
): void {
  const match = /^(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/.exec(cs.boxShadow);
  if (!match) return;
  const c = parseCssColor(match[1] ?? '');
  if (!c) return;
  const dy = px(match[3] ?? '0') * PT_PER_PX;
  const blur = px(match[4] ?? '0') * PT_PER_PX;
  const layers = 4;
  for (let i = layers; i >= 1; i -= 1) {
    fill(ctx, box, rx, ry, c, (blur / 2) * (i / layers), dy, 1 / (layers + 1));
  }
}

interface Side {
  width: number;
  color: Rgba | null;
  visible: boolean;
}

function sideOf(cs: CSSStyleDeclaration, name: 'Top' | 'Right' | 'Bottom' | 'Left'): Side {
  const width = px(cs.getPropertyValue(`border-${name.toLowerCase()}-width`)) * PT_PER_PX;
  const style = cs.getPropertyValue(`border-${name.toLowerCase()}-style`);
  const c = parseCssColor(cs.getPropertyValue(`border-${name.toLowerCase()}-color`));
  return {
    width,
    color: c,
    visible: width > 0 && style !== 'none' && style !== 'hidden' && !!c && c.a > 0,
  };
}

// Fondo, sombra y bordes de una caja.
export function paintBox(ctx: PaintContext, cs: CSSStyleDeclaration, rect: DOMRect): void {
  const box = boxOf(ctx, rect);
  if (box.w <= 0 || box.h <= 0) return;
  const [rx, ry] = radiiOf(cs, box);
  if (cs.boxShadow !== 'none') paintShadow(ctx, cs, box, rx, ry);

  const background = parseCssColor(cs.backgroundColor);
  if (background && background.a > 0) fill(ctx, box, rx, ry, background);

  const sides = [
    sideOf(cs, 'Top'),
    sideOf(cs, 'Right'),
    sideOf(cs, 'Bottom'),
    sideOf(cs, 'Left'),
  ] as const;
  const [top, right, bottom, left] = sides;
  if (!sides.some((s) => s.visible)) return;

  const same = (a: Side, b: Side): boolean =>
    a.visible &&
    b.visible &&
    a.width === b.width &&
    a.color?.r === b.color?.r &&
    a.color?.g === b.color?.g &&
    a.color?.b === b.color?.b;
  if (same(top, right) && same(top, bottom) && same(top, left)) {
    const w = top.width;
    const style = cs.borderTopStyle;
    const path = toSvgPath(roundedRect(box.w - w, box.h - w, rx - w / 2, ry - w / 2));
    const dash = style === 'dashed' ? [w * 3, w * 2] : style === 'dotted' ? [w, w] : undefined;
    ctx.page.drawSvgPath(path, {
      x: box.x + w / 2,
      y: ctx.page.getHeight() - (box.top + w / 2),
      borderColor: color(top.color!),
      borderWidth: w,
      borderOpacity: top.color!.a * ctx.opacity,
      ...(dash ? { borderDashArray: dash } : {}),
    });
    return;
  }
  // Bordes distintos (p. ej. solo una línea debajo): cada lado es una tira rellena.
  const strip = (s: Side, x: number, top0: number, w: number, h: number): void => {
    if (!s.visible || !s.color) return;
    fill(ctx, { x, top: top0, w, h }, 0, 0, s.color);
  };
  strip(top, box.x, box.top, box.w, top.width);
  strip(bottom, box.x, box.top + box.h - bottom.width, box.w, bottom.width);
  strip(left, box.x, box.top, left.width, box.h);
  strip(right, box.x + box.w - right.width, box.top, right.width, box.h);
}
