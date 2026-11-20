import type { ChoiceOption, FieldKind } from '../core/document-type/types';
import { isImageDataUrl } from '../images/image-limits';
import { formatCents } from './money';

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const numberFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 6 });

// Texto con el que se muestra un dato en el documento, según el tipo de campo.
export function formatFieldValue(
  kind: FieldKind,
  value: unknown,
  options?: readonly ChoiceOption[],
  currency?: string,
): string {
  if (value === undefined || value === null || value === '') return '';
  switch (kind) {
    case 'money':
      return typeof value === 'number' ? formatCents(value, currency) : '';
    case 'number':
      return typeof value === 'number' ? numberFormat.format(value) : String(value);
    case 'date': {
      const match = DATE.exec(String(value));
      return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value);
    }
    case 'image':
      return isImageDataUrl(value) ? value : '';
    case 'lines':
      return '';
    case 'choice':
      return options?.find((o) => o.value === value)?.label ?? String(value);
    case 'toggle':
      return value === true ? 'Sí' : '';
    default:
      return String(value);
  }
}
