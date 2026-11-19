import type { Editor } from '../../canvas/editor/create-editor';
import type { PrintMode } from '../../pdf/build-print-root';
import { pageCountFor, printDocument } from '../../pdf/print-document';
import { paperLabel } from '../../paper/paper-label';
import { selectField } from '../fields/form-fields';
import '../dialog/dialog.css';

let dialog: HTMLDialogElement | null = null;
let refresh: ((editor: Editor) => void) | null = null;

function build(): void {
  const d = document.createElement('dialog');
  d.className = 'pd';
  d.setAttribute('aria-label', 'Exportar a PDF');

  const title = document.createElement('h2');
  title.textContent = 'Exportar a PDF';

  const content = selectField('Contenido', [
    { value: 'filled', label: 'Documento relleno (con los datos)' },
    { value: 'clean', label: 'Modelo limpio (para rellenar a mano)' },
  ]);
  const info = document.createElement('p');
  info.className = 'pd-hint';

  const steps = document.createElement('ol');
  steps.className = 'pd-steps';
  for (const text of [
    'Se abre el diálogo de impresión del navegador.',
    'En «Destino» elige «Guardar como PDF».',
    'Márgenes: «Ninguno», y desactiva «Encabezados y pies de página».',
  ]) {
    const li = document.createElement('li');
    li.textContent = text;
    steps.append(li);
  }

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'pd-btn';
  cancel.textContent = 'Cancelar';
  cancel.addEventListener('click', () => d.close());

  const print = document.createElement('button');
  print.type = 'button';
  print.className = 'pd-btn pd-primary';
  print.textContent = 'Abrir impresión';

  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(cancel, print);

  const fields = document.createElement('div');
  fields.className = 'pd-fields';
  fields.append(content.row);
  d.append(title, fields, info, steps, actions);
  document.body.append(d);

  let current: Editor;
  const mode = (): PrintMode => (content.input.value === 'clean' ? 'clean' : 'filled');
  const update = (): void => {
    const pages = pageCountFor(current, mode());
    const paper = paperLabel(current.doc().page);
    info.textContent = `${paper} · ${pages} ${pages === 1 ? 'página' : 'páginas'}. El PDF es vectorial: el texto se puede seleccionar.`;
  };
  content.input.addEventListener('change', update);
  print.addEventListener('click', () => {
    d.close();
    void printDocument(current, mode());
  });

  dialog = d;
  refresh = (editor) => {
    current = editor;
    update();
  };
}

export function openPdfDialog(editor: Editor): void {
  if (!dialog || !refresh) build();
  refresh?.(editor);
  dialog?.showModal();
}
