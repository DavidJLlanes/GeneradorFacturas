// Variables de página, disponibles en cualquier texto: `{{pagina}}` (la de esta página) y `{{paginas}}`
// (el total). Solo tienen valor con la vista "Con datos" y en el PDF.
export const PAGE_VARIABLES = ['pagina', 'paginas'] as const;

const PAGE = /\{\{\s*pagina\s*\}\}/g;
const PAGES = /\{\{\s*paginas\s*\}\}/g;

// Envuelve un resolvedor de variables para que además rellene el número de página y el total.
export function withPageVariables(
  resolve: (text: string) => string,
  page: number,
  total: number,
): (text: string) => string {
  return (text) => resolve(text.replace(PAGE, String(page)).replace(PAGES, String(total)));
}
