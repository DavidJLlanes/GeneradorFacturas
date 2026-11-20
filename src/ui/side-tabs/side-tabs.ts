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

  // En pantallas estrechas el panel es plegable: empieza cerrado para dejar sitio a la página, y
  // tocar la pestaña activa lo cierra o abre.
  const narrow = window.matchMedia('(max-width: 720px)');
  let active = tabs[0]?.id ?? '';
  const setCollapsed = (collapsed: boolean): void => {
    root.classList.toggle('is-collapsed', collapsed);
    for (const button of buttons.values()) {
      button.setAttribute('aria-expanded', String(!collapsed));
    }
  };

  const select = (id: string): void => {
    active = id;
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
    button.addEventListener('click', () => {
      const wasActive = tab.id === active;
      select(tab.id);
      if (narrow.matches)
        setCollapsed(wasActive ? !root.classList.contains('is-collapsed') : false);
    });
    buttons.set(tab.id, button);
    bar.append(button);
    tab.element.classList.add('st-panel');
  }
  root.append(bar, ...tabs.map((t) => t.element));
  if (tabs[0]) select(tabs[0].id);
  setCollapsed(narrow.matches);
  return root;
}
