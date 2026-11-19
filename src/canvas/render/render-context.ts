import { makeResolver } from '../../data/make-resolver';
import type { EditorUiState } from '../editor/editor-state';
import type { PieceRenderContext } from './elements-layer';

const identity = (text: string): string => text;

// Crea el contexto de dibujo de las piezas a partir del estado. Solo lo rehace cuando cambian los
// datos, el esquema o el modo, para que mover o hacer zoom no obligue a redibujar las piezas.
export function createRenderContextProvider(): (ui: EditorUiState) => PieceRenderContext {
  let last: Pick<EditorUiState, 'data' | 'schema' | 'fillMode'> | null = null;
  let context: PieceRenderContext = { resolve: identity, version: 0 };

  return (ui) => {
    if (
      last &&
      last.data === ui.data &&
      last.schema === ui.schema &&
      last.fillMode === ui.fillMode
    ) {
      return context;
    }
    last = { data: ui.data, schema: ui.schema, fillMode: ui.fillMode };
    const version = Number(context.version) + 1;
    context = {
      resolve: ui.fillMode ? makeResolver(ui.schema, ui.data) : identity,
      version,
    };
    return context;
  };
}
