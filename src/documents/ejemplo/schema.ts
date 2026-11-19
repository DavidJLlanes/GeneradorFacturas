import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'titulo', label: 'Título', kind: 'text', group: 'Documento', required: true },
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'Documento' },
    { key: 'logo', label: 'Logo', kind: 'image', group: 'Documento' },
    { key: 'destinatario.nombre', label: 'Nombre', kind: 'text', group: 'Destinatario' },
    {
      key: 'lineas',
      label: 'Líneas',
      kind: 'lines',
      group: 'Líneas',
      columns: [
        { key: 'concepto', label: 'Concepto', kind: 'text', width: 5 },
        { key: 'cantidad', label: 'Cant.', kind: 'number', width: 1.2 },
        { key: 'precio', label: 'Precio', kind: 'money', width: 2 },
        { key: 'importe', label: 'Importe', kind: 'money', width: 2, computed: true },
      ],
    },
    { key: 'subtotal', label: 'Subtotal', kind: 'money', group: 'Totales', computed: true },
    { key: 'iva', label: 'IVA (21 %)', kind: 'money', group: 'Totales', computed: true },
    { key: 'total', label: 'Total', kind: 'money', group: 'Totales', computed: true },
    { key: 'notas', label: 'Notas', kind: 'multiline', group: 'Documento' },
  ],
};
