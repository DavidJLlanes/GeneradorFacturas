import type { Zones } from './page-zones';
import { totalOf, type FlowItem, type Row } from './rows';
import type { PlacedItem } from './types';

export interface PlacedOnPage {
  page: number;
  item: PlacedItem;
}

const EPS = 0.001;

// Coloca las filas página a página. `delta` es lo que hay que sumar a la altura "continua" de una
// fila para obtener su altura en la página actual; cada salto de página lo ajusta.
export function placeRows(rows: readonly Row[], zones: Zones): PlacedOnPage[] {
  const out: PlacedOnPage[] = [];
  let page = 0;
  let delta = 0;

  const top = (): number => (page === 0 ? -Infinity : zones.continuationTop);
  const nextPage = (localTop: number): number => {
    page += 1;
    delta += zones.continuationTop - localTop;
    return zones.continuationTop;
  };

  for (const row of rows) {
    const v = row.y + row.shift;
    let localTop = v + delta;
    const splittable = row.items.find((i) => i.measure && i.measure.unitsMm.length > 0);
    const atomicHeight = Math.max(
      0,
      ...row.items.filter((i) => i !== splittable).map((i) => i.height),
    );

    // Lo que nunca se ha movido se queda donde se diseñó, aunque esté fuera de la zona útil.
    const anchored = row.shift === 0 && delta === 0 && page === 0;
    if (anchored && !splittable) {
      for (const item of row.items) out.push(place(item, 0, item.element.y, item.element.h));
      continue;
    }

    const fits = (height: number): boolean => localTop + height <= zones.bodyBottom + EPS;
    const wantedHeight = splittable
      ? Math.max(atomicHeight, headAndFirst(splittable))
      : atomicHeight;
    // Si no cabe ni lo mínimo en lo que queda de página, salta a la siguiente.
    while ((localTop >= zones.bodyBottom - EPS || !fits(wantedHeight)) && localTop > top() + EPS) {
      localTop = nextPage(localTop);
    }

    if (!splittable) {
      for (const item of row.items) out.push(place(item, page, localTop, item.height));
      continue;
    }

    for (const item of row.items) {
      if (item !== splittable) out.push(place(item, page, localTop, item.element.h));
    }
    const m = splittable.measure!;
    let from = 0;
    let used: number;
    for (;;) {
      let to = from;
      let height = m.headMm;
      while (to < m.unitsMm.length) {
        const unit = m.unitsMm[to] ?? 0;
        // Siempre entra al menos una fila por trozo, para no quedarse sin avanzar.
        if (to > from && localTop + height + unit > zones.bodyBottom + EPS) break;
        height += unit;
        to += 1;
      }
      const whole = from === 0 && to >= m.unitsMm.length;
      out.push({
        page,
        item: {
          element: splittable.element,
          // Entera, conserva al menos su alto de diseño; en trozos, mide justo lo que dibuja.
          rect: {
            x: splittable.element.x,
            y: localTop,
            w: splittable.element.w,
            h: whole ? splittable.height : height,
          },
          ...(whole ? {} : { slice: { from, to } }),
        },
      });
      used = height;
      from = to;
      if (from >= m.unitsMm.length) break;
      localTop = nextPage(localTop + used);
    }
    // La pieza acaba en `localTop + used`; lo que hay debajo conserva su separación de diseño.
    const unusedDesign = splittable.height - totalOf(m);
    const end = localTop + used + Math.max(0, unusedDesign);
    delta = end - (v + splittable.height);
  }
  return out;
}

const headAndFirst = (item: FlowItem): number =>
  (item.measure?.headMm ?? 0) + (item.measure?.unitsMm[0] ?? 0);

const place = (item: FlowItem, page: number, y: number, h: number): PlacedOnPage => ({
  page,
  item: { element: item.element, rect: { x: item.element.x, y, w: item.element.w, h } },
});
