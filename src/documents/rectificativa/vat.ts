import type { ChoiceOption } from '../../core/document-type/types';

// Tipos de IVA que se pueden elegir en cada línea.
export const VAT_OPTIONS: readonly ChoiceOption[] = [
  { value: '21', label: '21 %' },
  { value: '10', label: '10 %' },
  { value: '4', label: '4 %' },
  { value: '0', label: '0 %' },
];

export const VAT_RATES = [21, 10, 4, 0] as const;
