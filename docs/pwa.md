# Uso sin conexión (PWA)

La aplicación se puede instalar (menú del navegador → «Instalar») y funciona sin internet. Todo lo que hace ya ocurría en el navegador; esto solo guarda sus archivos.

## Cómo funciona

- `public/manifest.webmanifest` e `public/icons/`: nombre, colores e iconos de la aplicación instalada.
- `src/pwa/pwa-plugin.ts`: plugin de Vite que, al construir, escribe `dist/sw.js` con la lista exacta de archivos de esa versión (`src/pwa/service-worker-source.ts`).
- `src/pwa/register.ts`: registra el service worker, solo en la versión publicada.

## Qué se guarda

- **Núcleo** (página, código, estilos, iconos, el motor de PDF del modo lote): todo, al instalar.
- **Fuentes**: las que se usan. Las de la pantalla inicial se guardan en la primera visita; las demás, la primera vez que se eligen. Sin conexión solo están las que se hayan usado antes.
- **Datos del usuario**: siguen en el almacenamiento local del navegador (ver `docs/archivos.md`).

## Actualizaciones

La página se pide primero a la red, así que una versión nueva se ve en cuanto se publica; sin conexión se usa la copia. Cada versión tiene su propia caché y la anterior se borra al activarse la nueva.

## Probar

`npm run build && npx vite preview`, abrir la aplicación una vez, y poner el navegador sin conexión (DevTools → Network → Offline) antes de recargar.
