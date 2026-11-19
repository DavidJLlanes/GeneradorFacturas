// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../../canvas/editor/create-editor';
import { createPage } from '../../core/document/page';
import { documentTypes } from '../../core/document-type/discover';
import { createMemoryStore } from '../../storage/local/memory-store';
import { setSession } from '../../storage/session/session-context';
import { openGalleryDialog } from './gallery-dialog';
import { openRandomDialog } from './random-dialog';

HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.removeAttribute('open');
};

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const dlg = (cls: string): HTMLDialogElement =>
  document.querySelector<HTMLDialogElement>(`dialog.${cls}`)!;
const publicTypes = documentTypes.list().filter((t) => !t.internal);

const newEditor = () => createEditor({ page: createPage(10, 10), elements: [] });

beforeEach(() => {
  document.body.replaceChildren();
  setSession({ typeId: 'presupuesto', store: createMemoryStore() });
});

describe('galería', () => {
  it('ofrece un filtro por cada tipo y empieza en el tipo abierto', () => {
    openGalleryDialog(newEditor());
    const chips = [...dlg('gl').querySelectorAll<HTMLElement>('.gl-chip')];
    expect(chips).toHaveLength(publicTypes.length + 1);
    expect(chips.find((c) => c.getAttribute('aria-pressed') === 'true')?.dataset['type']).toBe(
      'presupuesto',
    );
    const expected = documentTypes.get('presupuesto')!.templates.length;
    expect(dlg('gl').querySelectorAll('.gl-card')).toHaveLength(expected);
  });

  it('«Todos» muestra las plantillas de todos los tipos, con miniatura', () => {
    openGalleryDialog(newEditor());
    dlg('gl').querySelector<HTMLElement>('.gl-chip[data-type="todos"]')!.click();
    const total = publicTypes.reduce((n, t) => n + t.templates.length, 0);
    expect(dlg('gl').querySelectorAll('.gl-card')).toHaveLength(total);
    expect(dlg('gl').querySelector('.fd-thumb[src^="data:image/svg+xml"]')).not.toBeNull();
  });

  it('«Usar» una plantilla del mismo tipo la aplica (se puede deshacer) y cierra', () => {
    const editor = newEditor();
    openGalleryDialog(editor);
    dlg('gl').querySelector<HTMLButtonElement>('.gl-card .pd-btn')!.click();
    return flush().then(() => {
      expect(editor.doc().elements.length).toBeGreaterThan(5);
      expect(dlg('gl').hasAttribute('open')).toBe(false);
      editor.history.undo();
      expect(editor.doc().elements).toHaveLength(0);
    });
  });
});

describe('modo aleatorio', () => {
  it('genera una vista previa y un resumen para el tipo abierto', () => {
    openRandomDialog(newEditor());
    const select = dlg('gl').querySelector<HTMLSelectElement>('select')!;
    expect(select.value).toBe('presupuesto');
    expect(dlg('gl').querySelector<HTMLImageElement>('.gl-preview')?.src).toContain(
      'data:image/svg+xml',
    );
    expect(dlg('gl').textContent).toContain('Presupuesto:');
  });

  it('«Usar este diseño» aplica el diseño con datos ficticios y pasa a la vista con datos', async () => {
    const editor = newEditor();
    openRandomDialog(editor);
    [...dlg('gl').querySelectorAll('button')]
      .find((b) => b.textContent === 'Usar este diseño')!
      .click();
    await flush();
    expect(editor.doc().elements.length).toBeGreaterThan(5);
    expect(editor.ui.get().fillMode).toBe(true);
    expect(String(editor.ui.get().data['emisor.nombre'] ?? '')).not.toBe('');
    expect(dlg('gl').hasAttribute('open')).toBe(false);
  });

  it('«Otro al azar» no rompe y mantiene el botón de usar activo', () => {
    openRandomDialog(newEditor());
    const again = [...dlg('gl').querySelectorAll('button')].find(
      (b) => b.textContent === 'Otro al azar',
    )!;
    again.click();
    again.click();
    const use = [...dlg('gl').querySelectorAll('button')].find(
      (b) => b.textContent === 'Usar este diseño',
    )!;
    expect(use.disabled).toBe(false);
  });
});
