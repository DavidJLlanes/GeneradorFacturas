import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  serie: 'A',
  numero: 7,
  fecha: '2026-11-19',
  fechaOperacion: '2026-11-15',
  fechaVencimiento: '2026-12-19',
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
    { concepto: 'Diseño de identidad visual', cantidad: 1, precio: 85000, iva: '21' },
    {
      concepto: 'Mantenimiento web (mensual)',
      cantidad: 3,
      precio: 4500,
      descuento: 10,
      iva: '21',
    },
    { concepto: 'Libro de estilo impreso', cantidad: 2, precio: 1800, iva: '4' },
  ],
  irpf: 15,
  formaPago: 'transferencia',
  iban: 'ES00 0000 0000 0000 0000 0000',
  notas: 'Gracias por confiar en nosotros.',
};
