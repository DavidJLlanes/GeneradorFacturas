// Dónde cae una imagen dentro de su caja según `object-fit`. Coordenadas relativas a la caja.

export interface FitRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function fitRect(
  mode: string,
  boxW: number,
  boxH: number,
  naturalW: number,
  naturalH: number,
): FitRect {
  if (mode === 'fill' || naturalW <= 0 || naturalH <= 0) return { x: 0, y: 0, w: boxW, h: boxH };
  const contain = Math.min(boxW / naturalW, boxH / naturalH);
  const cover = Math.max(boxW / naturalW, boxH / naturalH);
  const k =
    mode === 'cover'
      ? cover
      : mode === 'none'
        ? 1
        : mode === 'scale-down'
          ? Math.min(1, contain)
          : contain;
  const w = naturalW * k;
  const h = naturalH * k;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}
