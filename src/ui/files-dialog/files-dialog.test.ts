// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { createEditor } from '../../canvas/editor/create-editor';
import { createPage } from '../../core/document/page';
import { createMemoryStore } from '../../storage/local/memory-store';
import { setSession } from '../../storage/session/session-context';
import { openFilesDialog } from './files-dialog';

HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.removeAttribute('open');
};

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const dialog = (): HTMLDialogElement => document.querySelector<HTMLDialogElement>('dialog.fd')!;
const buttonWith = (text: string): HTMLButtonElement =>
  [...dialog().querySelectorAll('button')].find((b) => b.textContent?.includes(text))!;

beforeEach(() => {
  document.body.replaceChildren();
});

describe('diálogo Archivo', () => {
  it('muestra el aviso de almacenamiento local y las secciones', async () => {
    setSession({ typeId: 'factura', store: createMemoryStore() });
    const editor = createEditor({ page: createPage(210, 297), elements: [] });
    openFilesDialog(editor);
    await flush();
    const text = dialog().textContent ?? '';
    expect(text).toContain('solo en este navegador');
    expect(text).toContain('Guardar diseño');
    expect(text).toContain('Abrir datos');
    expect(text).toContain('Todavía no has guardado ninguna');
    expect(text).toContain('Plantillas de partida');
  });

  it('guarda una plantilla con nombre y aparece con su miniatura', async () => {
    const store = createMemoryStore();
    setSession({ typeId: 'factura', store });
    const editor = createEditor({ page: createPage(210, 297), elements: [] });
    openFilesDialog(editor);
    dialog().querySelector<HTMLInputElement>('.fd-name')!.value = 'Mi factura azul';
    buttonWith('Guardar el diseño actual').click();
    await flush();
    await flush();
    expect(dialog().querySelector('.fd-status')?.textContent).toContain('Mi factura azul');
    expect(dialog().textContent).toContain('Mi factura azul');
    expect(dialog().querySelector('.fd-thumb[src^="data:image/svg+xml"]')).not.toBeNull();
    expect(await store.list()).toHaveLength(1);
  });

  it('«Borrar todo» pide confirmar antes de borrar', async () => {
    const store = createMemoryStore();
    setSession({ typeId: 'factura', store });
    const editor = createEditor({ page: createPage(210, 297), elements: [] });
    openFilesDialog(editor);
    const wipe = dialog().querySelector<HTMLButtonElement>('.fd-danger')!;
    expect(wipe.textContent).toBe('Borrar todo');
    wipe.click();
    expect(wipe.textContent).toContain('¿Seguro?');
  });
});
