import type { PieceDefinition } from '../types';
import { renderTable } from './render';

const definition: PieceDefinition = {
  kind: 'table',
  name: 'Tabla de líneas',
  defaultSize: { w: 180, h: 100 },
  defaultProps: {
    field: 'lineas',
    fontSize: 9,
    color: '#1d2025',
    headerFill: '#1f2937',
    headerColor: '#ffffff',
    zebra: true,
    zebraFill: '#f3f4f6',
    grid: 'horizontal',
    gridColor: '#d1d5db',
    rowHeight: 7,
    minRows: 10,
  },
  props: [
    { key: 'field', label: 'Campo de líneas', kind: 'text' },
    { key: 'fontSize', label: 'Tamaño (pt)', kind: 'number', min: 4, max: 40, step: 0.5 },
    { key: 'color', label: 'Color del texto', kind: 'color' },
    { key: 'headerFill', label: 'Fondo de cabecera', kind: 'color' },
    { key: 'headerColor', label: 'Texto de cabecera', kind: 'color' },
    { key: 'zebra', label: 'Filas alternas', kind: 'toggle' },
    { key: 'zebraFill', label: 'Color de filas alternas', kind: 'color' },
    {
      key: 'grid',
      label: 'Rejilla',
      kind: 'select',
      options: [
        { value: 'none', label: 'Sin rejilla' },
        { value: 'horizontal', label: 'Solo horizontal' },
        { value: 'full', label: 'Completa' },
      ],
    },
    { key: 'gridColor', label: 'Color de la rejilla', kind: 'color' },
    { key: 'rowHeight', label: 'Alto de fila (mm)', kind: 'number', min: 2, max: 50, step: 0.5 },
    { key: 'minRows', label: 'Filas mínimas', kind: 'number', min: 0, max: 100, step: 1 },
  ],
  render: renderTable,
};

export default definition;
