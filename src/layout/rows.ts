import type { DocElement } from '../core/document/types';
import type { Measure, MeasureFn } from './types';

const SAME = 0.05;

// Una pieza de flujo con su alto real: las reparables miden con los datos; el resto, su alto de diseño.
export interface FlowItem {
  element: DocElement;
  measure: Measure | null;
  /** Alto con los datos actuales (nunca menos que el de diseño). */
  height: number;
  /** Cuánto crece respecto al diseño. */
  growth: number;
}

// Piezas que empiezan a la misma altura: se tratan juntas para que no se descuadren al saltar de página.
export interface Row {
  /** Altura de diseño donde empieza la fila. */
  y: number;
  /** Desplazamiento hacia abajo por lo que han crecido las piezas que acaban antes de esta fila. */
  shift: number;
  items: FlowItem[];
}

export const totalOf = (m: Measure): number => m.headMm + m.unitsMm.reduce((a, b) => a + b, 0);

export function groupRows(flow: readonly DocElement[], measure: MeasureFn): Row[] {
  const items: FlowItem[] = flow.map((element) => {
    const m = measure(element);
    const height = m ? Math.max(element.h, totalOf(m)) : element.h;
    return { element, measure: m, height, growth: height - element.h };
  });
  const sorted = [...items].sort((a, b) => a.element.y - b.element.y || a.element.x - b.element.x);

  const rows: Row[] = [];
  for (const item of sorted) {
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.y - item.element.y) < SAME) last.items.push(item);
    else rows.push({ y: item.element.y, shift: 0, items: [item] });
  }
  for (const row of rows) {
    row.shift = items
      .filter((i) => i.growth > 0 && i.element.y + i.element.h <= row.y + SAME)
      .reduce((sum, i) => sum + i.growth, 0);
  }
  return rows;
}
