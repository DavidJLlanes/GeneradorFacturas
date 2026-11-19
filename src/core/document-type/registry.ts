import type { DocumentTypeDefinition } from './types';
import { validateDocumentType } from './validate';

export interface DocumentTypeRegistry {
  list(): readonly DocumentTypeDefinition[];
  get(id: string): DocumentTypeDefinition | undefined;
}

export interface DiscoveredType {
  folder: string;
  definition: DocumentTypeDefinition;
}

// Construye el registro a partir de los tipos encontrados. Falla con un mensaje claro si alguno no
// cumple el contrato o si un id está repetido, para detectar el error al arrancar y no en uso.
export function createRegistry(found: readonly DiscoveredType[]): DocumentTypeRegistry {
  const byId = new Map<string, DocumentTypeDefinition>();
  for (const { folder, definition } of found) {
    const errors = validateDocumentType(definition, folder);
    if (errors.length > 0) {
      throw new Error(`Tipo de documento "${folder}" no válido:\n- ${errors.join('\n- ')}`);
    }
    if (byId.has(definition.id)) throw new Error(`Tipo de documento repetido: "${definition.id}"`);
    byId.set(definition.id, definition);
  }
  const sorted = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return { list: () => sorted, get: (id) => byId.get(id) };
}
