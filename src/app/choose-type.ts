import type { DocumentTypeRegistry } from '../core/document-type/registry';
import type { DocumentTemplate, DocumentTypeDefinition } from '../core/document-type/types';

// Tipo con el que arranca la aplicación: el pedido en la dirección (`#tipo=factura`) o, si no hay
// o no existe, el primero que no sea interno.
// Plantilla con la que arranca el tipo: la pedida en la dirección (`#plantilla=moderna`) o la primera.
export function chooseTemplate(type: DocumentTypeDefinition, hash: string): DocumentTemplate {
  const requested = new URLSearchParams(hash.replace(/^#/, '')).get('plantilla');
  const template = type.templates.find((t) => t.id === requested) ?? type.templates[0];
  if (!template) throw new Error(`El tipo "${type.id}" no tiene plantillas.`);
  return template;
}

export function chooseType(registry: DocumentTypeRegistry, hash: string): DocumentTypeDefinition {
  const requested = new URLSearchParams(hash.replace(/^#/, '')).get('tipo');
  const asked = requested ? registry.get(requested) : undefined;
  const type = asked ?? registry.list().find((t) => !t.internal);
  if (!type) throw new Error('No hay ningún tipo de documento disponible.');
  return type;
}
