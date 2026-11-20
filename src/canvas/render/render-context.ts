import type { DocumentData } from '../../core/document-type/types';
import { DEFAULT_CURRENCY } from '../../data/currency';
import { makeResolver } from '../../data/make-resolver';
import type { EditorUiState } from '../editor/editor-state';
import type { PieceRenderContext } from './elements-layer';

const identity = (text: string): string => text;
const noValue = (): unknown => undefined;

type Inputs = Pick<EditorUiState, 'data' | 'schema' | 'compute' | 'fillMode'> & {
  currency: string;
};

// Datos con los que se rellena el documento: los introducidos más los que calcula el tipo.
export function deriveData(ui: Pick<EditorUiState, 'data' | 'compute'>): DocumentData {
  return ui.compute ? { ...ui.data, ...ui.compute(ui.data) } : ui.data;
}

// Crea el contexto de dibujo de las piezas a partir del estado. Solo lo rehace cuando cambian los
// datos, el esquema, los cálculos o el modo, para que mover o hacer zoom no obligue a redibujar.
export function createRenderContextProvider(): (
  ui: EditorUiState,
  currency: string,
) => PieceRenderContext {
  let last: Inputs | null = null;
  let context: PieceRenderContext = {
    resolve: identity,
    schema: null,
    value: noValue,
    fillMode: false,
    currency: DEFAULT_CURRENCY,
    version: 0,
  };

  return (ui, currency) => {
    if (
      last &&
      last.data === ui.data &&
      last.schema === ui.schema &&
      last.compute === ui.compute &&
      last.fillMode === ui.fillMode &&
      last.currency === currency
    ) {
      return context;
    }
    last = {
      data: ui.data,
      schema: ui.schema,
      compute: ui.compute,
      fillMode: ui.fillMode,
      currency,
    };
    const derived = deriveData(ui);
    context = {
      resolve: ui.fillMode ? makeResolver(ui.schema, derived, 'keep', currency) : identity,
      schema: ui.schema,
      value: ui.fillMode ? (key) => derived[key] : noValue,
      fillMode: ui.fillMode,
      currency,
      version: Number(context.version) + 1,
    };
    return context;
  };
}
