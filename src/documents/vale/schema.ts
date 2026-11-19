import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'numero', label: 'Número', kind: 'number', group: 'Vale', required: true },
    { key: 'numeroVale', label: 'Número completo', kind: 'text', group: 'Vale', computed: true },
    { key: 'codigo', label: 'Código (va en el QR)', kind: 'text', group: 'Vale', required: true },
    { key: 'importe', label: 'Importe', kind: 'money', group: 'Vale', required: true },
    { key: 'concepto', label: 'Concepto', kind: 'text', group: 'Vale' },
    { key: 'fecha', label: 'Fecha de emisión', kind: 'date', group: 'Vale' },
    { key: 'validoHasta', label: 'Válido hasta', kind: 'date', group: 'Vale' },
    { key: 'beneficiario.nombre', label: 'Para', kind: 'text', group: 'Vale' },
    { key: 'emisor.logo', label: 'Logo', kind: 'image', group: 'Emisor' },
    {
      key: 'emisor.nombre',
      label: 'Nombre o razón social',
      kind: 'text',
      group: 'Emisor',
      required: true,
    },
    { key: 'emisor.nif', label: 'NIF', kind: 'text', group: 'Emisor' },
    { key: 'emisor.direccion', label: 'Domicilio', kind: 'multiline', group: 'Emisor' },
    { key: 'condiciones', label: 'Condiciones', kind: 'multiline', group: 'Condiciones' },
  ],
};
