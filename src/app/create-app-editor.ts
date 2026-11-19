import { setDataSource } from '../canvas/commands/data-commands';
import { createEditor, type Editor } from '../canvas/editor/create-editor';
import type { DocumentTemplate, DocumentTypeDefinition } from '../core/document-type/types';

// Editor listo para trabajar con un tipo: parte de una de sus plantillas (por defecto la primera) y
// conoce su esquema y cálculos.
export function createAppEditor(type: DocumentTypeDefinition, template?: DocumentTemplate): Editor {
  const start = template ?? type.templates[0];
  if (!start) throw new Error(`El tipo "${type.id}" no tiene plantillas.`);
  const editor = createEditor(start.document);
  setDataSource(editor, { schema: type.schema, compute: type.compute, sample: type.sampleData });
  return editor;
}
