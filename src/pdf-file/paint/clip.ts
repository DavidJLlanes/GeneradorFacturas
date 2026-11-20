import {
  appendBezierCurve,
  clip,
  closePath,
  endPath,
  lineTo,
  moveTo,
  popGraphicsState,
  pushGraphicsState,
  type PDFOperator,
  type PDFPage,
} from 'pdf-lib';
import type { Seg } from './shape-path';

// Recorta lo que se dibuje a continuación al contorno dado (`x`, `top` en puntos desde arriba de la
// página). Devuelve la función que deshace el recorte.
export function clipTo(page: PDFPage, segs: readonly Seg[], x: number, top: number): () => void {
  const y = (v: number): number => page.getHeight() - (top + v);
  const ops: PDFOperator[] = [pushGraphicsState()];
  for (const s of segs) {
    if (s[0] === 'M') ops.push(moveTo(x + s[1], y(s[2])));
    else if (s[0] === 'L') ops.push(lineTo(x + s[1], y(s[2])));
    else if (s[0] === 'C') {
      ops.push(appendBezierCurve(x + s[1], y(s[2]), x + s[3], y(s[4]), x + s[5], y(s[6])));
    } else ops.push(closePath());
  }
  ops.push(clip(), endPath());
  page.pushOperators(...ops);
  return () => page.pushOperators(popGraphicsState());
}
