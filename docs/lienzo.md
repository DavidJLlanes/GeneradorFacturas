# Lienzo (pizarra)

Controles del editor y mapa de dónde vive cada cosa en `src/canvas/`.

## Controles

| Acción                       | Ratón / teclado                                      | Táctil                   |
| ---------------------------- | ---------------------------------------------------- | ------------------------ |
| Seleccionar                  | Clic. Shift/Ctrl/⌘ + clic suma o quita               | Toque                    |
| Seleccionar varios           | Arrastrar sobre zona vacía (Shift suma)              | —                        |
| Mover                        | Arrastrar (Shift fija el eje)                        | Arrastrar                |
| Redimensionar                | Tiradores (Shift mantiene proporción, Alt: centro)   | Tiradores                |
| Desplazar la vista           | Rueda · Espacio + arrastrar · botón central          | Un dedo sobre zona vacía |
| Zoom                         | Ctrl/⌘ + rueda · `+` / `-`                           | Pellizco con dos dedos   |
| Ver página / 100 % / detalle | `Shift+1` / `Shift+0` / `Shift+2`                    | Botones de la barra      |
| Deshacer / rehacer           | `Ctrl+Z` / `Ctrl+Shift+Z` (o `Ctrl+Y`)               | Botones                  |
| Duplicar / eliminar          | `Ctrl+D` / `Supr`                                    | Botones                  |
| Seleccionar todo / quitar    | `Ctrl+A` / `Esc`                                     | —                        |
| Mover con flechas            | Flechas (1 mm) · Shift + flechas (10 mm)             | —                        |
| Orden de capas               | `]` adelante · `[` atrás · con Ctrl: al frente/fondo | Botones                  |
| Bloquear / ocultar           | `Ctrl+Shift+L` / `Ctrl+Shift+H`                      | Botones y panel de capas |

Los elementos bloqueados o con la capa oculta no se seleccionan desde la página; se eligen desde el
panel de capas. Un elemento bloqueado no se mueve, no se redimensiona y no se elimina.

## Mapa del código

```
src/canvas/
  editor/      estado de la interfaz y el editor (documento + historial + selección + vista)
  commands/    acciones sobre el editor, una por archivo de tema (elementos, orden, alinear, zoom…)
  gestures/    gestos del puntero: mover, redimensionar, rectángulo, desplazar, pellizcar
  input/       eventos del navegador (puntero, rueda) y elección del gesto
  shortcuts/   tabla de atajos y su escucha del teclado
  selection/   qué hay bajo un punto, qué toca un rectángulo, utilidades de selección
  snapping/    imán a guías y a la rejilla (mover y redimensionar)
  transform/   cálculo del redimensionado y de la escala de grupos
  align/       alinear y distribuir
  viewport/    conversión página ↔ pantalla, zoom y encuadre
  render/      dibujo en el DOM: página, elementos, selección, guías, reglas
```

## Cómo se amplía

- **Nuevo comando:** un archivo o función en `commands/`; luego se enlaza en `shortcuts/shortcut-table.ts`
  y/o en un grupo de `ui/toolbar/groups/`.
- **Nuevo gesto:** un archivo en `gestures/` que devuelva un `Gesture` y una línea en
  `input/choose-gesture.ts`.
- **Nuevo botón:** una entrada en el grupo correspondiente de `ui/toolbar/groups/` (o un grupo nuevo,
  registrado en `groups/index.ts`).

El lienzo no sabe nada de facturas ni de ningún tipo de documento: trabaja con elementos genéricos
(`core/document`). Los tipos de documento llegarán en `src/documents/` sin modificar esta carpeta.
