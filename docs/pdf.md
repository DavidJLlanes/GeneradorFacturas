# Exportar a PDF

El PDF se genera con el motor de impresión del navegador: es **vectorial** (el texto se puede seleccionar), lleva las fuentes incrustadas y es idéntico a lo que se ve en pantalla.

## Uso

Botón **PDF** de la barra → elegir contenido → «Abrir impresión» → destino «Guardar como PDF», márgenes «Ninguno» y sin encabezados ni pies. Ctrl+P también funciona.

- **Documento relleno**: con los datos y la paginación automática (varias páginas si hace falta).
- **Modelo limpio**: una sola página, sin datos y sin variables, para rellenar a mano.

## Cómo funciona

- `src/pdf/build-print-root.ts`: `planPrint` decide páginas y datos; `buildPrintRoot` crea un `div.pdf-root` con una `.pdf-page` por hoja y `@page { size; margin: 0 }` con el tamaño del papel.
- `src/pdf/print-document.ts`: espera a fuentes e imágenes, llama a `window.print()` y retira el documento en `afterprint`. Con Ctrl+P lo prepara en `beforeprint`.
- `src/pdf/print.css`: fuera de pantalla salvo al imprimir; oculta el resto de la aplicación.
- Las variables `{{pagina}}` y `{{paginas}}` (`src/data/page-variables.ts`) valen también en la vista «Con datos».
- Las variables sin dato salen vacías: el PDF nunca muestra `{{campo}}`.

## Límites

Descarga directa sin diálogo (pdf-lib) queda como mejora opcional posterior.
