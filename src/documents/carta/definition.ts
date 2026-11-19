import type { Numbering } from '../../core/document-type/types';

export const ID = 'carta';
export const NAME = 'Carta de reclamación';
export const DESCRIPTION =
  'Carta formal de reclamación: remitente, destinatario, asunto, cuerpo, plazo de respuesta y firma.';
export const DEFAULT_PAPER_ID = 'a4';
export const NUMBERING: Numbering = { prefix: 'C-', padding: 4 };
