import type { Rect } from '../../geometry/rect';
import type { DocumentModel } from '../types';

export function applyRects(doc: DocumentModel, rects: ReadonlyMap<string, Rect>): DocumentModel {
  if (rects.size === 0) return doc;
  return {
    ...doc,
    elements: doc.elements.map((e) => {
      const r = rects.get(e.id);
      return r ? { ...e, x: r.x, y: r.y, w: r.w, h: r.h } : e;
    }),
  };
}
