import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 5,
  fecha: '2026-11-19',
  'emisor.nombre': 'Estudio Ejemplo, S.L.P.',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1\n24001 León',
  'emisor.email': 'hola@ejemplo.test',
  'emisor.telefono': '987 00 00 00',
  'cliente.nombre': 'Cliente de Muestra, S.A.',
  'cliente.nif': 'A00000000',
  'cliente.direccion': 'Avenida del Sol 25\n28001 Madrid',
  'cliente.email': 'compras@cliente.test',
  objeto: 'Diseño y desarrollo del sitio web corporativo del cliente.',
  alcance:
    '• Diseño de 5 páginas adaptadas a móvil.\n• Formulario de contacto y optimización básica de posicionamiento.\n• Una ronda de cambios incluida; las siguientes se presupuestan aparte.',
  plazo: '6 semanas desde la firma y el pago de la provisión',
  honorarios: 240000,
  provision: 80000,
  condiciones: 'Los honorarios no incluyen IVA. El resto se abona a la entrega.',
};
