import type { Editor } from '../../canvas/editor/create-editor';
import { createRng } from '../../random/rng';
import { randomDesign, type RandomDesign } from '../../random/random-design';
import { buildDesign } from '../../storage/design-file/build-design';
import { thumbnailSvg } from '../../storage/local/thumbnail';
import { openDesign } from '../../storage/session/open-design';
import { getSession } from '../../storage/session/session-context';
import '../dialog/dialog.css';
import '../files-dialog/files-dialog.css';
import { publicTypes } from './gallery-cards';
import './gallery.css';

let dialog: HTMLDialogElement | null = null;
let reset: (() => void) | null = null;

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
  d.className = 'pd gl';
  d.setAttribute('aria-label', 'Modo aleatorio');

  const title = document.createElement('h2');
  title.textContent = 'Modo aleatorio';
  const hint = document.createElement('p');
  hint.className = 'pd-hint';
  hint.textContent =
    'Genera un diseño completo (plantilla, colores, fuente y datos ficticios) para no empezar de cero. Si no te gusta, pide otro.';
  const status = document.createElement('p');
  status.className = 'fd-status';
  status.setAttribute('role', 'status');

  const select = document.createElement('select');
  select.className = 'fd-name';
  select.setAttribute('aria-label', 'Tipo de documento');
  for (const type of publicTypes()) {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = type.name;
    select.append(option);
  }

  const preview = document.createElement('img');
  preview.className = 'fd-thumb gl-preview';
  preview.alt = 'Vista previa del diseño generado';
  const summary = document.createElement('p');
  summary.className = 'pd-hint';

  let current: RandomDesign | null = null;
  const generate = (): void => {
    const type = publicTypes().find((t) => t.id === select.value);
    if (!type) return;
    current = randomDesign(type, createRng(Math.floor(Math.random() * 2 ** 32)));
    preview.src = thumbnailSvg(current.template.document);
    preview.hidden = false;
    summary.textContent = `${type.name}: ${current.summary}`;
    use.disabled = false;
  };

  const use = button('Usar este diseño', () => {
    const type = publicTypes().find((t) => t.id === select.value);
    if (!current || !type) return;
    const file = buildDesign(current.template.document, type.id, current.template.name);
    openDesign(editor, file, current.data).then(
      (result) => {
        if (result === 'here') d.close();
      },
      (error: unknown) => {
        status.textContent = error instanceof Error ? error.message : 'No se pudo abrir.';
      },
    );
  });
  use.disabled = true;
  const again = button('Otro al azar', generate);
  select.addEventListener('change', generate);
  const close = button('Cerrar', () => d.close());
  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(again, use, close);

  d.append(title, hint, select, status, preview, summary, actions);
  document.body.append(d);
  dialog = d;
  reset = () => {
    select.value = getSession().typeId;
    status.textContent = '';
    generate();
  };
}

export function openRandomDialog(editor: Editor): void {
  if (!dialog?.isConnected) build(editor);
  reset?.();
  dialog?.showModal();
}
