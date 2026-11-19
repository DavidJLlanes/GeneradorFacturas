import { CATEGORY_LABELS, fontStack, type FontEntry } from '../../fonts/catalog';
import { ensureFont } from '../../fonts/load-font';
import { searchFonts } from '../../fonts/search-fonts';
import { customFontRows } from './custom-fonts-section';
import '../dialog/dialog.css';
import './font-picker.css';

const SAMPLE = 'Factura 2026 · 1.234,56 € · Ñandú';

let dialog: HTMLDialogElement | null = null;
let open: ((current: string) => Promise<string | null>) | null = null;

function item(label: string, family: string, sample: string, onPick: () => void): HTMLElement {
  const li = document.createElement('button');
  li.type = 'button';
  li.className = 'fp-item';
  const name = document.createElement('span');
  name.className = 'fp-name';
  name.textContent = label;
  name.style.fontFamily = family;
  const preview = document.createElement('span');
  preview.className = 'fp-sample';
  preview.textContent = sample;
  preview.style.fontFamily = family;
  li.append(name, preview);
  li.addEventListener('click', onPick);
  return li;
}

function build(): void {
  const d = document.createElement('dialog');
  d.className = 'pd fp';
  d.setAttribute('aria-label', 'Elegir fuente');

  const title = document.createElement('h2');
  title.textContent = 'Fuente';

  const search = document.createElement('input');
  search.type = 'search';
  search.className = 'fp-search';
  search.placeholder = 'Buscar fuente…';
  search.setAttribute('aria-label', 'Buscar fuente');

  const list = document.createElement('div');
  list.className = 'fp-list';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'pd-btn';
  close.textContent = 'Cancelar';
  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(close);

  d.append(title, search, list, actions);
  document.body.append(d);

  let current = '';
  let chosen: string | null = null;
  let finish: ((value: string | null) => void) | null = null;

  // Las fuentes se cargan solo cuando su fila entra en pantalla.
  const watcher =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              const id = (e.target as HTMLElement).dataset['font'];
              if (e.isIntersecting && id) {
                ensureFont(id);
                watcher?.unobserve(e.target);
              }
            }
          },
          { root: list },
        );

  const pick = (id: string): void => {
    chosen = id;
    d.close();
  };

  const render = (): void => {
    watcher?.disconnect();
    const rows: HTMLElement[] = [];
    const system = item('Fuente del sistema', 'inherit', SAMPLE, () => pick(''));
    if (current === '') system.classList.add('is-current');
    if (search.value.trim() === '') rows.push(system);
    if (search.value.trim() === '') {
      rows.push(
        ...customFontRows(
          (label, family, id) => customRow(label, family, id),
          (id) => pick(id),
        ),
      );
    }
    let last = '';
    for (const font of searchFonts(search.value)) {
      if (font.category !== last) {
        last = font.category;
        const h = document.createElement('div');
        h.className = 'fp-group';
        h.textContent = CATEGORY_LABELS[font.category];
        rows.push(h);
      }
      rows.push(fontRow(font));
    }
    if (rows.length === 0) {
      const none = document.createElement('p');
      none.className = 'pd-hint';
      none.textContent = 'Ninguna fuente coincide.';
      rows.push(none);
    }
    list.replaceChildren(...rows);
    for (const row of rows) {
      const id = row.dataset['font'];
      if (!id) continue;
      if (watcher) watcher.observe(row);
      else ensureFont(id);
    }
  };

  const customRow = (label: string, family: string, id: string): HTMLElement => {
    const row = item(label, family, SAMPLE, () => pick(id));
    row.dataset['font'] = id;
    if (id === current) row.classList.add('is-current');
    return row;
  };

  const fontRow = (font: FontEntry): HTMLElement => {
    const row = item(font.name, fontStack(font.id), SAMPLE, () => pick(font.id));
    row.dataset['font'] = font.id;
    if (font.id === current) row.classList.add('is-current');
    return row;
  };

  search.addEventListener('input', render);
  close.addEventListener('click', () => d.close());
  d.addEventListener('close', () => {
    finish?.(chosen);
    finish = null;
  });

  dialog = d;
  open = (id) =>
    new Promise((resolve) => {
      current = id;
      chosen = null;
      finish = resolve;
      search.value = '';
      render();
      d.showModal();
      list.scrollTop = 0;
      search.focus();
    });
}

// Abre el buscador de fuentes y devuelve el id elegido ('' = la del sistema) o null si se cancela.
export function pickFont(current: string): Promise<string | null> {
  if (!dialog || !open) build();
  return open ? open(current) : Promise.resolve(null);
}
