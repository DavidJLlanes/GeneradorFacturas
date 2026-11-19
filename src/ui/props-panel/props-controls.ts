import type { PropValue } from '../../core/document/types';
import type { PropSpec } from '../../pieces/types';
import type { Palette } from '../../styles/palette';
import { createImageField } from '../fields/image-field';
import { createPaletteColorField } from '../fields/palette-color-field';
import {
  checkField,
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

export function createPropControl(spec: PropSpec, getPalette: () => Palette): PropControl {
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
      const field = createPaletteColorField(spec.label, getPalette);
      return {
        key: spec.key,
        row: field.row,
        input: field.input,
        set: (v) => field.set(typeof v === 'string' ? v : undefined),
        onChange: (fn) => field.onChange(fn),
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
    case 'image': {
      const field = createImageField(spec.label);
      return {
        key: spec.key,
        row: field.row,
        input: field.input,
        set: (v) => field.set(v),
        onChange: (fn) => field.onChange((src) => fn(src ?? '')),
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
