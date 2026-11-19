# Piezas y datos

Todo lo que hay en la página es una **pieza**: un elemento con posición y tamaño en mm, un `kind`
(su tipo de pieza) y unas `props` (valores simples, serializables a JSON).

## Una carpeta por pieza

Cada pieza vive en `src/pieces/<kind>/index.ts` y exporta por defecto su definición. Se descubre sola:
no hay lista que editar. La barra "Insertar", el panel de propiedades y el dibujo se generan a partir de
la definición.

| Campo                         | Para qué sirve                                                                               |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `kind`, `name`                | Identificador (igual que la carpeta) y nombre visible.                                       |
| `defaultSize`, `defaultProps` | Tamaño y valores con los que se inserta.                                                     |
| `props`                       | Propiedades editables (`text`, `multiline`, `number`, `color`, `select`, `toggle`, `image`). |
| `render(node, input)`         | Dibuja la pieza; debe ser idempotente.                                                       |
| `inlineProp`                  | Propiedad que se edita con doble clic sobre la página.                                       |
| `anchor`                      | `top` o `bottom`: se pega a ese borde de la zona útil (cabecera, pie).                       |

Piezas actuales: texto, forma, línea, imagen, cabecera, pie, código QR, tabla de líneas y totales.
Lo compartido por varias piezas (estilo de texto, bandas, estilo de caja; ver `docs/estilos.md`) está en `src/pieces/shared/`, sin `index.ts`
para que no se tome por una pieza.

El texto se escribe siempre con `textContent`, nunca como HTML.

## Variables y datos

- Un texto puede llevar variables `{{cliente.nombre}}`. La clave sigue el esquema del tipo.
- Con la plantilla limpia se ven las variables; con "Con datos" se rellenan.
- Los datos no entran en el historial de deshacer del diseño.
- Los importes son **céntimos enteros** (`src/data/money.ts`); se muestran con formato `es-ES`.
- Un campo `computed` lo calcula el tipo en `compute(data)`; se puede usar en variables pero no se edita.
- Un campo `lines` es una tabla de líneas con `columns`; la pieza `table` lee sus columnas del esquema.

## Imágenes

PNG, JPG o SVG (10 MB máximo; SVG hasta 500 KB). Las rasterizadas se reducen a 1600 px de lado mayor.
Se guardan como data URL dentro del diseño. Una pieza imagen puede ligarse a un campo de datos de imagen.

## Añadir una pieza

1. Crea `src/pieces/<kind>/index.ts` (y `render.ts` si el dibujo es largo).
2. Declara sus `props` y valores por defecto.
3. `npm run check`: la prueba de piezas valida el contrato.

No se toca nada más.

## Piezas que crecen y se reparten

Una pieza puede declarar `measure(input)` (en `PieceDefinition`): devuelve su alto con los datos actuales
como una cabecera fija (`headMm`) más una lista de unidades repartibles (`unitsMm`, p. ej. las filas).
Con eso el motor de páginas (ver `docs/paginas.md`) la hace crecer y la parte entre páginas. Al dibujar, la
pieza recibe `slice` (`from`/`to`) con las unidades que le tocan y siempre dibuja su cabecera.
