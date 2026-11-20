import { parseMoneyToCents } from '../../data/money';
import type { Target } from '../targets/build-targets';

export type Converted = { value: string | number | boolean } | { error: string } | null;

const pad = (n: string): string => n.padStart(2, '0');

// Fecha escrita como 2026-11-20, 20/11/2026, 20-11-2026 o 20.11.2026 → formato interno AAAA-MM-DD.
export function parseDate(text: string): string | null {
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(text);
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text);
  const [y, m, d] = iso ? [iso[1], iso[2], iso[3]] : dmy ? [dmy[3], dmy[2], dmy[1]] : [];
  if (!y || !m || !d) return null;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  const valid =
    date.getUTCFullYear() === Number(y) &&
    date.getUTCMonth() === Number(m) - 1 &&
    date.getUTCDate() === Number(d);
  return valid ? `${y}-${pad(m)}-${pad(d)}` : null;
}

export function parseNumber(text: string): number | null {
  const cleaned = text.replace(/\s/g, '').replace('%', '');
  const normal = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned;
  return /^-?\d*\.?\d+$/.test(normal) ? Number(normal) : null;
}

const YES = ['si', 'sí', 's', 'true', 'verdadero', '1', 'x', 'yes', 'y'];

// Texto de una celda a un valor del tipo que pide el destino. Una celda vacía es `null` (no se pone).
export function convertValue(target: Target, raw: string): Converted {
  const text = raw.trim();
  if (text === '') return null;
  switch (target.kind) {
    case 'money': {
      const cents = parseMoneyToCents(text);
      return cents === null ? { error: `«${text}» no es un importe` } : { value: cents };
    }
    case 'number': {
      const n = parseNumber(text);
      return n === null ? { error: `«${text}» no es un número` } : { value: n };
    }
    case 'date': {
      const date = parseDate(text);
      return date === null
        ? { error: `«${text}» no es una fecha (usa DD/MM/AAAA)` }
        : { value: date };
    }
    case 'choice': {
      const lower = text.toLowerCase();
      const option = target.options?.find(
        (o) => o.value.toLowerCase() === lower || o.label.toLowerCase() === lower,
      );
      return option ? { value: option.value } : { error: `«${text}» no es una opción válida` };
    }
    case 'toggle':
      return { value: YES.includes(text.toLowerCase()) };
    default:
      return { value: raw.replace(/\r\n?/g, '\n').trim() };
  }
}
