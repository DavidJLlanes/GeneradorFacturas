import type { ChoiceOption } from '../../core/document-type/types';

// Tipos de IVA que se pueden elegir en cada línea. 'E' es exenta (no devenga IVA y exige mención).
export const EXEMPT = 'E';

export const VAT_OPTIONS: readonly ChoiceOption[] = [
  { value: '21', label: '21 %' },
  { value: '10', label: '10 %' },
  { value: '4', label: '4 %' },
  { value: '0', label: '0 %' },
  { value: EXEMPT, label: 'Exenta' },
];

// Tipos con IVA; el orden es el de los totales.
export const VAT_RATES = [21, 10, 4, 0] as const;
export type VatRate = (typeof VAT_RATES)[number];

// Recargo de equivalencia por tipo de IVA (porcentaje sobre la base).
export const SURCHARGE_PERCENT: Readonly<Record<VatRate, number>> = {
  21: 5.2,
  10: 1.4,
  4: 0.5,
  0: 0,
};

export const DEFAULT_EXEMPT_NOTE = 'Operación exenta de IVA.';
