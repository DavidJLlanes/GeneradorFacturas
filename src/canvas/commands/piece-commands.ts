import { contentRect } from '../../core/document/page';
import { addElement } from '../../core/document/operations/add-element';
import { updateProps } from '../../core/document/operations/update-props';
import { applyRects } from '../../core/document/operations/update-rects';
import type { PieceProps } from '../../core/document/types';
import type { Rect } from '../../core/geometry/rect';
import type { PieceDefinition } from '../../pieces/types';
import type { Editor } from '../editor/create-editor';

const anchoredRect = (area: Rect, h: number, anchor: 'top' | 'bottom'): Rect => ({
  x: area.x,
  y: anchor === 'top' ? area.y : area.y + area.h - h,
  w: area.w,
  h,
});

const centredRect = (area: Rect, piece: PieceDefinition, h: number): Rect => {
  const w = Math.min(piece.defaultSize.w, area.w);
  return { x: area.x + (area.w - w) / 2, y: area.y + (area.h - h) / 2, w, h };
};

// Añade una pieza nueva centrada en la zona útil de la página y la deja seleccionada.
export function insertPiece(editor: Editor, piece: PieceDefinition): void {
  const doc = editor.doc();
  const area = contentRect(doc.page);
  const h = Math.min(piece.defaultSize.h, area.h);
  const count = doc.elements.filter((e) => e.kind === piece.kind).length + 1;
  const rect = piece.anchor ? anchoredRect(area, h, piece.anchor) : centredRect(area, piece, h);
  const { doc: next, id } = addElement(doc, rect, `${piece.name} ${count}`, {
    kind: piece.kind,
    props: piece.defaultProps,
  });
  editor.apply(next);
  editor.select([id]);
}

export function setProps(editor: Editor, ids: readonly string[], patch: PieceProps): void {
  const doc = editor.doc();
  const next = updateProps(doc, ids, patch);
  if (next !== doc) editor.apply(next);
}

const MIN_SIZE_MM = 1;

// Fija posición y tamaño de una pieza desde el panel (en mm). El tamaño mínimo es 1 mm.
export function setRect(editor: Editor, id: string, rect: Rect): void {
  const doc = editor.doc();
  const el = doc.elements.find((e) => e.id === id);
  if (!el) return;
  const next: Rect = {
    x: rect.x,
    y: rect.y,
    w: Math.max(MIN_SIZE_MM, rect.w),
    h: Math.max(MIN_SIZE_MM, rect.h),
  };
  if (next.x === el.x && next.y === el.y && next.w === el.w && next.h === el.h) return;
  editor.apply(applyRects(doc, new Map([[id, next]])));
}
