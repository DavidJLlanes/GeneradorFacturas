import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 42,
  fecha: '2026-11-19',
  hora: '13:42',
  'emisor.nombre': 'Café Ejemplo',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1, León',
  'emisor.telefono': '987 00 00 00',
  lineas: [
    { concepto: 'Café con leche', cantidad: 2, precio: 180 },
    { concepto: 'Tostada con tomate', cantidad: 1, precio: 320 },
    { concepto: 'Zumo de naranja', cantidad: 1, precio: 280 },
  ],
  iva: '10',
  formaPago: 'tarjeta',
  mensaje: '¡Gracias por su visita!',
};
