# Fuentes

Todas las fuentes se sirven desde nuestro propio servidor (`/factura/fonts/`): ninguna petición va a
Google ni a terceros.

## Catálogo

`src/fonts/catalog.json` lista las familias (hoy 31: sin serifa, con serifa, monoespaciadas, de titulares
y manuscritas), todas con licencia **OFL 1.1**. Cada una trae pesos 400 y 700, con cursiva cuando la
familia la tiene. Solo se incluyen los subconjuntos **latin** y **latin-ext** en woff2, que cubren español,
catalán, gallego, euskera, portugués, francés, alemán, italiano y el símbolo del euro.

## De dónde salen los archivos

Los archivos vienen de los paquetes `@fontsource/<id>` (dependencias de desarrollo). El script
`scripts/build-fonts.mjs` los copia, con su `LICENSE`, a `public/fonts/<id>/` (carpeta generada, fuera de
git) y falla si falta alguno. Se ejecuta solo antes de `npm run dev` y `npm run build`, así que el despliegue
no necesita nada más que `npm ci`. Hoy ocupan unos 4,3 MB en total.

**Añadir una fuente:** `npm i -D @fontsource/<id>`, añadir su entrada a `catalog.json` (comprueba qué
estilos trae el paquete en `node_modules/@fontsource/<id>/files/`) y ya aparece en el buscador.

## Carga bajo demanda

`ensureFont(id)` declara las reglas `@font-face` de una familia la primera vez que se usa. El navegador solo
descarga el archivo de un estilo y subconjunto cuando un texto lo necesita: un documento con Inter descarga
dos archivos (400 y 700 en latin), no las 31 familias.

## En las piezas

Las piezas con texto (texto, cabecera, pie, tabla y totales) tienen la propiedad **Fuente**. Vacía significa
la fuente del sistema. El campo del panel abre un **buscador con vista previa**: cada fuente se escribe en
sí misma y se carga solo cuando su fila entra en pantalla. Las plantillas de un tipo eligen su fuente
(Factura: clásica con Inter, moderna con Montserrat).

## Límites actuales

- Pesos 400 y 700 (la pieza solo tiene "negrita" sí/no).
- Fuentes propias (`.ttf`, `.woff2`) llegan con el archivo de diseño (fase 10), porque deben viajar dentro.
- La incrustación en el PDF llega con el PDF (fase 9).
