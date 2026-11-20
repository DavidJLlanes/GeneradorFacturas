# Móvil y tableta

El editor completo funciona con el dedo. La entrada ya usaba eventos de puntero (mover, redimensionar, pellizcar para zoom y arrastrar con dos dedos); este bloque adapta la interfaz.

- **Doble toque** sobre un texto lo edita en la página (`src/ui/touch/double-tap.ts`), porque los navegadores táctiles no envían `dblclick` sobre la zona con `touch-action: none`.
- **Controles con tamaño de dedo** (≥ 44 px) y campos a 16 px para que iOS no haga zoom, solo en pantallas táctiles (`pointer: coarse`). Tiradores de selección más grandes.
- **Panel lateral plegable** en pantallas de hasta 720 px: empieza cerrado y se abre tocando la pestaña (Diseño/Datos); tocar la activa lo cierra.
- **Zonas seguras** (muesca, barra inferior) con `viewport-fit=cover` y `env(safe-area-inset-*)`; altura con `dvh`.
- Sin selección de texto ni menú contextual táctil sobre la página; sin rebote de desplazamiento.
- Tableta: mismo diseño que escritorio, con los controles ampliados.

Estilos en `src/ui/touch/touch.css`. Probado con emulación táctil de Chrome (390×844, 820×1180, 1180×820); no probado en dispositivos reales ni en Safari.
