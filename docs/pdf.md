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

- La impresión del navegador es lo único que ofrece el botón «PDF». El PDF sin diálogo existe como motor (`src/pdf-file/`) y se usa en el modo lote (ver `docs/lote.md`).
- El motor propio dibuja el texto como contornos de glifos (idéntico a pantalla con cualquier fuente, también las propias) y añade encima texto invisible para poder seleccionarlo y buscarlo. No incrusta las fuentes: el recorte de fuentes de `@pdf-lib/fontkit` falla con muchas fuentes con acentos.
- Sombras: aproximadas con capas translúcidas. Subrayados, espaciado entre letras y rotaciones no se dibujan (el editor no los ofrece).
