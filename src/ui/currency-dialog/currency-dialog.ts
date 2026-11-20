import { setCurrency } from '../../canvas/commands/style-commands';
import type { Editor } from '../../canvas/editor/create-editor';
import { CURRENCIES, currencyOf } from '../../data/currency';
import { selectField } from '../fields/form-fields';
import '../dialog/dialog.css';

let dialog: HTMLDialogElement | null = null;
let load: ((editor: Editor) => void) | null = null;

function build(): void {
  const d = document.createElement('dialog');
  d.className = 'pd';
  d.setAttribute('aria-label', 'Moneda');
  const title = document.createElement('h2');
  title.textContent = 'Moneda';
  const hint = document.createElement('p');
  hint.className = 'pd-hint';
  hint.textContent =
    'Cambia el símbolo y el formato de todos los importes del documento. No convierte cantidades: 100 € pasan a ser 100 en la moneda elegida.';

  const field = selectField(
    'Moneda de los importes',
    CURRENCIES.map((c) => ({ value: c.code, label: c.label })),
  );
  const fields = document.createElement('div');
  fields.className = 'pd-fields';
  fields.append(field.row);

  let current: Editor;
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'pd-btn';
  cancel.textContent = 'Cancelar';
  cancel.addEventListener('click', () => d.close());
  const apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'pd-btn pd-primary';
  apply.textContent = 'Aplicar';
  apply.addEventListener('click', () => {
    setCurrency(current, field.input.value);
    d.close();
  });
  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(cancel, apply);

  d.append(title, hint, fields, actions);
  document.body.append(d);
  dialog = d;
  load = (editor) => {
    current = editor;
    field.input.value = currencyOf(editor.doc());
  };
}

export function openCurrencyDialog(editor: Editor): void {
  if (!dialog?.isConnected) build();
  load?.(editor);
  dialog?.showModal();
}
