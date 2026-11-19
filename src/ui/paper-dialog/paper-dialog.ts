import type { Editor } from '../../canvas/editor/create-editor';
import { changePage } from '../../canvas/commands/page-commands';
import { createPaperForm } from './paper-form';
import '../dialog/dialog.css';

let dialog: HTMLDialogElement | null = null;
let load: ((editor: Editor) => void) | null = null;

function build(): void {
  const form = createPaperForm();
  let current: Editor;

  const d = document.createElement('dialog');
  d.className = 'pd';
  d.setAttribute('aria-label', 'Papel');

  const title = document.createElement('h2');
  title.textContent = 'Papel';

  const apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'pd-btn pd-primary';
  apply.textContent = 'Aplicar';
  apply.addEventListener('click', () => {
    changePage(current, form.page(), form.adapt());
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

  form.onShowMargins((value) => current.ui.update((s) => ({ ...s, showMargins: value })));
  d.append(title, form.element, actions);
  document.body.append(d);

  dialog = d;
  load = (editor) => {
    current = editor;
    form.load(editor.doc().page, editor.ui.get().showMargins);
  };
}

export function openPaperDialog(editor: Editor): void {
  if (!dialog || !load) build();
  load?.(editor);
  dialog?.showModal();
}
