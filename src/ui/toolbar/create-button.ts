import type { Editor } from '../../canvas/editor/create-editor';
import type { ButtonSpec } from './button-spec';

export function createButton(spec: ButtonSpec, editor: Editor): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tb-btn';
  button.title = spec.title;
  button.setAttribute('aria-label', spec.title);
  button.dataset.id = spec.id;
  button.addEventListener('click', () => spec.run(editor));
  // Evita que el botón robe el foco: así la barra espaciadora y las flechas siguen yendo al editor.
  button.addEventListener('mousedown', (e) => e.preventDefault());
  return button;
}
