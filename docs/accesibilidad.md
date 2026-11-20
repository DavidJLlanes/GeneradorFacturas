# Accesibilidad

## Qué cubre

- **Zonas de la página**: cabecera con el título (h1 oculto) y la barra de herramientas, zona principal con el documento, panel lateral. Enlace «Saltar al documento» al primer Tab.
- **Nombres de los botones**: los que tienen texto se nombran por su texto (así coincide lo que se ve con lo que se dice por voz); los de un solo símbolo (↶, ↷, +), por su descripción; los de cifras («100 %»), por «cifra: descripción».
- **Capas con teclado**: cada capa tiene un botón con su nombre. Tab hasta la capa y Enter o Espacio para elegirla; Mayús o Ctrl para añadir a la selección. Con una pieza elegida, las flechas la mueven y el resto de atajos funcionan igual que con el ratón.
- **Espacio sobre un botón** lo pulsa; solo fuera de botones activa la mano de desplazar.
- **Avisos para lectores de pantalla** (región `role="status"`): qué pieza queda elegida, cambio entre plantilla y datos, y página mostrada.
- **Foco visible** en todos los controles (`:focus-visible`), **movimiento reducido** (`prefers-reduced-motion`) y modo oscuro/claro del sistema.
- Los diálogos son `<dialog>` modales: el foco queda dentro y Escape los cierra.

## Cómo se comprueba

Se pasó axe-core (WCAG 2.x A y AA) en Chrome sobre el editor, cada diálogo, con datos, con una pieza elegida, en modo oscuro y en la pestaña Datos: sin incidencias. `src/ui/accessibility.test.ts` protege las zonas, los nombres de los botones y el teclado en las capas.

## Pendiente

- El mover y cambiar de tamaño piezas con el ratón no tiene equivalente por teclado más allá de las flechas (mover) y las propiedades numéricas del panel (posición y tamaño).
- No se ha probado con lectores de pantalla reales (NVDA, VoiceOver); solo con auditoría automática.
