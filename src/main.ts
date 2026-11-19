import { setSchema } from './canvas/commands/data-commands';
import { createEditor } from './canvas/editor/create-editor';
import { documentTypes } from './core/document-type/discover';
import { createDemoDocument } from './demo/demo-document';
import { mountApp } from './ui/mount-app';
import './ui/base.css';

const root = document.getElementById('app');
if (root) {
  const editor = createEditor(createDemoDocument());
  // Provisional: hasta la Fase 5 se usa el tipo de ejemplo para probar los datos.
  setSchema(editor, documentTypes.get('ejemplo')?.schema ?? null);
  mountApp(root, editor);
}
