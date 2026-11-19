import type { DocumentModel } from '../../core/document/types';
import { History } from '../../core/history/history';
import { createStore, type Store } from '../../core/store/create-store';
import { pruneSelection } from '../selection/selection-ops';
import type { Viewport } from '../viewport/viewport';
import { createInitialUiState, type EditorUiState } from './editor-state';

export interface Editor {
  readonly history: History<DocumentModel>;
  readonly ui: Store<EditorUiState>;
  doc(): DocumentModel;
  /** Guarda un documento nuevo como un paso del historial. */
  apply(next: DocumentModel): void;
  select(ids: readonly string[]): void;
  setViewport(viewport: Viewport): void;
  /** Avisa de cambios en documento o interfaz. Varios cambios seguidos generan un solo aviso. */
  onChange(listener: () => void): () => void;
}

export function createEditor(initial: DocumentModel): Editor {
  const history = new History(initial);
  const ui = createStore(createInitialUiState());
  const listeners = new Set<() => void>();
  let queued = false;

  const notify = (): void => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      listeners.forEach((fn) => fn());
    });
  };

  history.subscribe(() => {
    const current = ui.get().selection;
    const pruned = pruneSelection(history.get(), current);
    if (pruned !== current) ui.update((s) => ({ ...s, selection: pruned }));
    notify();
  });
  ui.subscribe(notify);

  return {
    history,
    ui,
    doc: () => history.get(),
    apply: (next) => history.push(next),
    select: (ids) => ui.update((s) => ({ ...s, selection: ids })),
    setViewport: (viewport) => ui.update((s) => ({ ...s, viewport })),
    onChange: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
