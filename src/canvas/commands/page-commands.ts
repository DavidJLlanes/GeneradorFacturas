import { samePage } from '../../core/document/page';
import type { Page } from '../../core/document/types';
import { adaptElements, type AdaptMode } from '../../paper/adapt-elements';
import type { Editor } from '../editor/create-editor';
import { zoomToFit } from './view-commands';

// Cambia el papel como un único paso del historial. Si cambian las medidas, las piezas se adaptan
// según `adapt` y la vista se reencuadra.
export function changePage(editor: Editor, next: Page, adapt: AdaptMode): void {
  const doc = editor.doc();
  if (samePage(doc.page, next)) return;

  const resized = next.widthMm !== doc.page.widthMm || next.heightMm !== doc.page.heightMm;
  const elements = resized ? adaptElements(doc.elements, doc.page, next, adapt) : doc.elements;
  editor.apply({ ...doc, page: next, elements });
  if (resized) zoomToFit(editor);
}
