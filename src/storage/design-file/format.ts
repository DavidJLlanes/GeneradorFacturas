import type { DocumentModel } from '../../core/document/types';
import type { CustomFont } from '../../fonts/custom/custom-fonts';

// Archivo de diseño: el documento sin datos, con las fuentes propias que usa, para abrirlo en otro
// navegador o compartirlo. Es JSON de texto (extensión `.diseno.json`).
export const DESIGN_FORMAT = 'generador-documentos/diseno';
export const DESIGN_VERSION = 1;
export const DESIGN_EXTENSION = '.diseno.json';

export interface DesignFile {
  formato: typeof DESIGN_FORMAT;
  version: number;
  /** Id del tipo de documento (`factura`, `presupuesto`…) al que pertenece el diseño. */
  tipoDocumento: string;
  nombre: string;
  guardado: string;
  documento: DocumentModel;
  fuentes: readonly CustomFont[];
}
