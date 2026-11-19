import type { PieceProps } from '../core/document/types';

// Contrato de una pieza genérica. Cada pieza vive en `src/pieces/<kind>/` y exporta su definición
// por defecto desde `index.ts`; el motor las descubre solas.

export type PropKind = 'text' | 'multiline' | 'number' | 'color' | 'select' | 'toggle' | 'image';

export interface PropOption {
  value: string;
  label: string;
}

// Descripción de una propiedad editable. El panel de propiedades se genera a partir de estas.
export interface PropSpec {
  key: string;
  label: string;
  kind: PropKind;
  options?: readonly PropOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface PieceRenderInput {
  /** Propiedades de la pieza ya completadas con los valores por defecto. */
  props: PieceProps;
  widthMm: number;
  heightMm: number;
  /** Sustituye las variables `{{campo}}` de un texto por los datos del documento. */
  resolve(text: string): string;
}

export interface PieceDefinition {
  kind: string;
  name: string;
  defaultSize: { w: number; h: number };
  defaultProps: PieceProps;
  props: readonly PropSpec[];
  /** Propiedad de texto que se edita directamente sobre la página con doble clic. */
  inlineProp?: string;
  /** Dibuja la pieza dentro de `node`. Debe ser idempotente: se llama cada vez que algo cambia. */
  render(node: HTMLElement, input: PieceRenderInput): void;
}
