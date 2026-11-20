import type { DocumentModel } from '../core/document/types';

// Monedas que se ofrecen. Todas con dos decimales, que es como guardamos los importes (céntimos).
export const DEFAULT_CURRENCY = 'EUR';

export const CURRENCIES: readonly { code: string; label: string }[] = [
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'USD', label: 'Dólar estadounidense ($)' },
  { code: 'GBP', label: 'Libra esterlina (£)' },
  { code: 'CHF', label: 'Franco suizo (CHF)' },
  { code: 'CAD', label: 'Dólar canadiense (CAD)' },
  { code: 'AUD', label: 'Dólar australiano (AUD)' },
  { code: 'MXN', label: 'Peso mexicano (MXN)' },
  { code: 'ARS', label: 'Peso argentino (ARS)' },
  { code: 'COP', label: 'Peso colombiano (COP)' },
  { code: 'PEN', label: 'Sol peruano (PEN)' },
  { code: 'BRL', label: 'Real brasileño (BRL)' },
];

export const isCurrency = (code: unknown): code is string =>
  typeof code === 'string' && CURRENCIES.some((c) => c.code === code);

// Moneda de un documento; sin elegir, el euro.
export const currencyOf = (doc: Pick<DocumentModel, 'currency'>): string =>
  isCurrency(doc.currency) ? doc.currency : DEFAULT_CURRENCY;
