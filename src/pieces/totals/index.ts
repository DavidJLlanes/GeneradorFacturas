import type { PieceDefinition } from '../types';
import { renderTotals } from './render';

const definition: PieceDefinition = {
  kind: 'totals',
  name: 'Totales',
  defaultSize: { w: 75, h: 24 },
  defaultProps: {
    rows: 'Base imponible | {{subtotal}}\nIVA | {{iva}}\nTotal | {{total}}',
    fontSize: 10,
    color: '#1d2025',
    rowHeight: 7,
    hideUnresolved: false,
    highlightLast: true,
    highlightFill: '#e5e7eb',
    ruleColor: '#374151',
  },
  props: [
    { key: 'rows', label: 'Filas (Etiqueta | {{campo}})', kind: 'multiline' },
    { key: 'fontSize', label: 'Tamaño (pt)', kind: 'number', min: 4, max: 40, step: 0.5 },
    { key: 'color', label: 'Color del texto', kind: 'color' },
    { key: 'rowHeight', label: 'Alto de fila (mm)', kind: 'number', min: 2, max: 50, step: 0.5 },
    { key: 'hideUnresolved', label: 'Ocultar filas sin valor (con datos)', kind: 'toggle' },
    { key: 'highlightLast', label: 'Destacar la última fila', kind: 'toggle' },
    { key: 'highlightFill', label: 'Fondo destacado', kind: 'color' },
    { key: 'ruleColor', label: 'Color de la línea', kind: 'color' },
  ],
  inlineProp: 'rows',
  render: renderTotals,
};

export default definition;
