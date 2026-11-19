import type { DataValue } from '../../canvas/commands/data-commands';
import type { FieldSpec } from '../../core/document-type/types';
import { centsToInput, parseMoneyToCents } from '../../data/money';
import { createLinesControl } from './lines-control';
import { createImageField } from '../fields/image-field';
import {
  checkField,
  dateField,
  numberField,
  selectField,
  textareaField,
  textField,
} from '../fields/form-fields';

export interface DataControl {
  key: string;
  row: HTMLElement;
  input: HTMLElement;
  /** Refleja el valor guardado en el control. */
  set(value: unknown): void;
  /** Avisa con el valor ya convertido (céntimos en importes) o undefined si se vació. */
  onChange(listener: (value: DataValue) => void): void;
}

const show = (value: unknown): string =>
  value === undefined || value === null ? '' : String(value);

export function createDataControl(spec: FieldSpec): DataControl {
  const label = spec.required ? `${spec.label} *` : spec.label;
  const make = <T extends HTMLInputElement | HTMLTextAreaElement>(
    row: HTMLElement,
    input: T,
    set: (value: unknown) => void,
    read: () => string | number | undefined,
  ): DataControl => ({
    key: spec.key,
    row,
    input,
    set,
    onChange: (fn) => input.addEventListener('change', () => fn(read())),
  });

  switch (spec.kind) {
    case 'choice': {
      const blank = spec.required ? [] : [{ value: '', label: '—' }];
      const { row, input } = selectField(label, [...blank, ...(spec.options ?? [])]);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.value = show(v)),
        onChange: (fn) => input.addEventListener('change', () => fn(input.value || undefined)),
      };
    }
    case 'toggle': {
      const { row, input } = checkField(label);
      return {
        key: spec.key,
        row,
        input,
        set: (v) => void (input.checked = v === true),
        onChange: (fn) => input.addEventListener('change', () => fn(input.checked || undefined)),
      };
    }
    case 'lines':
      return createLinesControl(spec);
    case 'multiline': {
      const { row, input } = textareaField(label, 3);
      return make(
        row,
        input,
        (v) => void (input.value = show(v)),
        () => input.value,
      );
    }
    case 'date': {
      const { row, input } = dateField(label);
      return make(
        row,
        input,
        (v) => void (input.value = show(v)),
        () => input.value || undefined,
      );
    }
    case 'number': {
      const { row, input } = numberField(label, -1e12, 1e12);
      return make(
        row,
        input,
        (v) => void (input.value = show(v)),
        () => (input.value.trim() === '' ? undefined : Number(input.value.replace(',', '.'))),
      );
    }
    case 'money': {
      const { row, input } = textField(label);
      input.placeholder = '0,00';
      input.inputMode = 'decimal';
      return make(
        row,
        input,
        (v) => void (input.value = typeof v === 'number' ? centsToInput(v) : ''),
        () => parseMoneyToCents(input.value) ?? undefined,
      );
    }
    case 'image': {
      const field = createImageField(label);
      return {
        key: spec.key,
        row: field.row,
        input: field.input,
        set: (v) => field.set(v),
        onChange: (fn) => field.onChange(fn),
      };
    }
    default: {
      const { row, input } = textField(label);
      return make(
        row,
        input,
        (v) => void (input.value = show(v)),
        () => input.value,
      );
    }
  }
}
