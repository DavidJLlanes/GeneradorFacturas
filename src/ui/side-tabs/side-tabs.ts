import './side-tabs.css';

export interface SideTab {
  id: string;
  label: string;
  element: HTMLElement;
}

// Columna lateral con pestañas. Todas las pestañas permanecen montadas; solo se muestra una.
export function createSideTabs(tabs: readonly SideTab[]): HTMLElement {
  const root = document.createElement('div');
  root.className = 'st';
  const bar = document.createElement('div');
  bar.className = 'st-bar';
  bar.setAttribute('role', 'tablist');
  const buttons = new Map<string, HTMLButtonElement>();

  const select = (id: string): void => {
    for (const tab of tabs) {
      const active = tab.id === id;
      tab.element.hidden = !active;
      const button = buttons.get(tab.id);
      button?.setAttribute('aria-selected', String(active));
      button?.classList.toggle('is-active', active);
    }
  };

  for (const tab of tabs) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'st-tab';
    button.setAttribute('role', 'tab');
    button.textContent = tab.label;
    button.addEventListener('click', () => select(tab.id));
    buttons.set(tab.id, button);
    bar.append(button);
    tab.element.classList.add('st-panel');
  }
  root.append(bar, ...tabs.map((t) => t.element));
  if (tabs[0]) select(tabs[0].id);
  return root;
}
