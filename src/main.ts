import { chooseTemplate, chooseType } from './app/choose-type';
import { createAppEditor } from './app/create-app-editor';
import { opensFilled } from './app/initial-view';
import { restoreSession, templateOf } from './app/restore-session';
import { documentTypes } from './core/document-type/discover';
import { createBestStore } from './storage/local/idb-store';
import { setSession } from './storage/session/session-context';
import { attachAutosave } from './storage/local/autosave';
import { mountApp } from './ui/mount-app';
import './ui/base.css';

async function start(root: HTMLElement): Promise<void> {
  const hash = window.location.hash;
  const type = chooseType(documentTypes, hash);
  const store = await createBestStore();
  setSession({ typeId: type.id, store });

  const saved = await restoreSession(store, type, hash);
  const editor = createAppEditor(type, saved ? templateOf(saved) : chooseTemplate(type, hash));
  if (saved) editor.ui.update((s) => ({ ...s, data: saved.datos }));
  if (opensFilled(hash)) editor.ui.update((s) => ({ ...s, fillMode: true }));

  mountApp(root, editor);
  attachAutosave(editor, type.id, store);
}

const root = document.getElementById('app');
if (root) void start(root);
