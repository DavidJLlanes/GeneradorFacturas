import type { DocumentData } from '../../core/document-type/types';

// Datos de muestra para ver el diseño relleno. Todos ficticios.
export const sampleData: DocumentData = {
  numero: 64,
  fecha: '2026-11-19',
  tecnico: 'Luis Ejemplo',
  horaInicio: '09:15',
  horaFin: '11:45',
  'emisor.nombre': 'Instalaciones Ejemplo, S.L.',
  'emisor.nif': 'B00000000',
  'emisor.direccion': 'Calle Mayor 1\n24001 León',
  'emisor.email': 'taller@ejemplo.test',
  'emisor.telefono': '987 00 00 00',
  'cliente.nombre': 'Cliente de Muestra, S.A.',
  'cliente.nif': 'A00000000',
  'cliente.direccion': 'Avenida del Sol 25\n28001 Madrid',
  descripcion:
    'Sustitución del cuadro eléctrico de la planta baja y revisión de las líneas de alumbrado.\nSe deja la instalación en funcionamiento y comprobada.',
  lineas: [
    { concepto: 'Magnetotérmico 2P 25 A', cantidad: 4, unidad: 'ud.' },
    { concepto: 'Cable H07V-K 2,5 mm²', cantidad: 30, unidad: 'm' },
    { concepto: 'Caja de registro', cantidad: 2, unidad: 'ud.' },
  ],
  observaciones: 'Pendiente: revisar el alumbrado de emergencia en la próxima visita.',
};
