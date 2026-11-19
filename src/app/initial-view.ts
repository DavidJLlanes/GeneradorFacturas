// Vista con la que arranca la aplicación: `#…&vista=datos` abre directamente la vista «Con datos»
// (se usa al saltar a otro tipo con datos ya cargados, como en el modo aleatorio).
export const opensFilled = (hash: string): boolean =>
  new URLSearchParams(hash.replace(/^#/, '')).get('vista') === 'datos';
