import type { DocumentTypeDefinition } from '../../core/document-type/types';
import { DEFAULT_PAPER_ID, DESCRIPTION, ID, NAME, NUMBERING } from './definition';
import { labels } from './labels.es';
import { schema } from './schema';
import { baseTemplate } from './templates/base';

// Única entrada del tipo: el motor la descubre solo.
const definition: DocumentTypeDefinition = {
  id: ID,
  name: NAME,
  description: DESCRIPTION,
  defaultPaperId: DEFAULT_PAPER_ID,
  numbering: NUMBERING,
  schema,
  labels,
  templates: [baseTemplate],
};

export default definition;
