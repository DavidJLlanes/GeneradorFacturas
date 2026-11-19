import type { PieceDefinition } from '../types';
import { renderTable } from './render';

const definition: PieceDefinition = {
  kind: 'table',
  name: 'Tabla de líneas',
  defaultSize: { w: 180, h: 100 },
  defaultProps: {
    field: 'lineas',
    fontSize: 9,
    color: '@text',
    headerFill: '@primary',
    headerColor: '@onPrimary',
    zebra: true,
    zebraFill: '@soft',
    grid: 'horizontal',
    gridColor: '@line',
    gridWidth: 0.2,
    headerBold: true,
    cellPadding: 1.5,
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
    {
      key: 'gridWidth',
      label: 'Grosor de líneas (mm)',
      kind: 'number',
      min: 0.05,
      max: 3,
      step: 0.05,
    },
    { key: 'headerBold', label: 'Cabecera en negrita', kind: 'toggle' },
    {
      key: 'cellPadding',
      label: 'Margen de celda (mm)',
      kind: 'number',
      min: 0,
      max: 10,
      step: 0.5,
    },
    { key: 'rowHeight', label: 'Alto de fila (mm)', kind: 'number', min: 2, max: 50, step: 0.5 },
    { key: 'minRows', label: 'Filas mínimas', kind: 'number', min: 0, max: 100, step: 1 },
  ],
  render: renderTable,
};

export default definition;
