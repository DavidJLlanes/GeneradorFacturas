# Galería, modo aleatorio y cómo aportar plantillas

## Galería

Botón **Galería** de la barra. Muestra una tarjeta con miniatura por cada plantilla de cada tipo de
documento, con filtro por tipo (empieza en el tipo abierto). «Usar» aplica la plantilla:

- del tipo abierto: se aplica como un paso del historial (se puede deshacer);
- de otro tipo: se deja como sesión de ese tipo y la página se recarga en él (`#tipo=<id>`).

Las plantillas salen solas de `src/documents/<tipo>/index.ts`; no hay lista que editar. Las miniaturas
son esquemáticas (bloques de color) y se generan al vuelo con `src/storage/local/thumbnail.ts`.

## Modo aleatorio

Botón **Aleatorio**: elige un tipo, genera un diseño completo y muestra una vista previa. «Otro al
azar» genera otro; «Usar este diseño» lo aplica (con datos ficticios y en la vista «Con datos»).

Un diseño aleatorio es: una de las plantillas del tipo + uno de los temas de color + una fuente sin
manuscrita del catálogo + datos ficticios. Todo está en `src/random/` y es genérico:

- `rng.ts`: generador con semilla (el mismo número da el mismo resultado; útil en pruebas).
- `fake-data.ts` / `fake-values.ts`: un valor plausible por cada campo del esquema, según su tipo y su
  nombre (`nombre`, `nif`, `direccion`, `email`, fechas recientes, líneas con importes…). Un mismo bloque
  (`emisor.*`, `cliente.*`) concuerda entre sí. Los campos calculados y las imágenes no se rellenan.
- `random-design.ts`: junta plantilla, tema, fuente y datos.

Un tipo no tiene que hacer nada para funcionar. Si necesita que unos valores concuerden entre sí,
implementa el gancho opcional `refineRandomData(data, rng)` (ver `src/documents/parte/random.ts`:
la hora de fin siempre es posterior a la de inicio).

## Plantillas «Moderna»

`src/core/template-kit/band-style.ts` convierte una plantilla en su variante con banda de color a todo
el ancho. Un tipo la usa con tres líneas (`templates/moderna.ts`):

```ts
import { bandStyle } from '../../../core/template-kit/band-style';
import { clasica } from './clasica';
export const moderna = bandStyle(clasica, { id: 'moderna', name: 'Moderna' });
```

Requiere que el título y el número tengan por id `titulo` y `numero` (los bloques del kit ya lo hacen).

## Aportar una plantilla o un tipo (pull request)

1. **Una plantilla nueva** de un tipo existente: crea `src/documents/<tipo>/templates/<id>.ts` y añádela
   a `templates` en `index.ts`. Usa los bloques de `src/core/template-kit/` y colores de la paleta
   (`@primary`, `@text`, `@muted`, `@soft`, `@onPrimary`), nunca colores fijos.
2. **Un tipo nuevo**: sigue `docs/anadir-tipo.md`. Solo se añade `src/documents/<tipo>/`.
3. Escribe pruebas junto al código (el `templates.test.ts` de cada tipo comprueba variables, márgenes,
   fuentes y colores de todas sus plantillas).
4. Antes de abrir el PR:
   ```
   npm run check
   npm run check:type -- <tipo>
   ```
5. En el PR indica el tipo, adjunta una captura de la plantilla con «Datos de ejemplo» y confirma que
   el diff solo toca la carpeta del tipo. Hay una lista de comprobación en `.github/PULL_REQUEST_TEMPLATE.md`.

Si tu aportación necesita algo que el núcleo no ofrece, abre antes un PR aparte que lo amplíe de forma
genérica (regla del proyecto: el núcleo y los tipos no se mezclan en un mismo cambio).
