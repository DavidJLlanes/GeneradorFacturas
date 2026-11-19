import type { DataSchema } from '../../core/document-type/types';

const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'bizum', label: 'Bizum' },
  { value: 'otro', label: 'Otro' },
];

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'numero', label: 'Número', kind: 'number', group: 'Recibo', required: true },
    {
      key: 'numeroRecibo',
      label: 'Número completo',
      kind: 'text',
      group: 'Recibo',
      computed: true,
    },
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'Recibo', required: true },
    { key: 'lugar', label: 'Lugar', kind: 'text', group: 'Recibo' },

    { key: 'importe', label: 'Importe', kind: 'money', group: 'Pago', required: true },
    {
      key: 'importeLetras',
      label: 'Importe en letra',
      kind: 'text',
      group: 'Pago',
      computed: true,
    },
    { key: 'concepto', label: 'Concepto', kind: 'multiline', group: 'Pago', required: true },
    {
      key: 'formaPago',
      label: 'Forma de pago',
      kind: 'choice',
      group: 'Pago',
      options: PAYMENT_METHODS,
    },
    { key: 'notas', label: 'Notas', kind: 'multiline', group: 'Pago' },

    { key: 'emisor.logo', label: 'Logo', kind: 'image', group: 'Quien recibe' },
    {
      key: 'emisor.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Quien recibe',
      required: true,
    },
    { key: 'emisor.nif', label: 'NIF', kind: 'text', group: 'Quien recibe' },
    { key: 'emisor.direccion', label: 'Domicilio', kind: 'multiline', group: 'Quien recibe' },

    {
      key: 'cliente.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Quien paga',
      required: true,
    },
    { key: 'cliente.nif', label: 'NIF', kind: 'text', group: 'Quien paga' },
  ],
};
