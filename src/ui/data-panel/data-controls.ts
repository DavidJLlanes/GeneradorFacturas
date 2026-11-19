import type { FieldSpec } from '../../core/document-type/types';
import { centsToInput, parseMoneyToCents } from '../../data/money';
import { dateField, numberField, textareaField, textField } from '../fields/form-fields';

export interface DataControl {
  key: string;
  row: HTMLElement;
  input: HTMLInputElement | HTMLTextAreaElement;
  /** Refleja el valor guardado en el control. */
  set(value: unknown): void;
  /** Avisa con el valor ya convertido (céntimos en importes) o undefined si se vació. */
  onChange(listener: (value: string | number | undefined) => void): void;
}

const show = (value: unknown): string =>
  value === undefined || value === null ? '' : String(value);

export function createDataControl(spec: FieldSpec): DataControl | null {
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
    case 'image':
      return null;
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
