# Generador de Documentos

Motor visual de documentos tipo pizarra: el usuario diseña su propia factura (y más adelante
presupuestos, albaranes, recibos…), sube su logo, rellena sus datos y descarga el PDF.

- **Sin registro.**
- **Privacidad total:** todo ocurre en el navegador; ningún dato sale del dispositivo.
- **Sin servicios de terceros:** ni CDN ni Google Fonts; las fuentes se sirven en local.

> Estado: en construcción. Consulta la [hoja de ruta](ROADMAP.md).

## Aviso legal

Esta herramienta sirve para diseñar documentos y generar PDF. No es un sistema informático de
facturación con Verifactu ni conserva registros inalterables. Revisa los requisitos aplicables
con tu gestoría.

## Desarrollo

Requiere Node.js 22.13 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run check      # formato, lint, pruebas y build
```

Otros comandos: `npm test`, `npm run lint`, `npm run format`, `npm run build`, `npm run preview`.

## Estructura

```
src/
  core/        núcleo sin interfaz: geometría, unidades, documento y operaciones, historial, store
  canvas/      lienzo: editor, comandos, gestos, atajos, selección, imán, alinear, vista (ver docs/lienzo.md)
  ui/          interfaz: barra de herramientas, panel de capas, diálogos de papel y colores, estilos base
  app/         arranque: elige el tipo y la plantilla y crea el editor
  paper/       papeles: catálogo de tamaños, orientación, márgenes, adaptación de piezas (ver docs/papel.md)
  layout/      reparto del documento en páginas: tabla elástica, partida por filas, piezas repetidas (ver docs/paginas.md)
  pieces/      piezas genéricas, una carpeta por pieza (ver docs/piezas.md)
  styles/      paleta del documento, colores enlazados y temas (ver docs/estilos.md)
  fonts/       catálogo de fuentes locales y carga bajo demanda (ver docs/fuentes.md)
  data/        importes en céntimos, variables y formato de datos
  images/      reglas y lectura de imágenes subidas
  documents/   un tipo de documento por carpeta; se descubren solos (ver docs/anadir-tipo.md) (hoy: factura; ejemplo es interno)
  main.ts      punto de entrada
docs/          documentación (despliegue, lienzo, papel, piezas, estilos, fuentes, páginas, tipos)
scripts/       herramientas de construcción y despliegue
```

La estructura completa prevista y las reglas del proyecto están en [ROADMAP.md](ROADMAP.md) y
[CLAUDE.md](CLAUDE.md). Resumen: una carpeta y archivos únicos por función, y **un tipo de
documento nuevo nunca modifica el núcleo, solo añade su carpeta**.

## Despliegue

Ver [docs/despliegue.md](docs/despliegue.md).
