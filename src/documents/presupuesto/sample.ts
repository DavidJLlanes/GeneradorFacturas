import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  serie: '',
  numero: 12,
  fecha: '2026-11-19',
  validezDias: 30,
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
    { concepto: 'Diseño de sitio web (5 páginas)', cantidad: 1, precio: 120000, iva: '21' },
    { concepto: 'Redacción de textos', cantidad: 5, precio: 3500, descuento: 10, iva: '21' },
    { concepto: 'Libro de estilo impreso', cantidad: 2, precio: 1800, iva: '4' },
  ],
  condiciones:
    'Forma de pago: 50 % al aceptar y 50 % al entregar.\nPlazo de entrega: 4 semanas desde la aceptación.',
  notas: 'Los precios no incluyen alojamiento ni dominio.',
};
