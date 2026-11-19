import type { Editor } from '../../canvas/editor/create-editor';
import '../dialog/dialog.css';
import '../files-dialog/files-dialog.css';
import { getSession } from '../../storage/session/session-context';
import { publicTypes, templateCards } from './gallery-cards';
import './gallery.css';

let dialog: HTMLDialogElement | null = null;
let refresh: (() => void) | null = null;

function build(editor: Editor): void {
  const d = document.createElement('dialog');
  d.className = 'pd gl';
  d.setAttribute('aria-label', 'Galería de plantillas');

  const title = document.createElement('h2');
  title.textContent = 'Galería de plantillas';
  const hint = document.createElement('p');
  hint.className = 'pd-hint';
  hint.textContent =
    'Elige una plantilla de partida. Si es de otro tipo de documento, la página se abre en ese tipo.';
  const status = document.createElement('p');
  status.className = 'fd-status';
  status.setAttribute('role', 'status');

  const chips = document.createElement('div');
  chips.className = 'gl-chips';
  const grid = document.createElement('div');
  grid.className = 'fd-grid gl-grid';
  let selected: string | null = null;

  const close = (): void => d.close();
  const say = (message: string): void => {
    status.textContent = message;
  };
  const draw = (): void => {
    chips.replaceChildren(
      ...[{ id: null, name: 'Todos' }, ...publicTypes()].map((t) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'gl-chip';
        chip.textContent = t.name;
        chip.dataset['type'] = t.id ?? 'todos';
        chip.setAttribute('aria-pressed', String(t.id === selected));
        chip.addEventListener('click', () => {
          selected = t.id;
          draw();
        });
        return chip;
      }),
    );
    grid.replaceChildren(...templateCards(editor, selected, say, close));
  };

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'pd-btn';
  closeButton.textContent = 'Cerrar';
  closeButton.addEventListener('click', close);
  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(closeButton);

  d.append(title, hint, chips, status, grid, actions);
  document.body.append(d);
  dialog = d;
  refresh = () => {
    selected = getSession().typeId;
    status.textContent = '';
    draw();
  };
}

export function openGalleryDialog(editor: Editor): void {
  if (!dialog?.isConnected) build(editor);
  refresh?.();
  dialog?.showModal();
}
