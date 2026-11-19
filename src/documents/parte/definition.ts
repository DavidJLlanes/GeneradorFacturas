import type { Numbering } from '../../core/document-type/types';

export const ID = 'parte';
export const NAME = 'Parte de trabajo';
export const DESCRIPTION =
  'Parte de trabajo: cliente y lugar, técnico, horas de inicio y fin, descripción, materiales y firmas.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'PT-', padding: 4 };
