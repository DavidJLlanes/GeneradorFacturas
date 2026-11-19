import type { ColumnSpec, FieldSpec, LineRow } from '../../core/document-type/types';
import { centsToInput, parseMoneyToCents } from '../../data/money';
import { numberField, textField } from '../fields/form-fields';
import type { DataControl } from './data-controls';

type Cell = string | number | undefined;

function cellInput(column: ColumnSpec, value: Cell, onChange: (value: Cell) => void): HTMLElement {
  if (column.kind === 'number') {
    const { row, input } = numberField(column.label, -1e12, 1e12);
    input.value = value === undefined ? '' : String(value);
    input.addEventListener('change', () =>
      onChange(input.value.trim() === '' ? undefined : Number(input.value.replace(',', '.'))),
    );
    return row;
  }
  const { row, input } = textField(column.label);
  if (column.kind === 'money') {
    input.placeholder = '0,00';
    input.inputMode = 'decimal';
    input.value = typeof value === 'number' ? centsToInput(value) : '';
    input.addEventListener('change', () => onChange(parseMoneyToCents(input.value) ?? undefined));
  } else {
    input.value = value === undefined ? '' : String(value);
    input.addEventListener('change', () => onChange(input.value));
  }
  return row;
}

const button = (text: string, className: string, onClick: () => void): HTMLButtonElement => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `pd-btn ${className}`;
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
};

// Editor de un campo de líneas: una tarjeta por línea, con sus columnas editables, y botones para
// añadir y quitar líneas. Las columnas calculadas no se editan.
export function createLinesControl(spec: FieldSpec): DataControl {
  const columns = (spec.columns ?? []).filter((c) => !c.computed);
  const row = document.createElement('div');
  row.className = 'dl';
  const title = document.createElement('span');
  title.className = 'dl-title';
  title.textContent = spec.label;
  const list = document.createElement('div');
  list.className = 'dl-list';
  const add = button('+ Añadir línea', 'dl-add', () => commit([...rows, {}]));
  row.append(title, list, add);

  let rows: readonly LineRow[] = [];
  const listeners: ((value: readonly LineRow[]) => void)[] = [];

  const commit = (next: readonly LineRow[]): void => {
    rows = next;
    draw();
    listeners.forEach((fn) => fn(rows));
  };

  const edit = (index: number, key: string, value: Cell): void => {
    const next = rows.map((r, i) => {
      if (i !== index) return r;
      const copy: Record<string, string | number> = { ...r };
      if (value === undefined || value === '') delete copy[key];
      else copy[key] = value;
      return copy;
    });
    rows = next;
    listeners.forEach((fn) => fn(rows));
  };

  function draw(): void {
    list.replaceChildren(
      ...rows.map((r, index) => {
        const card = document.createElement('div');
        card.className = 'dl-card';
        for (const column of columns) {
          card.append(cellInput(column, r[column.key], (v) => edit(index, column.key, v)));
        }
        card.append(
          button('Quitar', 'dl-remove', () => commit(rows.filter((_, i) => i !== index))),
        );
        return card;
      }),
    );
  }

  return {
    key: spec.key,
    row,
    input: add as unknown as HTMLInputElement,
    set(value) {
      const next = Array.isArray(value) ? (value as LineRow[]) : [];
      // Si el cambio vino de este mismo control, no se reconstruye (se perdería el foco).
      if (JSON.stringify(next) === JSON.stringify(rows)) return;
      rows = next;
      draw();
    },
    onChange: (fn) => listeners.push((value) => fn(value as never)),
  };
}
