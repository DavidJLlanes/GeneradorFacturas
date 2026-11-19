// Si hay un campo de formulario con el foco (un dato, una propiedad…), lo suelta. El navegador
// entonces confirma lo escrito (evento `change`) antes de que la acción del botón se ejecute.
export function commitActiveField(): void {
  const active = document.activeElement;
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement ||
    active instanceof HTMLSelectElement
  ) {
    active.blur();
  }
}
