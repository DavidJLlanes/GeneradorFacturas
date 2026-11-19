// Variables en textos: `{{cliente.nombre}}`. La clave sigue el esquema del tipo de documento.

const VARIABLE = /\{\{\s*([a-zA-Z][A-Za-z0-9]*(?:\.[a-zA-Z][A-Za-z0-9]*)*)\s*\}\}/g;

export type MissingPolicy = 'keep' | 'empty';

// Sustituye cada variable por su valor. Si no hay valor, deja la variable tal cual ('keep') o la
// quita ('empty'; es lo que se usa al generar el PDF final).
export function resolveVariables(
  text: string,
  lookup: (key: string) => string | undefined,
  missing: MissingPolicy = 'keep',
): string {
  return text.replace(VARIABLE, (whole, key: string) => {
    const value = lookup(key);
    if (value !== undefined) return value;
    return missing === 'keep' ? whole : '';
  });
}

export function findVariables(text: string): string[] {
  return [...new Set([...text.matchAll(VARIABLE)].map((m) => m[1] ?? ''))];
}
