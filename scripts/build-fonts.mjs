// Copia a `public/fonts/` las fuentes del catálogo (`src/fonts/catalog.json`) desde los paquetes
// @fontsource, con su licencia. Así se sirven desde nuestro propio servidor, sin terceros.
// Solo subconjuntos latin y latin-ext, en woff2. Falla si falta algún archivo del catálogo.
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(root, 'src/fonts/catalog.json'), 'utf8'));
const out = join(root, 'public/fonts');
const SUBSETS = ['latin', 'latin-ext'];

rmSync(out, { recursive: true, force: true });
let total = 0;
let count = 0;

for (const font of catalog) {
  const pkg = join(root, 'node_modules/@fontsource', font.id);
  const dest = join(out, font.id);
  mkdirSync(dest, { recursive: true });
  for (const style of font.styles) {
    const weight = style.replace('i', '');
    const kind = style.endsWith('i') ? 'italic' : 'normal';
    for (const subset of SUBSETS) {
      const name = `${font.id}-${subset}-${weight}-${kind}.woff2`;
      const from = join(pkg, 'files', name);
      if (!existsSync(from)) throw new Error(`Falta ${name}: ejecuta "npm ci".`);
      copyFileSync(from, join(dest, name));
      total += statSync(from).size;
      count += 1;
    }
  }
  copyFileSync(join(pkg, 'LICENSE'), join(dest, 'LICENSE'));
}

console.log(
  `Fuentes: ${catalog.length} familias, ${count} archivos, ${(total / 1e6).toFixed(1)} MB`,
);
