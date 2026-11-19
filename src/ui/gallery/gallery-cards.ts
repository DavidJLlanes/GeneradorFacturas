import type { Editor } from '../../canvas/editor/create-editor';
import { documentTypes } from '../../core/document-type/discover';
import type { DocumentTemplate, DocumentTypeDefinition } from '../../core/document-type/types';
import { buildDesign } from '../../storage/design-file/build-design';
import { thumbnailSvg } from '../../storage/local/thumbnail';
import { openDesign } from '../../storage/session/open-design';

// Tipos que se ofrecen al usuario (los internos de prueba quedan fuera).
export const publicTypes = (): readonly DocumentTypeDefinition[] =>
  documentTypes.list().filter((t) => !t.internal);

export function card(
  thumb: string,
  title: string,
  subtitle: string,
  action: HTMLElement,
): HTMLElement {
  const item = document.createElement('div');
  item.className = 'fd-card gl-card';
  const img = document.createElement('img');
  img.className = 'fd-thumb';
  img.alt = '';
  img.src = thumb;
  const name = document.createElement('span');
  name.className = 'fd-card-name';
  name.textContent = title;
  const sub = document.createElement('span');
  sub.className = 'gl-sub';
  sub.textContent = subtitle;
  item.append(img, name, sub, action);
  return item;
}

export function useButton(
  editor: Editor,
  type: DocumentTypeDefinition,
  template: DocumentTemplate,
  say: (message: string) => void,
  close: () => void,
): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'pd-btn';
  b.textContent = 'Usar';
  b.addEventListener('click', () => {
    const file = buildDesign(template.document, type.id, template.name);
    openDesign(editor, file).then(
      (result) => {
        if (result === 'here') close();
      },
      (error: unknown) => say(error instanceof Error ? error.message : 'No se pudo abrir.'),
    );
  });
  return b;
}

// Una tarjeta por plantilla de los tipos pedidos (todos si `typeId` es `null`).
export function templateCards(
  editor: Editor,
  typeId: string | null,
  say: (message: string) => void,
  close: () => void,
): HTMLElement[] {
  return publicTypes()
    .filter((t) => typeId === null || t.id === typeId)
    .flatMap((type) =>
      type.templates.map((template) =>
        card(
          thumbnailSvg(template.document),
          template.name,
          type.name,
          useButton(editor, type, template, say, close),
        ),
      ),
    );
}
