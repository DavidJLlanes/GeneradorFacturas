import type { ColumnSpec, LineRow } from '../../core/document-type/types';
import { formatCents } from '../../data/money';
import { mmToPx } from '../../core/units/units';
import { bool, num, str } from '../shared/props';
import { applyFont } from '../shared/text-style';
import type { PieceRenderInput } from '../types';

const PX_PER_PT = 96 / 72;
const numberFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 6 });

function cellText(column: ColumnSpec, value: string | number | undefined): string {
  if (value === undefined || value === '') return '';
  if (column.kind === 'money') return typeof value === 'number' ? formatCents(value) : '';
  if (column.kind === 'choice')
    return column.options?.find((o) => o.value === value)?.label ?? String(value);
  if (column.kind === 'number')
    return typeof value === 'number' ? numberFormat.format(value) : String(value);
  return String(value);
}

const cell = (
  text: string,
  column: ColumnSpec,
  paddingMm: number,
  style: Partial<CSSStyleDeclaration>,
): HTMLElement => {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.padding = `0 ${mmToPx(paddingMm)}px`;
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = column.kind === 'text' ? 'flex-start' : 'flex-end';
  div.style.overflow = 'hidden';
  div.style.minWidth = '0';
  Object.assign(div.style, style);
  return div;
};

function message(node: HTMLElement, text: string): void {
  node.style.display = 'flex';
  node.style.alignItems = 'center';
  node.style.justifyContent = 'center';
  node.style.border = '1px dashed #8a919c';
  node.style.color = '#8a919c';
  node.style.fontSize = '12px';
  node.textContent = text;
}

// Tabla de líneas: las columnas las define el campo de líneas del esquema del tipo y las filas salen
// de los datos. Sin datos (plantilla limpia) se dibujan filas vacías para ver el diseño.
export function renderTable(node: HTMLElement, { props, schema, value }: PieceRenderInput): void {
  node.style.border = 'none';
  node.style.background = 'transparent';
  const field = schema?.fields.find((f) => f.key === str(props, 'field') && f.kind === 'lines');
  const columns = field?.columns;
  if (!columns || columns.length === 0) {
    message(node, 'Tabla: elige un campo de líneas');
    return;
  }

  const raw = value(field.key);
  const rows: readonly LineRow[] = Array.isArray(raw) ? (raw as LineRow[]) : [];
  const rowHeight = mmToPx(Math.max(num(props, 'rowHeight'), 2));
  const emptyRows = Math.max(0, Math.round(num(props, 'minRows')) - rows.length);
  const grid = str(props, 'grid');
  const line = `${mmToPx(num(props, 'gridWidth') || 0.2)}px solid ${str(props, 'gridColor')}`;
  const pad = num(props, 'cellPadding');

  node.style.display = 'grid';
  node.style.gridTemplateColumns = columns.map((c) => `${c.width}fr`).join(' ');
  node.style.gridAutoRows = `${rowHeight}px`;
  node.style.alignContent = 'start';
  applyFont(node, str(props, 'fontFamily'));
  node.style.fontSize = `${num(props, 'fontSize') * PX_PER_PT}px`;
  node.style.color = str(props, 'color');
  node.style.whiteSpace = 'nowrap';
  node.style.overflow = 'hidden';

  const cells: HTMLElement[] = columns.map((c) =>
    cell(c.label, c, pad, {
      background: str(props, 'headerFill'),
      color: str(props, 'headerColor'),
      fontWeight: bool(props, 'headerBold') ? '700' : '400',
    }),
  );
  const all = [...rows, ...Array.from({ length: emptyRows }, (): LineRow => ({}))];
  all.forEach((row, r) => {
    const zebra = bool(props, 'zebra') && r % 2 === 1 ? str(props, 'zebraFill') : 'transparent';
    columns.forEach((c, i) => {
      const style: Partial<CSSStyleDeclaration> = { background: zebra };
      if (grid !== 'none') style.borderBottom = line;
      if (grid === 'full' && i > 0) style.borderLeft = line;
      cells.push(cell(cellText(c, row[c.key]), c, pad, style));
    });
  });
  node.replaceChildren(...cells);
}
