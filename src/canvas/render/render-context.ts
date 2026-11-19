import type { DocumentData } from '../../core/document-type/types';
import { makeResolver } from '../../data/make-resolver';
import type { EditorUiState } from '../editor/editor-state';
import type { PieceRenderContext } from './elements-layer';

const identity = (text: string): string => text;
const noValue = (): unknown => undefined;

type Inputs = Pick<EditorUiState, 'data' | 'schema' | 'compute' | 'fillMode'>;

// Datos con los que se rellena el documento: los introducidos más los que calcula el tipo.
export function deriveData(ui: Pick<EditorUiState, 'data' | 'compute'>): DocumentData {
  return ui.compute ? { ...ui.data, ...ui.compute(ui.data) } : ui.data;
}

// Crea el contexto de dibujo de las piezas a partir del estado. Solo lo rehace cuando cambian los
// datos, el esquema, los cálculos o el modo, para que mover o hacer zoom no obligue a redibujar.
export function createRenderContextProvider(): (ui: EditorUiState) => PieceRenderContext {
  let last: Inputs | null = null;
  let context: PieceRenderContext = {
    resolve: identity,
    schema: null,
    value: noValue,
    fillMode: false,
    version: 0,
  };

  return (ui) => {
    if (
      last &&
      last.data === ui.data &&
      last.schema === ui.schema &&
      last.compute === ui.compute &&
      last.fillMode === ui.fillMode
    ) {
      return context;
    }
    last = { data: ui.data, schema: ui.schema, compute: ui.compute, fillMode: ui.fillMode };
    const derived = deriveData(ui);
    context = {
      resolve: ui.fillMode ? makeResolver(ui.schema, derived) : identity,
      schema: ui.schema,
      value: ui.fillMode ? (key) => derived[key] : noValue,
      fillMode: ui.fillMode,
      version: Number(context.version) + 1,
    };
    return context;
  };
}
