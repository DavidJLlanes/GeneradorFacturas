import type { CustomFont } from '../../fonts/custom/custom-fonts';
import { CUSTOM_PREFIX } from '../../fonts/custom/custom-fonts';
import { DESIGN_FORMAT, DESIGN_VERSION, type DesignFile } from './format';
import { migrateTo } from './migrate';
import { readDocument } from './validate-document';

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function readFonts(raw: unknown): CustomFont[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) throw new Error('El archivo está dañado: las fuentes no son válidas.');
  const fonts: CustomFont[] = [];
  for (const f of raw) {
    if (!isObj(f)) continue;
    const { id, name, mime, data } = f;
    if (typeof id === 'string' && id.startsWith(CUSTOM_PREFIX) && typeof name === 'string') {
      if (typeof mime === 'string' && typeof data === 'string')
        fonts.push({ id, name, mime, data });
    }
  }
  return fonts;
}

// Convierte un objeto leído de JSON en un archivo de diseño válido (migrando versiones antiguas).
export function readDesign(raw: unknown): DesignFile {
  if (!isObj(raw) || raw['formato'] !== DESIGN_FORMAT) {
    throw new Error('Este archivo no es un diseño de Generador de documentos.');
  }
  const file = migrateTo(raw, DESIGN_VERSION);
  const tipo = file['tipoDocumento'];
  if (typeof tipo !== 'string' || tipo === '')
    throw new Error('El diseño no indica su tipo de documento.');
  const nombre = file['nombre'];
  const guardado = file['guardado'];
  return {
    formato: DESIGN_FORMAT,
    version: DESIGN_VERSION,
    tipoDocumento: tipo,
    nombre: typeof nombre === 'string' && nombre.trim() ? nombre : 'Diseño sin nombre',
    guardado: typeof guardado === 'string' ? guardado : new Date().toISOString(),
    documento: readDocument(file['documento']),
    fuentes: readFonts(file['fuentes']),
  };
}

export function parseDesign(text: string): DesignFile {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Este archivo no es un diseño válido (no se puede leer).');
  }
  return readDesign(raw);
}
