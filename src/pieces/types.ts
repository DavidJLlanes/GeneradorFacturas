import type { DataSchema, DocumentData } from '../core/document-type/types';
import type { PieceProps } from '../core/document/types';
import type { Measure, Slice } from '../layout/types';

// Contrato de una pieza genérica. Cada pieza vive en `src/pieces/<kind>/` y exporta su definición
// por defecto desde `index.ts`; el motor las descubre solas.

export type PropKind =
  'text' | 'multiline' | 'number' | 'color' | 'select' | 'toggle' | 'image' | 'font';

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
  /** Esquema de datos del tipo de documento (null si el documento no tiene datos). */
  schema: DataSchema | null;
  /** Valor sin formatear de un campo; solo con la vista "Con datos" activa (si no, undefined). */
  value(key: string): unknown;
  /** true con la vista "Con datos"; false con la plantilla limpia. */
  fillMode: boolean;
  /** Moneda de los importes (código ISO). */
  currency: string;
  /** Solo si la pieza está repartida entre páginas: qué unidades (filas) dibujar. */
  slice?: Slice;
}

// Datos con los que una pieza reparable mide su alto.
export type PieceMeasureInput = Pick<
  PieceRenderInput,
  'props' | 'widthMm' | 'heightMm' | 'schema' | 'value' | 'fillMode'
>;

export type { DocumentData };

export interface PieceDefinition {
  kind: string;
  name: string;
  defaultSize: { w: number; h: number };
  defaultProps: PieceProps;
  props: readonly PropSpec[];
  /** Propiedad de texto que se edita directamente sobre la página con doble clic. */
  inlineProp?: string;
  /** Al insertarla, se pega al borde superior o inferior de la zona útil y ocupa todo su ancho. */
  anchor?: 'top' | 'bottom';
  /**
   * Solo en piezas que pueden crecer y repartirse entre páginas (la tabla): su alto con los datos
   * actuales. Si falta, la pieza mantiene su tamaño de diseño.
   */
  measure?(input: PieceMeasureInput): Measure | null;
  /** Dibuja la pieza dentro de `node`. Debe ser idempotente: se llama cada vez que algo cambia. */
  render(node: HTMLElement, input: PieceRenderInput): void;
}
