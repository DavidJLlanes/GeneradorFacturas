import { fontStack } from '../../fonts/catalog';
import { fontLabel } from '../../fonts/font-label';
import { ensureFont } from '../../fonts/load-font';
import { pickFont } from '../font-picker/font-picker';

export interface FontField {
  row: HTMLElement;
  /** Botón que abre el buscador; sirve para saber si el usuario está editando el campo. */
  input: HTMLButtonElement;
  set(id: string | undefined): void;
  onChange(listener: (id: string) => void): void;
}

// Campo de fuente: un botón con el nombre de la fuente elegida, escrito en esa misma fuente.
export function createFontField(label: string): FontField {
  const row = document.createElement('div');
  row.className = 'pd-row fof';
  const span = document.createElement('span');
  span.textContent = label;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pd-btn fof-button';
  row.append(span, button);

  let value = '';
  const show = (id: string): void => {
    value = id;
    ensureFont(id);
    button.textContent = fontLabel(id);
    button.style.fontFamily = fontStack(id);
  };
  show('');

  return {
    row,
    input: button,
    set: (id) => show(id ?? ''),
    onChange(listener) {
      button.addEventListener('click', () => {
        void pickFont(value).then((id) => {
          if (id === null || id === value) return;
          show(id);
          listener(id);
        });
      });
    },
  };
}
