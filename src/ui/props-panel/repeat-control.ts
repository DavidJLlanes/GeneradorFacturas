import type { DocElement } from '../../core/document/types';
import { checkField } from '../fields/form-fields';

export interface RepeatControl {
  row: HTMLElement;
  input: HTMLInputElement;
  set(selected: readonly DocElement[]): void;
  onChange(listener: (value: boolean) => void): void;
}

// Casilla "Repetir en cada página": sirve para cabeceras, pies y membretes del documento.
export function createRepeatControl(): RepeatControl {
  const field = checkField('Repetir en cada página');
  return {
    row: field.row,
    input: field.input,
    set: (selected) => {
      field.input.checked = selected.length > 0 && selected.every((e) => e.repeat === true);
    },
    onChange: (listener) =>
      field.input.addEventListener('change', () => listener(field.input.checked)),
  };
}
