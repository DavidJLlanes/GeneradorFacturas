import { createRegistry, type DiscoveredType, type DocumentTypeRegistry } from './registry';
import type { DocumentTypeDefinition } from './types';

// Descubre solo los tipos: cada carpeta de `src/documents/<tipo>/` con un `index.ts` que exporta su
// definición por defecto. No hay lista que editar: añadir una carpeta basta.
const modules = import.meta.glob<{ default: DocumentTypeDefinition }>(
  '../../documents/*/index.ts',
  {
    eager: true,
  },
);

const FOLDER_PATTERN = /documents\/([^/]+)\/index\.ts$/;

export function discoverTypes(): DiscoveredType[] {
  return Object.entries(modules).map(([path, module]) => {
    const folder = FOLDER_PATTERN.exec(path)?.[1] ?? path;
    return { folder, definition: module.default };
  });
}

export const documentTypes: DocumentTypeRegistry = createRegistry(discoverTypes());
