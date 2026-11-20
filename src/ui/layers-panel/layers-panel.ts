import { toggleElementFlag } from '../../canvas/commands/flag-commands';
import type { Editor } from '../../canvas/editor/create-editor';
import { toggleId } from '../../canvas/selection/selection-ops';
import type { DocElement } from '../../core/document/types';
import './layers-panel.css';

const iconButton = (
  className: string,
  text: string,
  label: string,
  onClick: () => void,
): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `lp-icon ${className}`;
  button.textContent = text;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick();
  });
  button.addEventListener('mousedown', (e) => e.preventDefault());
  return button;
};

function createRow(editor: Editor, el: DocElement, selected: boolean): HTMLElement {
  const row = document.createElement('li');
  row.className = 'lp-row';
  row.classList.toggle('is-selected', selected);
  row.classList.toggle('is-hidden', el.hidden);

  const eye = iconButton(
    'lp-eye',
    el.hidden ? '○' : '●',
    el.hidden ? 'Mostrar capa' : 'Ocultar capa',
    () => toggleElementFlag(editor, el.id, 'hidden'),
  );
  const lock = iconButton(
    'lp-lock',
    el.locked ? '🔒' : '🔓',
    el.locked ? 'Desbloquear capa' : 'Bloquear capa',
    () => toggleElementFlag(editor, el.id, 'locked'),
  );

  // El nombre es un botón: así se puede elegir la capa con el teclado (Tab y Enter o Espacio).
  const name = document.createElement('button');
  name.type = 'button';
  name.className = 'lp-name';
  name.textContent = el.name;
  name.setAttribute('aria-pressed', String(selected));

  row.append(eye, lock, name);
  row.addEventListener('click', (e) => {
    const current = editor.ui.get().selection;
    editor.select(e.shiftKey || e.ctrlKey || e.metaKey ? toggleId(current, el.id) : [el.id]);
  });
  return row;
}

// Lista de capas: la de arriba es la que queda por encima en la página.
export function createLayersPanel(editor: Editor): { element: HTMLElement; destroy(): void } {
  const root = document.createElement('aside');
  root.className = 'lp';
  const heading = document.createElement('h2');
  heading.className = 'lp-title';
  heading.textContent = 'Capas';
  const list = document.createElement('ul');
  list.className = 'lp-list';
  root.append(heading, list);

  let lastSignature = '';
  const render = (): void => {
    const doc = editor.doc();
    const selection = editor.ui.get().selection;
    // Durante un arrastre solo cambian posiciones: no hace falta reconstruir la lista.
    const signature =
      doc.elements.map((e) => `${e.id}|${e.name}|${e.locked}|${e.hidden}`).join(';') +
      `#${selection.join(',')}`;
    if (signature === lastSignature) return;
    lastSignature = signature;

    const rows = [...doc.elements]
      .reverse()
      .map((el) => createRow(editor, el, selection.includes(el.id)));
    if (rows.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'lp-empty';
      empty.textContent = 'Sin elementos';
      list.replaceChildren(empty);
    } else {
      list.replaceChildren(...rows);
    }
  };
  render();

  return { element: root, destroy: editor.onChange(render) };
}
