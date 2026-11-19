import { rectOf } from '../core/document/element-rect';
import type { DocumentModel } from '../core/document/types';
import { withPageVariables } from '../data/page-variables';
import { makeResolver } from '../data/make-resolver';
import { createElementsLayer, type PieceRenderContext } from '../canvas/render/elements-layer';
import { deriveData } from '../canvas/render/render-context';
import type { EditorUiState } from '../canvas/editor/editor-state';
import { layoutDocument } from '../layout/layout-document';
import { createMeasure } from '../layout/measure-element';
import type { PageLayout } from '../layout/types';
import { mmToPx } from '../core/units/units';
import { paletteOf } from '../styles/palette';
import './print.css';

// Qué se imprime: el documento con los datos, o el modelo limpio (sin datos) para rellenar a mano.
export type PrintMode = 'filled' | 'clean';

export interface PrintPlan {
  mode: PrintMode;
  pages: readonly PageLayout[];
  /** Contexto de dibujo común a todas las páginas (cada página le añade su número). */
  context: Omit<PieceRenderContext, 'resolve' | 'version'> & { base(text: string): string };
}

const noValue = (): unknown => undefined;

// Decide las páginas y los datos de lo que se va a imprimir. Las variables sin dato salen vacías: el
// PDF no debe enseñar nunca `{{campo}}`.
export function planPrint(doc: DocumentModel, ui: EditorUiState, mode: PrintMode): PrintPlan {
  if (mode === 'clean') {
    const items = doc.elements
      .filter((e) => !e.hidden)
      .map((e) => ({ element: e, rect: rectOf(e) }));
    return {
      mode,
      pages: [{ items }],
      context: {
        base: makeResolver(ui.schema, {}, 'empty'),
        schema: ui.schema,
        value: noValue,
        fillMode: false,
      },
    };
  }
  const derived = deriveData(ui);
  const value = (key: string): unknown => derived[key];
  const layout = layoutDocument(doc, createMeasure({ schema: ui.schema, value, fillMode: true }));
  return {
    mode,
    pages: layout.pages,
    context: {
      base: makeResolver(ui.schema, derived, 'empty'),
      schema: ui.schema,
      value,
      fillMode: true,
    },
  };
}

// Construye el documento imprimible: una `div` por página con el tamaño exacto del papel.
export function buildPrintRoot(doc: DocumentModel, plan: PrintPlan): HTMLElement {
  const root = document.createElement('div');
  root.className = 'pdf-root';

  const { widthMm, heightMm } = doc.page;
  const size = document.createElement('style');
  size.textContent = `@page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }`;
  root.append(size);

  const total = plan.pages.length;
  plan.pages.forEach((page, index) => {
    const node = document.createElement('div');
    node.className = 'pdf-page';
    node.style.width = `${mmToPx(widthMm)}px`;
    // Una pizca menos que el papel para que el redondeo no genere una página en blanco.
    node.style.height = `calc(${heightMm}mm - 0.2mm)`;
    const layer = createElementsLayer();
    const { base, ...rest } = plan.context;
    layer.update(
      page.items,
      { ...rest, resolve: withPageVariables(base, index + 1, total), version: index },
      paletteOf(doc),
    );
    node.append(layer.element);
    root.append(node);
  });
  return root;
}
