# Páginas: tabla elástica y paginación

El diseño es siempre **una página**: la plantilla tal como se dibuja. Cuando se rellena con datos
("Con datos"), el motor reparte el documento en tantas páginas como hagan falta.

## Qué hace

- **La tabla crece** con las líneas (nunca por debajo de su alto de diseño) y **empuja lo que hay debajo**.
  Lo que está encima o al lado no se mueve.
- **Si no cabe, se parte por filas.** Cada trozo repite la cabecera de la tabla. Una fila nunca se corta.
- **Lo que va debajo de la tabla** (bases, totales, forma de pago) sigue a la tabla: los totales salen en
  la última página. Si no caben tras la última fila, pasan al principio de una página nueva.
- **Piezas repetidas.** Cualquier pieza con la casilla **Repetir en cada página** (propiedades › Páginas)
  sale en todas las páginas en su sitio. Las repetidas de la mitad de arriba (cabecera, banda, número)
  marcan dónde empieza el contenido en las páginas siguientes; las de abajo (pie) marcan dónde acaba.
- **Lo que no se movió se queda.** Una pieza que nunca ha sido empujada se queda donde se diseñó, aunque
  esté fuera de la zona útil. Con pocas líneas el resultado es idéntico al diseño.

## Vista "Con datos"

Es de **solo lectura**: se ve el documento tal como saldrá (sin rejilla ni márgenes de ayuda) y no se
selecciona ni se mueve nada. Para cambiar el diseño se vuelve a la plantilla limpia (botón "Con datos").
Si hay más de una página aparece un selector abajo ("Página 2 de 3"); también valen **Re Pág** y **Av Pág**.

## Dónde está

| Pieza                                 | Archivo                                               |
| ------------------------------------- | ----------------------------------------------------- |
| Motor de reparto (puro, sin pantalla) | `src/layout/` (`layout-document.ts`, `place-rows.ts`) |
| Qué vista se dibuja (diseño o página) | `src/canvas/render/view-model.ts`                     |
| Selector de página                    | `src/canvas/render/page-nav.ts`                       |
| Casilla "Repetir en cada página"      | `src/ui/props-panel/repeat-control.ts`                |

El motor recibe el documento y una función que mide las piezas reparables, y devuelve las páginas con cada
pieza colocada (`PlacedItem`: posición, alto real y, si es un trozo, qué filas). El PDF (fase 9) usará el
mismo reparto, así que pantalla y PDF coinciden.

## Hacer reparable una pieza nueva

Una pieza que pueda crecer y partirse declara `measure(input)` y respeta `slice` al dibujar
(ver `docs/piezas.md`). La tabla es el único caso hoy; el motor no sabe nada de ella.

## Para un tipo de documento

Solo hay que marcar con `repeat: true` las piezas que deban salir en todas las páginas (la Factura marca el
pie y el número; la Moderna, además, la banda y el título). El resto se reparte solo.

## Límites actuales

- El reparto es solo vertical y la tabla es la única pieza que se parte.
- Las piezas que empiezan a la misma altura se tratan juntas: no se parten entre páginas por separado.
- No se numeran las páginas dentro del documento (un texto "Página X de N" llegará con el PDF).
