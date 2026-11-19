import { rectOf } from '../../core/document/element-rect';
import type { DocElement, DocumentModel } from '../../core/document/types';
import { createMeasure } from '../../layout/measure-element';
import { layoutDocument } from '../../layout/layout-document';
import type { Layout, PlacedItem } from '../../layout/types';
import type { Editor } from '../editor/create-editor';
import type { EditorUiState } from '../editor/editor-state';
import type { PieceRenderContext } from './elements-layer';
import { createRenderContextProvider } from './render-context';

// Lo que se dibuja ahora mismo: la plantilla tal como se diseñó, o, con datos, la página elegida del
// documento repartido (las tablas crecen y se parten, lo repetido sale en todas).
export interface ViewModel {
  context: PieceRenderContext;
  items: readonly PlacedItem[];
  pageCount: number;
  pageIndex: number;
}

type Provider = (doc: DocumentModel, ui: EditorUiState) => ViewModel;

const asItem = (e: DocElement): PlacedItem => ({ element: e, rect: rectOf(e) });

function createProvider(): Provider {
  const contextOf = createRenderContextProvider();
  const designItems = new WeakMap<DocElement, PlacedItem>();
  let layoutKey: { elements: unknown; page: unknown; context: unknown } | null = null;
  let layout: Layout | null = null;
  let last: { key: unknown; pageIndex: number; model: ViewModel } | null = null;

  return (doc, ui) => {
    const context = contextOf(ui);

    if (!ui.fillMode) {
      const items = doc.elements.map((e) => {
        let item = designItems.get(e);
        if (!item) {
          item = asItem(e);
          designItems.set(e, item);
        }
        return item;
      });
      const prev = last?.model;
      if (
        prev &&
        prev.context === context &&
        prev.items.length === items.length &&
        prev.items.every((i, n) => i === items[n])
      ) {
        return prev;
      }
      const model: ViewModel = { context, items, pageCount: 1, pageIndex: 0 };
      last = { key: null, pageIndex: 0, model };
      return model;
    }

    if (
      !layoutKey ||
      layoutKey.elements !== doc.elements ||
      layoutKey.page !== doc.page ||
      layoutKey.context !== context
    ) {
      layoutKey = { elements: doc.elements, page: doc.page, context };
      layout = layoutDocument(
        doc,
        createMeasure({ schema: context.schema, value: context.value, fillMode: true }),
      );
      last = null;
    }
    const pages = layout!.pages;
    const pageIndex = Math.min(Math.max(0, ui.pageIndex), pages.length - 1);
    if (last && last.key === layout && last.pageIndex === pageIndex) return last.model;
    const model: ViewModel = {
      context,
      items: pages[pageIndex]!.items,
      pageCount: pages.length,
      pageIndex,
    };
    last = { key: layout, pageIndex, model };
    return model;
  };
}

const providers = new WeakMap<Editor, Provider>();

// Modelo de vista de un editor; lo comparten el lienzo y los comandos de página para no repartir dos veces.
export function viewModelOf(editor: Editor): ViewModel {
  let provider = providers.get(editor);
  if (!provider) {
    provider = createProvider();
    providers.set(editor, provider);
  }
  return provider(editor.doc(), editor.ui.get());
}
