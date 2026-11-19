import type { DataSchema, DocumentData } from '../core/document-type/types';
import { formatFieldValue } from './format-field';
import { resolveVariables, type MissingPolicy } from './variables';

// Devuelve la función que rellena las variables de un texto con los datos del documento.
export function makeResolver(
  schema: DataSchema | null,
  data: DocumentData,
  missing: MissingPolicy = 'keep',
): (text: string) => string {
  const fields = new Map(schema?.fields.map((f) => [f.key, f]));
  const lookup = (key: string): string | undefined => {
    const field = fields.get(key);
    const text = formatFieldValue(field?.kind ?? 'text', data[key], field?.options);
    return text === '' ? undefined : text;
  };
  return (text) => resolveVariables(text, lookup, missing);
}
