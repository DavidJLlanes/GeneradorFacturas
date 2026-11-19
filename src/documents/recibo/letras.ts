// Importe en letra, en español: 123456 céntimos → "mil doscientos treinta y cuatro euros con
// cincuenta y seis céntimos". Admite hasta 999.999.999,99; fuera de ese rango (o sin importe) devuelve "".
const UNITS = [
  'cero',
  'uno',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
  'trece',
  'catorce',
  'quince',
  'dieciséis',
  'diecisiete',
  'dieciocho',
  'diecinueve',
  'veinte',
  'veintiuno',
  'veintidós',
  'veintitrés',
  'veinticuatro',
  'veinticinco',
  'veintiséis',
  'veintisiete',
  'veintiocho',
  'veintinueve',
];
const TENS = [
  '',
  '',
  '',
  'treinta',
  'cuarenta',
  'cincuenta',
  'sesenta',
  'setenta',
  'ochenta',
  'noventa',
];
const HUNDREDS = [
  '',
  'ciento',
  'doscientos',
  'trescientos',
  'cuatrocientos',
  'quinientos',
  'seiscientos',
  'setecientos',
  'ochocientos',
  'novecientos',
];

const below100 = (n: number): string => {
  if (n < 30) return UNITS[n] ?? '';
  const unit = n % 10;
  return `${TENS[Math.floor(n / 10)]}${unit ? ` y ${UNITS[unit]}` : ''}`;
};

const below1000 = (n: number): string => {
  if (n === 100) return 'cien';
  const rest = n % 100;
  return [HUNDREDS[Math.floor(n / 100)], rest ? below100(rest) : ''].filter(Boolean).join(' ');
};

// "uno" delante de un sustantivo o de "mil" se apocopa: un euro, veintiún mil, treinta y un euros.
const apocope = (words: string): string =>
  words.endsWith('veintiuno') ? `${words.slice(0, -9)}veintiún` : words.replace(/uno$/, 'un');

function wholeInWords(n: number): string {
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (millions)
    parts.push(millions === 1 ? 'un millón' : `${apocope(below1000(millions))} millones`);
  if (thousands) parts.push(thousands === 1 ? 'mil' : `${apocope(below1000(thousands))} mil`);
  if (rest) parts.push(below1000(rest));
  return parts.join(' ');
}

export function centsInWords(cents: number): string {
  if (!Number.isFinite(cents) || cents <= 0 || cents >= 100_000_000_000) return '';
  const euros = Math.floor(cents / 100);
  const rest = cents % 100;
  let out: string;
  if (euros === 0) out = '';
  else if (euros % 1_000_000 === 0) out = `${apocope(wholeInWords(euros))} de euros`;
  else out = `${apocope(wholeInWords(euros))} ${euros === 1 ? 'euro' : 'euros'}`;
  if (rest) {
    const small = `${apocope(below100(rest))} ${rest === 1 ? 'céntimo' : 'céntimos'}`;
    out = out ? `${out} con ${small}` : small;
  }
  return out;
}
