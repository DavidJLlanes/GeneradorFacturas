import type { PropValue } from '../../core/document/types';
import type { PropSpec } from '../../pieces/types';
import {
  checkField,
  colorField,
  numberField,
  selectField,
  textareaField,
  textField,
} from '../fields/form-fields';

// Un control de formulario ligado a una propiedad. `set` refleja el valor actual en el control;
// `onChange` avisa solo cuando el usuario termina de editar (no en cada tecla).
export interface PropControl {
  key: string;
  row: HTMLElement;
  input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  set(value: PropValue | undefined): void;
  onChange(listener: (value: PropValue) => void): void;
}

const clamp = (v: number, spec: PropSpec): number =>
  Math.min(spec.max ?? Infinity, Math.max(spec.min ?? -Infinity, v));

export function createPropControl(spec: PropSpec): PropControl {
  switch (spec.kind) {
    case 'toggle': {
      const { row, input } = checkField(spec.label);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.checked = v === true),
        onChange: (fn) => input.addEventListener('change', () => fn(input.checked)),
      };
    }
    case 'number': {
      const { row, input } = numberField(spec.label, spec.min ?? 0, spec.max ?? 1e6);
      if (spec.step) input.step = String(spec.step);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.value = v === undefined ? '' : String(v)),
        onChange: (fn) =>
          input.addEventListener('change', () => {
            const value = Number(input.value.replace(',', '.'));
            if (Number.isFinite(value) && input.value.trim() !== '') fn(clamp(value, spec));
          }),
      };
    }
    case 'color': {
      const { row, input } = colorField(spec.label);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.value = typeof v === 'string' ? v : '#000000'),
        onChange: (fn) => input.addEventListener('change', () => fn(input.value)),
      };
    }
    case 'select': {
      const { row, input } = selectField(spec.label, spec.options ?? []);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.value = String(v ?? '')),
        onChange: (fn) => input.addEventListener('change', () => fn(input.value)),
      };
    }
    case 'multiline': {
      const { row, input } = textareaField(spec.label);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.value = String(v ?? '')),
        onChange: (fn) => input.addEventListener('change', () => fn(input.value)),
      };
    }
    default: {
      const { row, input } = textField(spec.label);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.value = String(v ?? '')),
        onChange: (fn) => input.addEventListener('change', () => fn(input.value)),
      };
    }
  }
}
