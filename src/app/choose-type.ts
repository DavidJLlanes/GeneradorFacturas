import type { DocumentTypeRegistry } from '../core/document-type/registry';
import type { DocumentTypeDefinition } from '../core/document-type/types';

// Tipo con el que arranca la aplicación: el pedido en la dirección (`#tipo=factura`) o, si no hay
// o no existe, el primero que no sea interno.
export function chooseType(registry: DocumentTypeRegistry, hash: string): DocumentTypeDefinition {
  const requested = new URLSearchParams(hash.replace(/^#/, '')).get('tipo');
  const asked = requested ? registry.get(requested) : undefined;
  const type = asked ?? registry.list().find((t) => !t.internal);
  if (!type) throw new Error('No hay ningún tipo de documento disponible.');
  return type;
}
