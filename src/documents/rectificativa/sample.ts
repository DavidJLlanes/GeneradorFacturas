import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  serie: 'R',
  numero: 2,
  fecha: '2026-11-19',
  facturaRectificada: 'A/0007',
  fechaRectificada: '2026-11-19',
  motivo: 'Devolución parcial de mercancía por producto defectuoso.',
  'emisor.nombre': 'Taller Ejemplo, S.L.',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1\n24001 León',
  'emisor.email': 'hola@ejemplo.test',
  'emisor.telefono': '987 00 00 00',
  'cliente.nombre': 'Cliente de Muestra, S.A.',
  'cliente.nif': 'A00000000',
  'cliente.direccion': 'Avenida del Sol 25\n28001 Madrid',
  'cliente.email': 'compras@cliente.test',
  lineas: [
    {
      concepto: 'Abono: lámpara de mesa modelo A (defectuosa)',
      cantidad: -2,
      precio: 4500,
      iva: '21',
    },
    { concepto: 'Abono: portes', cantidad: -1, precio: 1200, iva: '21' },
  ],
  notas: 'El importe se descontará de la próxima factura.',
};
