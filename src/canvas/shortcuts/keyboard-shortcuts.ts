import type { Editor } from '../editor/create-editor';
import { SHORTCUTS, type Shortcut } from './shortcut-table';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest('dialog[open]')) return true;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function matches(s: Shortcut, e: KeyboardEvent): boolean {
  const byKey = s.keys?.includes(e.key.toLowerCase()) ?? false;
  const byCode = s.codes?.includes(e.code) ?? false;
  if (!byKey && !byCode) return false;
  if ((s.mod ?? false) !== (e.ctrlKey || e.metaKey)) return false;
  if (s.shift !== undefined && s.shift !== e.shiftKey) return false;
  return !e.altKey;
}

// Atajos de teclado del editor. La barra espaciadora activa el modo "mano" (desplazar).
export function attachKeyboardShortcuts(editor: Editor): () => void {
  const setSpace = (held: boolean): void =>
    editor.ui.update((s) => (s.spaceHeld === held ? s : { ...s, spaceHeld: held }));

  const onKeyDown = (e: KeyboardEvent): void => {
    if (isTypingTarget(e.target)) return;
    if (e.key === ' ') {
      e.preventDefault();
      setSpace(true);
      return;
    }
    const shortcut = SHORTCUTS.find((s) => matches(s, e));
    if (!shortcut) return;
    e.preventDefault();
    // Con datos solo valen los atajos de vista; el resto se anula (también Ctrl+A del navegador).
    if (editor.ui.get().fillMode && !shortcut.view) return;
    shortcut.run(editor, e);
  };

  const onKeyUp = (e: KeyboardEvent): void => {
    if (e.key !== ' ') return;
    e.preventDefault();
    setSpace(false);
  };

  const onBlur = (): void => setSpace(false);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);
  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
  };
}
