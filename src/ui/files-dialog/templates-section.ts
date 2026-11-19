import type { Editor } from '../../canvas/editor/create-editor';
import { documentTypes } from '../../core/document-type/discover';
import { applyDesign } from '../../storage/design-file/apply-design';
import { buildDesign } from '../../storage/design-file/build-design';
import { listTemplates, openRecord, saveTemplate } from '../../storage/local/records';
import type { SavedRecord } from '../../storage/local/record';
import { getSession } from '../../storage/session/session-context';

export interface Section {
  element: HTMLElement;
  refresh(): Promise<void>;
}

const button = (text: string, onClick: () => void, className = 'pd-btn'): HTMLButtonElement => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
};

function card(thumb: string, name: string, actions: readonly HTMLElement[]): HTMLElement {
  const item = document.createElement('div');
  item.className = 'fd-card';
  const img = document.createElement('img');
  img.className = 'fd-thumb';
  img.alt = '';
  if (thumb) img.src = thumb;
  const label = document.createElement('span');
  label.className = 'fd-card-name';
  label.textContent = name;
  const row = document.createElement('div');
  row.className = 'fd-card-actions';
  row.append(...actions);
  item.append(img, label, row);
  return item;
}

// "Mis plantillas": guardar el diseño actual con nombre y volver a abrirlo o borrarlo.
// Debajo, las plantillas de partida del tipo de documento.
export function createTemplatesSection(
  editor: Editor,
  say: (message: string) => void,
  nameOf: () => string,
): Section {
  const element = document.createElement('section');
  element.className = 'fd-section';
  const title = document.createElement('h3');
  title.textContent = 'Mis plantillas';
  const grid = document.createElement('div');
  grid.className = 'fd-grid';
  const startTitle = document.createElement('h3');
  startTitle.textContent = 'Plantillas de partida';
  const startGrid = document.createElement('div');
  startGrid.className = 'fd-grid';

  const save = button('Guardar el diseño actual como plantilla', () => {
    const { store, typeId } = getSession();
    void saveTemplate(store, editor, typeId, nameOf())
      .then((record) => {
        say(`Plantilla «${record.nombre}» guardada en este navegador.`);
        return refresh();
      })
      .catch(() => say('No se pudo guardar: el navegador no permite el almacenamiento local.'));
  });

  const record = (r: SavedRecord): HTMLElement =>
    card(r.miniatura, r.nombre, [
      button('Abrir', () => {
        try {
          openRecord(editor, r);
          say(`Plantilla «${r.nombre}» abierta. Se puede deshacer.`);
        } catch (error) {
          say(error instanceof Error ? error.message : 'No se pudo abrir la plantilla.');
        }
      }),
      button('Borrar', () => {
        void getSession()
          .store.delete(r.id)
          .then(() => refresh());
      }),
    ]);

  const type = documentTypes.get(getSession().typeId);
  for (const template of type?.templates ?? []) {
    startGrid.append(
      card('', template.name, [
        button('Abrir', () => {
          applyDesign(editor, buildDesign(template.document, getSession().typeId, template.name));
          say(`Plantilla «${template.name}» abierta. Se puede deshacer.`);
        }),
      ]),
    );
  }

  async function refresh(): Promise<void> {
    const { store, typeId } = getSession();
    const saved = await listTemplates(store, typeId).catch(() => []);
    if (saved.length === 0) {
      const none = document.createElement('p');
      none.className = 'pd-hint';
      none.textContent = 'Todavía no has guardado ninguna.';
      grid.replaceChildren(none);
    } else grid.replaceChildren(...saved.map(record));
  }

  element.append(title, save, grid, startTitle, startGrid);
  return { element, refresh };
}
