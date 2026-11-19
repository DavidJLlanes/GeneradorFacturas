import type { DocumentModel } from '../../core/document/types';
import { customFontsUsedBy } from '../../fonts/custom/custom-fonts';
import { DESIGN_FORMAT, DESIGN_VERSION, type DesignFile } from './format';

// Archivo de diseño de un documento: solo el diseño (nunca los datos) y las fuentes propias que usa.
export function buildDesign(doc: DocumentModel, typeId: string, name: string): DesignFile {
  return {
    formato: DESIGN_FORMAT,
    version: DESIGN_VERSION,
    tipoDocumento: typeId,
    nombre: name,
    guardado: new Date().toISOString(),
    documento: doc,
    fuentes: customFontsUsedBy(doc),
  };
}

export const designToJson = (file: DesignFile): string => JSON.stringify(file, null, 1);
