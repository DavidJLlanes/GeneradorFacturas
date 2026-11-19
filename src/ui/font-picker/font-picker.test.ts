// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { FONTS } from '../../fonts/catalog';
import { createFontField } from '../fields/font-field';
import { pickFont } from './font-picker';

// happy-dom no implementa showModal/close con eventos: los simulamos lo justo.
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

const dialog = (): HTMLDialogElement => document.querySelector<HTMLDialogElement>('dialog.fp')!;
const items = (): HTMLElement[] => [...dialog().querySelectorAll<HTMLElement>('.fp-item')];

describe('buscador de fuentes', () => {
  it('lista la del sistema y todas las del catálogo', async () => {
    const result = pickFont('');
    expect(items()).toHaveLength(FONTS.length + 1);
    dialog().querySelector<HTMLButtonElement>('.pd-btn')!.click();
    expect(await result).toBeNull();
  });

  it('filtra al escribir y devuelve la fuente elegida', async () => {
    const result = pickFont('');
    const search = dialog().querySelector<HTMLInputElement>('.fp-search')!;
    search.value = 'lora';
    search.dispatchEvent(new Event('input'));
    expect(items().map((i) => i.querySelector('.fp-name')?.textContent)).toEqual(['Lora']);
    items()[0]!.click();
    expect(await result).toBe('lora');
  });

  it('elegir la fuente del sistema devuelve cadena vacía', async () => {
    const result = pickFont('inter');
    expect(dialog().querySelector('.is-current .fp-name')?.textContent).toBe('Inter');
    items()[0]!.click();
    expect(await result).toBe('');
  });

  it('avisa si nada coincide', async () => {
    const result = pickFont('');
    const search = dialog().querySelector<HTMLInputElement>('.fp-search')!;
    search.value = 'zzzz';
    search.dispatchEvent(new Event('input'));
    expect(items()).toHaveLength(0);
    expect(dialog().textContent).toContain('Ninguna fuente coincide');
    dialog().querySelector<HTMLButtonElement>('.pd-btn')!.click();
    await result;
  });
});

describe('campo de fuente', () => {
  it('muestra el nombre en su fuente y "Sistema" si no hay', () => {
    const field = createFontField('Fuente');
    expect(field.input.textContent).toBe('Sistema');
    field.set('playfair-display');
    expect(field.input.textContent).toBe('Playfair Display');
    expect(field.input.style.fontFamily).toContain('Playfair Display');
  });

  it('al elegir en el buscador avisa con el id', async () => {
    const field = createFontField('Fuente');
    const changes: string[] = [];
    field.onChange((id) => changes.push(id));
    field.input.click();
    items()
      .find((i) => i.dataset['font'] === 'roboto')!
      .click();
    await new Promise((r) => setTimeout(r, 0));
    expect(changes).toEqual(['roboto']);
    expect(field.input.textContent).toBe('Roboto');
  });
});
