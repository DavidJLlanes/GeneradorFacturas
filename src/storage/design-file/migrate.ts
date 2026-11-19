// Migración entre versiones de un archivo guardado (diseño o copia local). Cada migración sube una
// versión: `MIGRATIONS[n]` convierte la versión `n` en la `n + 1`. Al cambiar el formato se sube
// `DESIGN_VERSION` y se añade aquí la función correspondiente; los archivos antiguos siguen abriendo.
export type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

export const MIGRATIONS: Readonly<Record<number, Migration>> = {};

export function migrateTo(
  raw: Record<string, unknown>,
  target: number,
  migrations: Readonly<Record<number, Migration>> = MIGRATIONS,
): Record<string, unknown> {
  let version = raw['version'];
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
    throw new Error('El archivo no indica su versión.');
  }
  if (version > target) {
    throw new Error(
      'El archivo es de una versión más nueva de la aplicación. Actualiza la página.',
    );
  }
  let current = raw;
  while (version < target) {
    const step = migrations[version];
    if (!step) throw new Error(`No se sabe abrir un archivo de la versión ${version}.`);
    current = { ...step(current), version: version + 1 };
    version += 1;
  }
  return current;
}
