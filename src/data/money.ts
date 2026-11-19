// Los importes se guardan siempre en céntimos (enteros) para evitar errores de redondeo.

// Lee un importe escrito a mano ("1.234,56", "1234.5", "12 €", "-3,5") y lo devuelve en céntimos.
// Devuelve null si no es un número. El punto es separador de miles solo si lo siguen exactamente
// tres cifras y no hay coma ("1.234" = 1234); en cualquier otro caso es decimal.
export function parseMoneyToCents(input: string): number | null {
  let text = input.replace(/[\s€$]/g, '');
  if (text === '') return null;
  const negative = text.startsWith('-');
  if (negative || text.startsWith('+')) text = text.slice(1);

  if (text.includes(',')) text = text.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(text)) text = text.replace(/\./g, '');
  if (!/^\d*\.?\d*$/.test(text) || text === '.' || text === '') return null;

  const [whole = '0', fraction = ''] = text.split('.');
  const padded = (fraction + '00').slice(0, 3);
  let cents = Number(whole || '0') * 100 + Number(padded.slice(0, 2));
  if (Number(padded[2]) >= 5) cents += 1;
  return negative ? -cents : cents;
}

export const sumCents = (values: readonly number[]): number => values.reduce((a, b) => a + b, 0);

// Porcentaje de un importe en céntimos (p. ej. 21 % de IVA), redondeado al céntimo.
export const percentOfCents = (cents: number, percent: number): number =>
  Math.round((cents * percent) / 100);

export function formatCents(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(cents / 100);
}

// Importe para un campo de edición: "1234,56" (sin símbolo ni separador de miles).
export function centsToInput(cents: number): string {
  const abs = Math.abs(cents);
  const text = `${Math.trunc(abs / 100)},${String(abs % 100).padStart(2, '0')}`;
  return cents < 0 ? `-${text}` : text;
}
