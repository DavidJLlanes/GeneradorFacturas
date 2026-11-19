import type { Editor } from '../../canvas/editor/create-editor';
import type { ButtonSpec } from './button-spec';
import { commitActiveField } from './commit-active-field';

export function createButton(spec: ButtonSpec, editor: Editor): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tb-btn';
  button.title = spec.title;
  button.setAttribute('aria-label', spec.title);
  button.dataset.id = spec.id;
  button.addEventListener('click', () => spec.run(editor));
  // Evita que el botón robe el foco: así la barra espaciadora y las flechas siguen yendo al editor.
  // Antes se confirma lo que se estuviera escribiendo, para que la acción vea el dato ya guardado.
  button.addEventListener('mousedown', (e) => {
    commitActiveField();
    e.preventDefault();
  });
  return button;
}
