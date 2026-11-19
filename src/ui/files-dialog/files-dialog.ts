import type { Editor } from '../../canvas/editor/create-editor';
import '../dialog/dialog.css';
import { exportData, exportDesign, importData, importDesign } from './file-actions';
import { createStorageSection } from './storage-section';
import { createTemplatesSection } from './templates-section';
import './files-dialog.css';

let dialog: HTMLDialogElement | null = null;
let refreshAll: (() => void) | null = null;

const button = (text: string, onClick: () => void): HTMLButtonElement => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'pd-btn';
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
};

function build(editor: Editor): void {
  const d = document.createElement('dialog');
  d.className = 'pd fd';
  d.setAttribute('aria-label', 'Archivo');

  const title = document.createElement('h2');
  title.textContent = 'Archivo';
  const status = document.createElement('p');
  status.className = 'fd-status';
  status.setAttribute('role', 'status');
  const say = (message: string): void => {
    status.textContent = message;
  };
  const run = (action: () => string | Promise<string>): void => {
    void Promise.resolve()
      .then(action)
      .then((message) => message && say(message))
      .catch((error: unknown) => say(error instanceof Error ? error.message : 'Algo ha fallado.'));
  };

  const name = document.createElement('input');
  name.type = 'text';
  name.className = 'fd-name';
  name.placeholder = 'Nombre del diseño';
  name.value = 'Mi diseño';
  name.setAttribute('aria-label', 'Nombre del diseño');

  const files = document.createElement('section');
  files.className = 'fd-section';
  const filesTitle = document.createElement('h3');
  filesTitle.textContent = 'Archivos';
  const filesHint = document.createElement('p');
  filesHint.className = 'pd-hint';
  filesHint.textContent =
    'El diseño y los datos van en archivos distintos: el diseño lleva las fuentes propias; los datos, lo que has rellenado.';
  const row1 = document.createElement('div');
  row1.className = 'fd-row';
  row1.append(
    button('Guardar diseño', () => run(() => exportDesign(editor, name.value))),
    button('Abrir diseño…', () => run(() => importDesign(editor))),
  );
  const row2 = document.createElement('div');
  row2.className = 'fd-row';
  row2.append(
    button('Guardar datos', () => run(() => exportData(editor))),
    button('Abrir datos…', () => run(() => importData(editor))),
  );
  files.append(filesTitle, filesHint, name, row1, row2);

  const templates = createTemplatesSection(editor, say, () => name.value);
  const storage = createStorageSection(say);

  const close = button('Cerrar', () => d.close());
  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(close);

  d.append(title, status, files, templates.element, storage.element, actions);
  document.body.append(d);
  dialog = d;
  refreshAll = () => {
    status.textContent = '';
    void templates.refresh();
    void storage.refresh();
  };
}

export function openFilesDialog(editor: Editor): void {
  if (!dialog?.isConnected) build(editor);
  refreshAll?.();
  dialog?.showModal();
}
