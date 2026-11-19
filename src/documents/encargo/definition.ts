import type { Numbering } from '../../core/document-type/types';

export const ID = 'encargo';
export const NAME = 'Hoja de encargo';
export const DESCRIPTION =
  'Hoja de encargo profesional: objeto y alcance del servicio, honorarios, provisión de fondos, plazo y firma de ambas partes.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'HE-', padding: 4 };
