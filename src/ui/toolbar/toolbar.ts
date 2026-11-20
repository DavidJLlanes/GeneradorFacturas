import type { Editor } from '../../canvas/editor/create-editor';
import { APP_NAME } from '../../core/app-info';
import type { ButtonSpec } from './button-spec';
import { createButton } from './create-button';
import { TOOLBAR_GROUPS } from './groups';
import './toolbar.css';

export function createToolbar(editor: Editor): { element: HTMLElement; destroy(): void } {
  const root = document.createElement('div');
  root.className = 'tb';
  root.setAttribute('role', 'toolbar');
  root.setAttribute('aria-label', 'Herramientas');

  const title = document.createElement('strong');
  title.className = 'tb-title';
  title.textContent = APP_NAME;
  root.append(title);

  const entries: { spec: ButtonSpec; button: HTMLButtonElement }[] = [];
  for (const group of TOOLBAR_GROUPS) {
    const wrap = document.createElement('div');
    wrap.className = 'tb-group';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', group.title);
    for (const spec of group.buttons) {
      const button = createButton(spec, editor);
      wrap.append(button);
      entries.push({ spec, button });
    }
    root.append(wrap);
  }

  const refresh = (): void => {
    for (const { spec, button } of entries) {
      const label = typeof spec.label === 'function' ? spec.label(editor) : spec.label;
      if (button.textContent !== label) button.textContent = label;
      // El nombre es el texto visible (así coincide con lo que se ve y se dice por voz). Si solo hay un
      // símbolo (↶, ↷, +, −), el nombre es la descripción.
      if (/\p{L}/u.test(label)) button.removeAttribute('aria-label');
      else if (/\d/.test(label)) button.setAttribute('aria-label', `${label}: ${spec.title}`);
      else button.setAttribute('aria-label', spec.title);
      button.disabled = spec.enabled ? !spec.enabled(editor) : false;
      if (spec.pressed) button.setAttribute('aria-pressed', String(spec.pressed(editor)));
    }
  };
  refresh();

  return { element: root, destroy: editor.onChange(refresh) };
}
