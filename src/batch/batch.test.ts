import { describe, expect, it } from 'vitest';
import type { DataSchema } from '../core/document-type/types';
import { buildDocuments } from './convert/build-documents';
import { convertValue, parseDate, parseNumber } from './convert/convert-value';
import { detectDelimiter, parseCsv, writeCsv } from './csv/parse-csv';
import { pdfFileName } from './run/file-names';
import { autoMap } from './targets/auto-map';
import { buildTargets, fieldTargetId, lineTargetId } from './targets/build-targets';
import { crc32, ZipWriter } from './zip/zip-writer';

const schema: DataSchema = {
  id: 't',
  version: 1,
  fields: [
    { key: 'numero', label: 'Número', kind: 'number', group: 'A', required: true },
    { key: 'fecha', label: 'Fecha', kind: 'date', group: 'A' },
    { key: 'cliente.nombre', label: 'Cliente', kind: 'text', group: 'B' },
    { key: 'total', label: 'Total', kind: 'money', group: 'B', computed: true },
    { key: 'logo', label: 'Logo', kind: 'image', group: 'B' },
    {
      key: 'lineas',
      label: 'Líneas',
      kind: 'lines',
      group: 'L',
      columns: [
        { key: 'concepto', label: 'Concepto', kind: 'text', width: 4 },
        { key: 'precio', label: 'Precio', kind: 'money', width: 1 },
        { key: 'importe', label: 'Importe', kind: 'money', width: 1, computed: true },
      ],
    },
  ],
} as unknown as DataSchema;

describe('CSV', () => {
  it('lee comillas, saltos de línea dentro de celdas y BOM', () => {
    const csv = parseCsv('﻿a;b\r\n"x;1";"línea 1\nlínea 2"\r\n"di ""hola""";z\r\n');
    expect(csv.headers).toEqual(['a', 'b']);
    expect(csv.rows).toEqual([
      ['x;1', 'línea 1\nlínea 2'],
      ['di "hola"', 'z'],
    ]);
  });

  it('detecta el delimitador y descarta filas vacías', () => {
    expect(detectDelimiter('a,b,c\n1,2,3')).toBe(',');
    expect(detectDelimiter('a;b;c')).toBe(';');
    expect(detectDelimiter('a\tb')).toBe('\t');
    expect(parseCsv('a,b\n\n1,2\n,\n').rows).toEqual([['1', '2']]);
  });

  it('escribir y leer devuelve lo mismo', () => {
    const rows = [
      ['uno; dos', 'tres "4"'],
      ['5', 'a\nb'],
    ];
    expect(parseCsv(writeCsv(['x', 'y'], rows)).rows).toEqual(rows);
  });
});

describe('conversión de valores', () => {
  it('fechas, números e importes en formato español', () => {
    expect(parseDate('20/11/2026')).toBe('2026-11-20');
    expect(parseDate('2026-1-5')).toBe('2026-01-05');
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseNumber('1.234,5')).toBe(1234.5);
    expect(parseNumber('abc')).toBeNull();
    const [money] = buildTargets(schema).filter((t) => t.kind === 'money');
    expect(convertValue(money!, '1.234,56 €')).toEqual({ value: 123456 });
    expect(convertValue(money!, 'x')).toHaveProperty('error');
    expect(convertValue(money!, '  ')).toBeNull();
  });
});

describe('destinos y asignación', () => {
  const targets = buildTargets(schema);

  it('salen del esquema sin los campos calculados ni las imágenes', () => {
    expect(targets.map((t) => t.id)).toEqual([
      fieldTargetId('numero'),
      fieldTargetId('fecha'),
      fieldTargetId('cliente.nombre'),
      lineTargetId('lineas', 'concepto'),
      lineTargetId('lineas', 'precio'),
    ]);
  });

  it('empareja cabeceras por etiqueta o clave, sin acentos', () => {
    const map = autoMap(['NUMERO', 'Cliente', 'precio', 'otra'], targets);
    expect(map[fieldTargetId('numero')]).toBe(0);
    expect(map[fieldTargetId('cliente.nombre')]).toBe(1);
    expect(map[lineTargetId('lineas', 'precio')]).toBe(2);
    expect(map[fieldTargetId('fecha')]).toBeUndefined();
  });
});

describe('documentos desde filas', () => {
  const targets = buildTargets(schema);
  const mapping = autoMap(['Número', 'Fecha', 'Cliente', 'Concepto', 'Precio'], targets);

  it('una fila por documento, con su línea', () => {
    const [doc] = buildDocuments([['7', '20/11/2026', 'Ana', 'Web', '10,5']], {
      targets,
      mapping,
      groupColumn: null,
    });
    expect(doc?.errors).toEqual([]);
    expect(doc?.data).toMatchObject({
      numero: 7,
      fecha: '2026-11-20',
      'cliente.nombre': 'Ana',
      lineas: [{ concepto: 'Web', precio: 1050 }],
    });
  });

  it('agrupa filas consecutivas con la misma clave y reúne sus líneas', () => {
    const docs = buildDocuments(
      [
        ['1', '', 'Ana', 'Web', '10'],
        ['1', '', '', 'Logo', '20'],
        ['2', '', 'Luis', 'App', '30'],
      ],
      { targets, mapping, groupColumn: 0 },
    );
    expect(docs).toHaveLength(2);
    expect(docs[0]?.rows).toEqual([2, 3]);
    expect(docs[0]?.data['lineas']).toHaveLength(2);
  });

  it('anota los errores con su fila: obligatorios, importes y fechas', () => {
    const [doc] = buildDocuments([['', '32/13/2026', 'Ana', 'Web', 'caro']], {
      targets,
      mapping,
      groupColumn: null,
    });
    expect(doc?.errors).toHaveLength(3);
    expect(doc?.errors.join(' ')).toContain('fila 2');
  });
});

describe('datos comunes', () => {
  const targets = buildTargets(schema);
  const mapping = autoMap(['Fecha', 'Cliente'], targets);

  it('los datos base completan lo que el CSV no trae y cuentan como obligatorios cubiertos', () => {
    const [doc] = buildDocuments([['20/11/2026', 'Ana']], {
      targets,
      mapping,
      groupColumn: null,
      base: { numero: 5, emisor: 'yo' },
    });
    expect(doc?.errors).toEqual([]);
    expect(doc?.data).toMatchObject({ numero: 5, emisor: 'yo', 'cliente.nombre': 'Ana' });
  });
});

describe('ZIP', () => {
  it('crc32 de un valor conocido', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
  });

  it('escribe un ZIP legible con sus entradas', async () => {
    const zip = new ZipWriter();
    await zip.add({ name: 'a.txt', data: new TextEncoder().encode('hola '.repeat(50)) });
    await zip.add({ name: 'ñ/b.txt', data: new TextEncoder().encode('x') });
    const bytes = new Uint8Array(await zip.finish().arrayBuffer());
    const view = new DataView(bytes.buffer);
    expect(view.getUint32(0, true)).toBe(0x04034b50);
    const end = bytes.length - 22;
    expect(view.getUint32(end, true)).toBe(0x06054b50);
    expect(view.getUint16(end + 10, true)).toBe(2);
  });
});

describe('nombres de PDF', () => {
  it('posición con ceros y dato limpio', () => {
    expect(pdfFileName(0, 12, 'A/0007')).toBe('001-a-0007.pdf');
    expect(pdfFileName(4, 1200, 'Ñandú S.L.')).toBe('0005-nandu-s-l.pdf');
    expect(pdfFileName(1, 3, '')).toBe('002.pdf');
  });
});
