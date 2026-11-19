import { setPalette } from '../../canvas/commands/style-commands';
import type { Editor } from '../../canvas/editor/create-editor';
import { paletteOf } from '../../styles/palette';
import '../dialog/dialog.css';
import { createStyleForm } from './style-form';

let dialog: HTMLDialogElement | null = null;
let load: ((editor: Editor) => void) | null = null;

function build(): void {
  const form = createStyleForm();
  let current: Editor;

  const d = document.createElement('dialog');
  d.className = 'pd';
  d.setAttribute('aria-label', 'Colores y tema');

  const title = document.createElement('h2');
  title.textContent = 'Colores y tema';

  const hint = document.createElement('p');
  hint.className = 'pd-hint';
  hint.textContent =
    'Las piezas con colores de la paleta cambian a la vez. Las que tienen un color propio no.';

  const apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'pd-btn pd-primary';
  apply.textContent = 'Aplicar';
  apply.addEventListener('click', () => {
    setPalette(current, form.palette());
    d.close();
  });

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'pd-btn';
  cancel.textContent = 'Cancelar';
  cancel.addEventListener('click', () => d.close());

  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(cancel, apply);

  d.append(title, hint, form.element, actions);
  document.body.append(d);

  dialog = d;
  load = (editor) => {
    current = editor;
    form.load(paletteOf(editor.doc()));
  };
}

export function openStyleDialog(editor: Editor): void {
  if (!dialog || !load) build();
  load?.(editor);
  dialog?.showModal();
}
