import type { DocumentData, LineRow } from '../../core/document-type/types';
import { percentOfCents, sumCents } from '../../data/money';
import { NUMBERING } from './definition';
import { DEFAULT_EXEMPT_NOTE, EXEMPT, SURCHARGE_PERCENT, VAT_RATES, type VatRate } from './vat';

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const clampPercent = (value: unknown): number => Math.min(100, Math.max(0, asNumber(value)));

// Importe neto de una línea en céntimos: cantidad × precio, menos el descuento.
export function lineNet(row: LineRow): number {
  const gross = asNumber(row['cantidad']) * asNumber(row['precio']);
  return Math.round(gross * (1 - clampPercent(row['descuento']) / 100));
}

// Número de factura con serie: "A/0007". Vacío si falta el número.
export function invoiceNumber(data: DocumentData): string {
  const n = Math.trunc(asNumber(data['numero']));
  if (!(n > 0)) return '';
  const padded = String(n).padStart(NUMBERING.padding, '0');
  const series = String(data['serie'] ?? '').trim();
  return `${NUMBERING.prefix}${series ? `${series}/` : ''}${padded}`;
}

type Out = Record<string, unknown>;

// Cálculos de la factura. Todo en céntimos. El IVA y el recargo se calculan por tipo sobre la suma de
// bases de ese tipo; el IRPF sobre la base imponible total. Los tipos sin líneas no generan valores,
// para que el bloque de totales pueda omitir sus filas.
export function compute(data: DocumentData): DocumentData {
  const rows = Array.isArray(data['lineas']) ? (data['lineas'] as LineRow[]) : [];
  const lineas = rows.map((row): LineRow & { importe: number } => ({
    ...row,
    importe: lineNet(row),
  }));
  const out: Out = { lineas, numeroFactura: invoiceNumber(data) };

  const bases = new Map<VatRate, number[]>();
  const exempt: number[] = [];
  for (const line of lineas) {
    const code = String(line['iva'] ?? '21');
    if (code === EXEMPT) exempt.push(line.importe);
    else {
      const rate = (VAT_RATES.find((r) => String(r) === code) ?? 21) as VatRate;
      bases.set(rate, [...(bases.get(rate) ?? []), line.importe]);
    }
  }

  const surcharge = data['recargo'] === true;
  let ivaTotal = 0;
  let recargoTotal = 0;
  for (const rate of VAT_RATES) {
    const group = bases.get(rate);
    if (!group) continue;
    const base = sumCents(group);
    const iva = percentOfCents(base, rate);
    out[`base${rate}`] = base;
    out[`iva${rate}`] = iva;
    ivaTotal += iva;
    if (surcharge && SURCHARGE_PERCENT[rate] > 0) {
      const rec = percentOfCents(base, SURCHARGE_PERCENT[rate]);
      out[`rec${rate}`] = rec;
      recargoTotal += rec;
    }
  }

  const baseTotal = sumCents(lineas.map((l) => l.importe));
  const irpfPercent = clampPercent(data['irpf']);
  const irpfCuota = irpfPercent > 0 ? percentOfCents(baseTotal, irpfPercent) : 0;

  if (exempt.length > 0) out['baseExenta'] = sumCents(exempt);
  out['baseTotal'] = baseTotal;
  out['ivaTotal'] = ivaTotal;
  if (surcharge && recargoTotal > 0) out['recargoTotal'] = recargoTotal;
  if (irpfCuota > 0) out['irpfCuota'] = irpfCuota;
  out['total'] = baseTotal + ivaTotal + recargoTotal - irpfCuota;

  if (exempt.length > 0) {
    const note = String(data['motivoExencion'] ?? '').trim();
    out['menciones'] = note || DEFAULT_EXEMPT_NOTE;
  }
  return out;
}
