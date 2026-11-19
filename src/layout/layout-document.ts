import type { DocElement, DocumentModel } from '../core/document/types';
import { zonesOf } from './page-zones';
import { placeRows } from './place-rows';
import { groupRows } from './rows';
import type { Layout, MeasureFn, PlacedItem } from './types';

// Reparte el documento en páginas con los datos actuales: las piezas repetidas van en todas, las
// tablas crecen (y empujan lo de debajo) y, si no caben, se parten por filas repitiendo su cabecera.
// Sin datos que hagan crecer nada, el resultado es una sola página idéntica al diseño.
export function layoutDocument(doc: DocumentModel, measure: MeasureFn): Layout {
  const visible = doc.elements.filter((e) => !e.hidden);
  const repeated = visible.filter((e) => e.repeat === true);
  const flow = visible.filter((e) => e.repeat !== true);
  const zones = zonesOf(doc.page, repeated);

  const placed = placeRows(groupRows(flow, measure), zones);
  const order = new Map(doc.elements.map((e, i) => [e.id, i]));
  const pageCount = Math.max(1, ...placed.map((p) => p.page + 1));

  const pages = Array.from({ length: pageCount }, (_, index) => {
    const items: PlacedItem[] = repeated.map((e: DocElement) => ({
      element: e,
      rect: { x: e.x, y: e.y, w: e.w, h: e.h },
    }));
    for (const p of placed) if (p.page === index) items.push(p.item);
    items.sort((a, b) => (order.get(a.element.id) ?? 0) - (order.get(b.element.id) ?? 0));
    return { items };
  });
  return { pages };
}
