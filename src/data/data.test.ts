import { describe, expect, it } from 'vitest';
import type { DataSchema } from '../core/document-type/types';
import { formatFieldValue } from './format-field';
import { makeResolver } from './make-resolver';
import { centsToInput, formatCents, parseMoneyToCents, percentOfCents, sumCents } from './money';
import { findVariables, resolveVariables } from './variables';

describe('importes en céntimos', () => {
  it('lee importes escritos de varias formas', () => {
    const cases: [string, number | null][] = [
      ['1.234,56', 123456],
      ['1234,5', 123450],
      ['12', 1200],
      ['12 €', 1200],
      ['0,05', 5],
      ['1.234', 123400],
      ['1234.56', 123456],
      ['12.5', 1250],
      ['-3,5', -350],
      ['0,005', 1],
      ['0,004', 0],
      ['', null],
      ['abc', null],
      ['1,2,3', null],
    ];
    for (const [input, expected] of cases) expect(parseMoneyToCents(input), input).toBe(expected);
  });

  it('no acumula errores de coma flotante', () => {
    const cents = [0.1, 0.2].map((v) => parseMoneyToCents(String(v))!);
    expect(sumCents(cents)).toBe(30);
    expect(sumCents([])).toBe(0);
  });

  it('calcula porcentajes redondeando al céntimo', () => {
    expect(percentOfCents(10000, 21)).toBe(2100);
    expect(percentOfCents(1999, 21)).toBe(420);
    expect(percentOfCents(5, 50)).toBe(3);
  });

  it('formatea para mostrar y para editar', () => {
    expect(formatCents(123456).replace(/\s/g, ' ')).toBe('1234,56 €');
    expect(centsToInput(123456)).toBe('1234,56');
    expect(centsToInput(5)).toBe('0,05');
    expect(centsToInput(-350)).toBe('-3,50');
    expect(parseMoneyToCents(centsToInput(98765))).toBe(98765);
  });
});

describe('variables', () => {
  const lookup = (key: string): string | undefined =>
    ({ 'cliente.nombre': 'Ana', total: '10' })[key];

  it('sustituye variables con o sin espacios', () => {
    expect(resolveVariables('Hola {{cliente.nombre}} y {{ total }}', lookup)).toBe('Hola Ana y 10');
  });

  it('conserva o quita las que no tienen valor', () => {
    expect(resolveVariables('{{nada}}', lookup)).toBe('{{nada}}');
    expect(resolveVariables('a{{nada}}b', lookup, 'empty')).toBe('ab');
  });

  it('ignora lo que no es una variable', () => {
    expect(resolveVariables('{{ 1x }} {nombre} {{}}', lookup)).toBe('{{ 1x }} {nombre} {{}}');
  });

  it('lista las variables sin repetir', () => {
    expect(findVariables('{{a}} {{b.c}} {{a}}')).toEqual(['a', 'b.c']);
  });
});

describe('rellenar con datos', () => {
  const schema: DataSchema = {
    version: 1,
    fields: [
      { key: 'total', label: 'Total', kind: 'money', group: 'g' },
      { key: 'fecha', label: 'Fecha', kind: 'date', group: 'g' },
      { key: 'nombre', label: 'Nombre', kind: 'text', group: 'g' },
    ],
  };

  it('formatea según el tipo de campo', () => {
    expect(formatFieldValue('date', '2026-11-19')).toBe('19/11/2026');
    expect(formatFieldValue('date', 'ayer')).toBe('ayer');
    expect(formatFieldValue('money', 5)).toContain('0,05');
    expect(formatFieldValue('text', '')).toBe('');
    expect(formatFieldValue('image', 'data:...')).toBe('');
    expect(formatFieldValue('image', 'data:image/png;base64,AA')).toBe('data:image/png;base64,AA');
  });

  it('resuelve textos con datos y deja pendientes los vacíos', () => {
    const resolve = makeResolver(schema, { total: 12050, fecha: '2026-01-05', nombre: '' });
    const text = resolve('{{nombre}}|{{fecha}}|{{total}}|{{otro}}');
    expect(text).toContain('{{nombre}}|05/01/2026|120,50');
    expect(text.endsWith('|{{otro}}')).toBe(true);
  });

  it('las listas muestran la etiqueta y el sí/no solo si está activo', () => {
    const options = [{ value: '21', label: '21 %' }];
    expect(formatFieldValue('choice', '21', options)).toBe('21 %');
    expect(formatFieldValue('choice', '99', options)).toBe('99');
    expect(formatFieldValue('toggle', true)).toBe('Sí');
    expect(formatFieldValue('toggle', false)).toBe('');
    const schema: DataSchema = {
      version: 1,
      fields: [{ key: 'iva', label: 'IVA', kind: 'choice', group: 'g', options }],
    };
    expect(makeResolver(schema, { iva: '21' })('{{iva}}')).toBe('21 %');
  });
});
