import type { ChoiceOption, ColumnSpec, FieldSpec } from '../core/document-type/types';
import {
  CITIES,
  COMPANY_CORES,
  COMPANY_KINDS,
  COMPANY_SUFFIXES,
  CONCEPTS,
  FIRST_NAMES,
  PARAGRAPHS,
  PRODUCTS,
  STREETS,
  SUBJECTS,
  SURNAMES,
  TITLES,
  UNITS,
} from './fake-pools';
import type { Rng } from './rng';

const LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const slug = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
const pad = (n: number): string => String(n).padStart(2, '0');

export const fakePerson = (rng: Rng): string =>
  `${rng.pick(FIRST_NAMES)} ${rng.pick(SURNAMES)} ${rng.pick(SURNAMES)}`;
export const fakeCompany = (rng: Rng): string =>
  `${rng.pick(COMPANY_KINDS)} ${rng.pick(COMPANY_CORES)}, ${rng.pick(COMPANY_SUFFIXES)}`;

// NIF con letra de control correcta (persona) o CIF con forma válida (empresa); ambos ficticios.
export function fakeNif(rng: Rng, company: boolean): string {
  if (company) return `B${String(rng.int(0, 9_999_999)).padStart(7, '0')}0`;
  const n = rng.int(10_000_000, 99_999_999);
  return `${n}${LETTERS[n % 23]}`;
}

export function fakeAddress(rng: Rng, multiline: boolean): string {
  const [cp, city] = rng.pick(CITIES);
  const street = `${rng.pick(STREETS)} ${rng.int(1, 80)}`;
  return multiline ? `${street}\n${cp} ${city}` : `${street}, ${cp} ${city}`;
}

// Fecha reciente (AAAA-MM-DD): hasta 60 días atrás desde `today`.
export function fakeDate(rng: Rng, today: Date): string {
  const d = new Date(today.getTime() - rng.int(0, 60) * 86_400_000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const pickOption = (rng: Rng, options: readonly ChoiceOption[] | undefined): string =>
  options && options.length > 0 ? rng.pick(options).value : '';

// Contexto de una generación: quién es «la empresa» y «la persona» de cada grupo, para que el
// nombre, el email y el NIF de un mismo bloque concuerden.
export interface FakeContext {
  rng: Rng;
  today: Date;
  names: Map<string, string>;
}

const COMPANY_GROUPS = new Set(['emisor', 'proveedor', 'destinatario']);

function fakeName(ctx: FakeContext, group: string): string {
  const known = ctx.names.get(group);
  if (known) return known;
  const company = COMPANY_GROUPS.has(group) || ctx.rng.chance(0.5);
  const name = company ? fakeCompany(ctx.rng) : fakePerson(ctx.rng);
  ctx.names.set(group, name);
  return name;
}

function fakeText(key: string, multiline: boolean, ctx: FakeContext): string {
  const { rng } = ctx;
  const [group = '', ...rest] = key.split('.');
  const leaf = rest.length > 0 ? rest.join('.') : group;
  const owner = rest.length > 0 ? group : '';
  const name = owner ? fakeName(ctx, owner) : '';
  switch (leaf) {
    case 'nombre':
      return name || fakePerson(rng);
    case 'nif':
      return fakeNif(rng, name.includes(','));
    case 'direccion':
      return fakeAddress(rng, multiline);
    case 'email':
      return `contacto@${slug(name || 'ejemplo')}.test`;
    case 'telefono':
      return `6${rng.int(0, 99)} ${pad(rng.int(0, 99))} ${pad(rng.int(0, 99))} ${pad(rng.int(0, 99))}`;
    case 'serie':
      return '';
    case 'hora':
      return `${pad(rng.int(8, 20))}:${pad(rng.pick([0, 15, 30, 45]))}`;
    case 'referencia':
      return `REF-${rng.int(1000, 9999)}`;
    case 'codigo':
      return `COD-${rng.int(1000, 9999)}-${rng.int(100, 999)}`;
    case 'asunto':
      return rng.pick(SUBJECTS);
    case 'producto':
      return rng.pick(PRODUCTS);
    case 'cargo':
      return rng.pick(TITLES);
    case 'empresa':
      return fakeCompany(rng);
    case 'web':
      return `www.${slug(rng.pick(COMPANY_CORES))}.test`;
    case 'tecnico':
    case 'beneficiario':
      return fakePerson(rng);
    case 'lugar':
      return rng.pick(CITIES)[1];
    case 'transportista':
      return `Transportes ${rng.pick(COMPANY_CORES)}`;
    case 'plazo':
      return `${rng.int(2, 8)} semanas`;
    case 'concepto':
      return multiline ? rng.pick(CONCEPTS) : rng.pick(CONCEPTS);
    default:
      return multiline ? rng.pick(PARAGRAPHS) : rng.pick(CONCEPTS);
  }
}

function fakeCell(column: ColumnSpec, ctx: FakeContext): unknown {
  const { rng } = ctx;
  switch (column.kind) {
    case 'money':
      return rng.int(8, 900) * 50;
    case 'number':
      return column.key === 'descuento'
        ? rng.chance(0.3)
          ? rng.pick([5, 10, 15])
          : 0
        : rng.int(1, 8);
    case 'choice':
      return column.key === 'iva'
        ? rng.pick(['21', '21', '21', '10'])
        : pickOption(rng, column.options);
    default:
      return column.key === 'unidad' ? rng.pick(UNITS) : rng.pick(CONCEPTS);
  }
}

// Valor ficticio para un campo según su tipo y su nombre. `undefined` si no se rellena (imágenes y
// campos calculados).
export function fakeValue(field: FieldSpec, ctx: FakeContext): unknown {
  const { rng } = ctx;
  if (field.computed || field.kind === 'image') return undefined;
  switch (field.kind) {
    case 'date':
      return fakeDate(rng, ctx.today);
    case 'money':
      return rng.int(20, 4000) * 50;
    case 'number':
      if (field.key === 'numero') return rng.int(1, 250);
      if (/dias$/i.test(field.key)) return rng.pick([15, 30, 60]);
      return rng.int(1, 10);
    case 'choice':
      return pickOption(rng, field.options);
    case 'lines': {
      const columns = field.columns ?? [];
      return Array.from({ length: rng.int(3, 6) }, () =>
        Object.fromEntries(
          columns.filter((c) => !c.computed).map((c) => [c.key, fakeCell(c, ctx)]),
        ),
      );
    }
    default:
      return fakeText(field.key, field.kind === 'multiline', ctx);
  }
}
