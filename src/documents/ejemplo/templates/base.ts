import { createPage } from '../../../core/document/page';
import type { DocumentTemplate } from '../../../core/document-type/types';

export const baseTemplate: DocumentTemplate = {
  id: 'base',
  name: 'Base',
  document: {
    page: createPage(210, 297),
    elements: [
      {
        id: 'titulo',
        name: 'Título',
        x: 15,
        y: 15,
        w: 180,
        h: 20,
        locked: false,
        hidden: false,
        kind: 'text',
        props: { text: 'Documento de ejemplo' },
      },
      {
        id: 'cuerpo',
        name: 'Cuerpo',
        x: 15,
        y: 45,
        w: 180,
        h: 200,
        locked: false,
        hidden: false,
        kind: 'shape',
        props: {},
      },
    ],
  },
};
