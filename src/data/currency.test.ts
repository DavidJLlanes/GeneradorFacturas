// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { setCurrency } from '../canvas/commands/style-commands';
import { createEditor } from '../canvas/editor/create-editor';
import { createPage } from '../core/document/page';
import { readDocument } from '../storage/design-file/validate-document';
import { currencyOf, DEFAULT_CURRENCY, isCurrency } from './currency';
import { formatFieldValue } from './format-field';
import { makeResolver } from './make-resolver';

const schema = {
  id: 't',
  version: 1,
  fields: [{ key: 'total', label: 'Total', kind: 'money', group: 'x' }],
} as never;

describe('moneda', () => {
  it('sin elegir es el euro y solo valen los códigos de la lista', () => {
    expect(currencyOf({})).toBe(DEFAULT_CURRENCY);
    expect(currencyOf({ currency: 'XXX' })).toBe('EUR');
    expect(isCurrency('USD')).toBe(true);
    expect(isCurrency('JPY')).toBe(false);
  });

  it('los importes salen con la moneda elegida', () => {
    expect(formatFieldValue('money', 123456)).toContain('€');
    expect(formatFieldValue('money', 123456, undefined, 'GBP')).toMatch(/£|GBP/);
    const resolve = makeResolver(schema, { total: 1000 }, 'keep', 'USD');
    expect(resolve('{{total}}')).toMatch(/US\$|\$/);
  });

  it('se cambia con un comando que se deshace y se guarda en el archivo', () => {
    const editor = createEditor({ page: createPage(210, 297), elements: [] });
    setCurrency(editor, 'MXN');
    expect(currencyOf(editor.doc())).toBe('MXN');
    editor.history.undo();
    expect(currencyOf(editor.doc())).toBe('EUR');
    const read = readDocument(JSON.parse(JSON.stringify({ ...editor.doc(), currency: 'MXN' })));
    expect(read.currency).toBe('MXN');
    expect(
      readDocument(JSON.parse(JSON.stringify({ ...editor.doc(), currency: 'ZZZ' }))).currency,
    ).toBeUndefined();
  });
});
