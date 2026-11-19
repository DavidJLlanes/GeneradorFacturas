import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'logo', label: 'Logo', kind: 'image', group: 'Tarjeta' },
    { key: 'nombre', label: 'Nombre', kind: 'text', group: 'Tarjeta', required: true },
    { key: 'cargo', label: 'Cargo', kind: 'text', group: 'Tarjeta' },
    { key: 'empresa', label: 'Empresa', kind: 'text', group: 'Tarjeta' },
    { key: 'telefono', label: 'Teléfono', kind: 'text', group: 'Contacto' },
    { key: 'email', label: 'Email', kind: 'text', group: 'Contacto' },
    { key: 'web', label: 'Web', kind: 'text', group: 'Contacto' },
    { key: 'direccion', label: 'Dirección', kind: 'multiline', group: 'Contacto' },
  ],
};
