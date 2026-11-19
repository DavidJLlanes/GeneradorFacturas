import { setDataSource } from '../canvas/commands/data-commands';
import { createEditor, type Editor } from '../canvas/editor/create-editor';
import type { DocumentTypeDefinition } from '../core/document-type/types';

// Editor listo para trabajar con un tipo: parte de su primera plantilla y conoce su esquema y cálculos.
export function createAppEditor(type: DocumentTypeDefinition): Editor {
  const first = type.templates[0];
  if (!first) throw new Error(`El tipo "${type.id}" no tiene plantillas.`);
  const editor = createEditor(first.document);
  setDataSource(editor, { schema: type.schema, compute: type.compute, sample: type.sampleData });
  return editor;
}
