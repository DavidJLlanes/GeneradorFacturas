import type { Numbering } from '../../core/document-type/types';

export const ID = 'ejemplo';
export const NAME = 'Ejemplo';
export const DESCRIPTION =
  'Tipo mínimo para probar el motor de documentos. Sirve de modelo para crear tipos nuevos.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'EJ-', padding: 4 };
