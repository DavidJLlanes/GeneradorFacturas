# Papel: tamaños, orientación y márgenes

Todo el modelo está en milímetros. La página (`Page`) tiene `widthMm`, `heightMm` y `marginsMm`
(superior, derecho, inferior, izquierdo). Los márgenes delimitan la zona de seguridad de impresión.

## Dónde vive cada cosa

- `src/core/document/page.ts`: crear la página, zona útil (`contentRect`) y comparar páginas.
- `src/paper/paper-presets.ts`: catálogo (A3, A4, A5, A6, Carta, Legal, Ticket 80 y 58 mm, Cuadrado).
  Añadir un papel es añadir una línea.
- `src/paper/match-preset.ts`: reconoce el papel por medidas (vertical u horizontal).
- `src/paper/orientation.ts`, `margins.ts`, `size-limits.ts`: orientación, márgenes válidos, límites (20–5000 mm).
- `src/paper/page-builders.ts`: funciones puras que devuelven una página nueva.
- `src/paper/adapt-elements.ts`: qué hacer con las piezas al cambiar de tamaño.
- `src/canvas/commands/page-commands.ts`: `changePage` (un solo paso del historial y reencuadre).
- `src/ui/paper-dialog/`: diálogo "Papel"; `ui/toolbar/groups/paper-group.ts`: botón de la barra.

## Reglas

- Los tickets son de largo continuo: se reconocen por el ancho; el alto por defecto es 200 mm y se puede cambiar.
- Los márgenes nunca dejan menos de 10 mm de zona útil por eje; se recortan si el papel es menor.
- Al cambiar de tamaño las piezas se pueden **estirar** (por defecto), **escalar sin deformar y centrar** o **dejar**.
- Los márgenes son objetivos del imán, y se ven como un rectángulo discontinuo (se pueden ocultar).
- Cambiar solo los márgenes no mueve piezas ni la vista. Todo se puede deshacer.
