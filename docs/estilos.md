# Estilos: paleta, temas y cajas

## Paleta del documento

Cada documento lleva una **paleta** de seis colores con nombre (`src/styles/palette.ts`):

| Nombre      | Uso habitual                                |
| ----------- | ------------------------------------------- |
| `primary`   | Color principal: títulos, cabecera de tabla |
| `text`      | Texto                                       |
| `muted`     | Texto secundario                            |
| `soft`      | Fondo suave: filas alternas, destacados     |
| `line`      | Líneas y rejillas                           |
| `onPrimary` | Texto que va sobre el color principal       |

Una pieza puede guardar en una propiedad de color un valor propio (`#1f2937`) o un enlace a la paleta
(`@primary`). Al dibujar, el motor sustituye los enlaces por el color real (`src/styles/resolve-color.ts`),
así que **cambiar la paleta recolorea a la vez todas las piezas enlazadas**. Las que tienen color propio no
cambian.

- Botón **Colores** de la barra: elige un tema de partida y ajusta cada color. Es un solo paso del historial.
- Panel de propiedades: cada color se elige entre los nombres de la paleta o "Color propio".
- `DocumentModel.palette` es opcional; sin ella se usa la paleta por defecto (tema Grafito).

## Temas

`src/styles/themes/themes.ts` define los temas de partida (Grafito, Azul, Verde, Burdeos, Ámbar,
Violeta). Añadir uno es añadir una línea.

## Estilo de caja

`src/pieces/shared/box-style.ts` reúne fondo, borde, esquinas, sombra y margen interior. La pieza
Texto los usa todos; Imagen usa borde, esquinas y sombra; Forma usa sombra. Una pieza nueva los reutiliza
declarando las propiedades que necesite (`FILL_PROPS`, `BORDER_PROPS`, `SHADOW_PROPS`, `PADDING_PROPS`).

El texto, la cabecera y el pie tienen además **interlineado**. La tabla tiene grosor de líneas, cabecera en
negrita opcional y margen de celda.

## Para un tipo de documento

Las plantillas deben usar enlaces (`@primary`, `@text`…) y no colores fijos, para que los temas funcionen.
Una plantilla puede traer su propia paleta en `document.palette` (la Moderna de Factura lo hace). No hace
falta tocar el núcleo.

## Límites actuales

- Las tipografías siguen siendo las del sistema hasta la fase 7.
- Cabecera y pie repetidos en cada página llegan con la paginación (fase 8).
- La paleta aún no se guarda en un archivo de diseño (fase 10).
