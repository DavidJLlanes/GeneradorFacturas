# Cómo añadir un tipo de documento

Regla de oro: **un tipo nuevo solo añade su carpeta**. No se edita ningún archivo del núcleo ni
ningún registro: el motor descubre `src/documents/<tipo>/index.ts` por sí solo.

## Pasos

1. Copia `src/documents/ejemplo/` a `src/documents/<tipo>/` (el nombre en minúsculas y guiones).
2. En `definition.ts` cambia `ID` (debe ser igual al nombre de la carpeta), nombre, descripción,
   papel por defecto (id de `src/paper/paper-presets.ts`) y numeración.
3. En `schema.ts` define los campos: clave con puntos (`cliente.nombre`), etiqueta, tipo y grupo.
   Si cambias campos más adelante, sube `version`.
4. En `labels.es.ts` pon los textos propios del tipo.
5. En `templates/` crea las plantillas de partida (un archivo por plantilla) y añádelas en `index.ts`.
   - Un campo `kind: 'lines'` define una tabla de líneas con `columns` (clave, etiqueta, tipo, anchura).
   - Un campo o columna con `computed: true` lo calcula el tipo: no aparece en el panel de datos.
6. Cálculos propios (totales, impuestos) van en `calc.ts` y se exponen como `compute` en `index.ts`: recibe los datos y
   devuelve los valores derivados (importes de línea, subtotal, IVA, total), siempre en céntimos.
   Un tipo sin precios no lo necesita.
7. Piezas exclusivas del tipo, en `pieces/`, un archivo por pieza. Las piezas genéricas ya existentes
   (texto, tabla, totales, QR…) se usan en las plantillas; ver `docs/piezas.md`.

## Comprobaciones

```
npm run check                           # formato, lint, pruebas (valida todos los tipos) y build
npm run check:type -- <tipo> [base]     # el diff solo toca src/documents/<tipo>/ (base: origin/main)
```

La prueba "tipos descubiertos" valida cada carpeta contra el contrato (`src/core/document-type/validate.ts`):
id igual a la carpeta, papel existente, numeración, claves de campo únicas, plantillas con papel válido
y piezas sin ids repetidos. Si algo falla, el error dice qué tipo y qué regla.

## Si el tipo necesita algo que el núcleo no ofrece

Parar. Ampliar el núcleo **en una iteración aparte y de forma genérica** (archivo nuevo en su propia
carpeta), subirlo, y después usarlo desde el tipo. Nunca mezclar ambos cambios en el mismo diff.
