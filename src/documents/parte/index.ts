import type { DocumentTypeDefinition } from '../../core/document-type/types';
import { compute } from './calc';
import { DEFAULT_PAPER_ID, DESCRIPTION, ID, NAME, NUMBERING } from './definition';
import { labels } from './labels.es';
import { sampleData } from './sample';
import { schema } from './schema';
import { clasica } from './templates/clasica';

// Única entrada del tipo: el motor la descubre solo.
const definition: DocumentTypeDefinition = {
  id: ID,
  name: NAME,
  description: DESCRIPTION,
  defaultPaperId: DEFAULT_PAPER_ID,
  numbering: NUMBERING,
  schema,
  labels,
  templates: [clasica],
  sampleData,
  compute,
};

export default definition;
