import type { DocumentData } from '../../core/document-type/types';
import { NUMBERING } from './definition';

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

// Número del encargo: "HE-0007". Vacío si falta el número.
export function engagementNumber(data: DocumentData): string {
  const n = Math.trunc(asNumber(data['numero']));
  return n > 0 ? `${NUMBERING.prefix}${String(n).padStart(NUMBERING.padding, '0')}` : '';
}

// Lo que falta por pagar: honorarios menos provisión de fondos (en céntimos, nunca negativo).
// Sin honorarios no hay importe pendiente.
export function compute(data: DocumentData): DocumentData {
  const fees = asNumber(data['honorarios']);
  const out: Record<string, unknown> = { numeroEncargo: engagementNumber(data) };
  if (fees > 0) out['pendiente'] = Math.max(0, fees - Math.max(0, asNumber(data['provision'])));
  return out;
}
