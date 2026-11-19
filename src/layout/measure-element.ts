import type { DataSchema } from '../core/document-type/types';
import { pieces } from '../pieces/discover';
import type { MeasureFn } from './types';

export interface MeasureEnv {
  schema: DataSchema | null;
  value(key: string): unknown;
  fillMode: boolean;
}

// Mide las piezas reparables con los datos del documento. Las que no declaran `measure` devuelven null.
export function createMeasure(env: MeasureEnv): MeasureFn {
  return (element) => {
    const piece = pieces.get(element.kind);
    if (!piece?.measure) return null;
    return piece.measure({
      props: pieces.propsOf(element),
      widthMm: element.w,
      heightMm: element.h,
      ...env,
    });
  };
}
