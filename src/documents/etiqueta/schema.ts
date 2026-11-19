import type { DataSchema } from '../../core/document-type/types';

export const schema: DataSchema = {
  version: 1,
  fields: [
    { key: 'producto', label: 'Producto', kind: 'text', group: 'Producto', required: true },
    { key: 'descripcion', label: 'Descripción', kind: 'multiline', group: 'Producto' },
    { key: 'referencia', label: 'Referencia', kind: 'text', group: 'Producto' },
    { key: 'lote', label: 'Lote', kind: 'text', group: 'Producto' },
    { key: 'precio', label: 'Precio', kind: 'money', group: 'Producto' },
    { key: 'codigo', label: 'Contenido del QR', kind: 'text', group: 'Producto' },
    { key: 'emisor.nombre', label: 'Marca o empresa', kind: 'text', group: 'Empresa' },
  ],
};
