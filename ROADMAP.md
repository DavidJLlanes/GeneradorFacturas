# Generador de Documentos (GeneradorFacturas) — Hoja de ruta

Motor visual de documentos que funciona como una pizarra: el usuario coloca y edita cada pieza a su gusto, sube su logo, rellena sus datos y los de su cliente, y descarga el PDF. La **factura es el primer tipo de documento**; presupuestos, albaranes, recibos y otros se añaden como tipos nuevos sin tocar el núcleo. Sin registro, sin servidor de datos y sin servicios de terceros.

- Repositorio: https://github.com/DavidJLlanes/GeneradorFacturas
- Despliegue de pruebas: `/var/www/djl.com.es/factura`

## Principios

1. **Sin registro.** La identidad es el navegador o el archivo de diseño.
2. **Privacidad total.** Todo se procesa en el navegador.
3. **Sin servicios de terceros.** Ni CDN, ni Google Fonts, ni analítica externa.
4. **Todo es editable.** Colores, tipografías, encabezados, pies, rejillas, posiciones, papel…
5. **Diseño y datos separados.** El mismo diseño sirve como modelo limpio o relleno.
6. **Archivo portable.** Un diseño se exporta e importa como un único archivo.
7. **Estructura perfecta y escalable.** Una carpeta y archivos únicos por función, sin archivos que engorden sin necesidad.
8. **El núcleo está cerrado.** **Un tipo de documento nuevo nunca modifica el núcleo, solo añade su carpeta.** Ver "Arquitectura".

## Alcance

- **Incluye:** pizarra con zoom, piezas libres, estilos completos, fuentes locales, varios tamaños y proporciones de papel, varios tipos de documento, PDF limpio y relleno, exportar/importar diseños, plantilla reutilizable en el navegador, galería de plantillas por tipo y modo lote por CSV.
- **No incluye (de momento):** cuentas, sincronización en la nube, colaboración y Verifactu.
- **Aviso legal:** la versión 1 es una herramienta de diseño y PDF, no un sistema de facturación con Verifactu. Revisarlo con una gestoría antes de promocionarla como tal.

## Arquitectura

- **Tecnología:** TypeScript + Vite, sin framework de UI, con base `/factura/`.
- **Modelo:** todas las medidas en mm; el zoom es solo escala de visualización.
- **Dos vistas del mismo modelo:** pantalla y PDF vectorial con fuentes incrustadas, comparadas con pruebas.
- **Persistencia:** IndexedDB y archivos exportados, sin cookies para guardar datos.
- **Despliegue:** `git pull` manual y `location /factura/` en Nginx.

### Núcleo y tipos de documento

El **núcleo** no sabe nada de facturas, presupuestos ni albaranes. Ofrece pizarra, piezas genéricas, estilos, fuentes, papel, PDF, archivos, lote e interfaz. Los **tipos de documento** viven únicamente en `src/documents/` y se descubren solos (`import.meta.glob`), sin editar ningún registro ni archivo del núcleo.

**La regla:** un tipo nuevo solo añade su carpeta. Si un tipo necesita algo que el núcleo no ofrece, se detiene el trabajo del tipo, se amplía el núcleo en una iteración aparte y de forma genérica (nunca específica de ese tipo), y después el tipo lo usa.

### Estructura de carpetas prevista

```
src/
  core/        modelo del documento, unidades, historial (deshacer/rehacer), contrato de tipo
  canvas/      pizarra: zoom, desplazamiento, selección, guías, rejilla
  pieces/      piezas genéricas, un archivo por pieza
  styles/      colores, tipografías, bordes, rejillas de tabla, temas
  fonts/       catálogo, carga bajo demanda, fuentes propias
  paper/       tamaños y proporciones de papel
  render/      renderizador de pantalla y renderizador PDF
  storage/     IndexedDB, exportar e importar
  batch/       importación CSV y generación por lotes
  ui/          paneles, barras de herramientas, diálogos, aviso de almacenamiento
  documents/   UNA CARPETA POR TIPO (lo único que crece al añadir tipos)
    factura/
    presupuesto/
    albaran/
    recibo/
    ...
public/
  fonts/       paquete local de Google Fonts
docs/
scripts/       herramientas de construcción y comprobación
```

### Carpeta de un tipo de documento

Todo lo propio del tipo vive dentro, incluidas sus plantillas:

```
src/documents/<tipo>/
  index.ts          única entrada: exporta la definición del tipo
  definition.ts     id, nombre, papel por defecto, numeración
  schema.ts         datos del tipo (campos y variables disponibles)
  calc.ts           cálculos propios (un albarán no tiene precios)
  labels.es.ts      textos del tipo
  pieces/           piezas exclusivas del tipo, un archivo por pieza
  templates/        plantillas de partida, un archivo .ts por plantilla
```

## Formato del archivo de diseño

Un JSON versionado (`*.documento.json`) con: `formato` y `version`, **`tipoDocumento`** y su versión de esquema, `papel`, `piezas`, `estilos`, `recursos` (logo incrustado), `fuentes` y `miniatura`. Los datos (emisor, cliente, líneas) se guardan aparte y siguen el esquema del tipo.

## Fases

**Fase 0 — Base y despliegue**

- [x] Repo, TypeScript, Vite con base `/factura/`
- [x] Linter, formato y pruebas (Vitest)
- [x] README con privacidad y aviso legal
- [x] Nginx y primer despliegue en `/factura`

**Fase 1 — Lienzo (pizarra)**

- [x] Zoom y desplazamiento (rueda, táctil, atajos), con zoom al detalle
- [x] Seleccionar, mover y redimensionar; selección múltiple
- [x] Guías magnéticas, rejilla con ajuste y reglas en mm
- [x] Alinear y distribuir; capas, bloquear, ocultar, duplicar
- [x] Deshacer/rehacer ilimitado y atajos de teclado

**Fase 2 — Tamaños y proporciones de papel**

- [x] A3, A4, A5, A6, Carta, Legal
- [x] Ticket (80 y 58 mm, largo continuo), cuadrado, apaisado
- [x] Tamaño personalizado en mm y proporción libre
- [x] Orientación, márgenes y zona de seguridad
- [x] Cambiar el papel de un diseño adaptando las piezas

**Fase 3 — Motor de tipos de documento**

- [x] Contrato que debe cumplir un tipo (definición, esquema, cálculos, piezas, textos, plantillas)
- [x] Descubrimiento automático de `src/documents/*` sin registros manuales
- [x] Prueba automática que valida cada carpeta de tipo contra el contrato
- [x] Comprobación que falla si añadir un tipo modifica archivos fuera de su carpeta
- [x] Tipo de ejemplo mínimo para probar el motor
- [x] Guía "cómo añadir un tipo de documento" en `docs/`

**Fase 4 — Piezas genéricas y datos (núcleo)**

- [x] Texto, imagen/logo, formas, líneas, cabecera y pie de página, QR
- [x] Tabla de líneas y bloque de totales genéricos, configurados por el tipo
- [x] Variables (`{{cliente.nombre}}`) y edición directa sobre la página
- [x] Panel de datos generado a partir del esquema del tipo
- [x] Subida de logo (PNG, JPG, SVG) con redimensionado
- [x] Importes en céntimos para evitar errores de redondeo

**Fase 5 — Tipo Factura (primer tipo, referencia)**

- [x] Carpeta `documents/factura/` completa según el contrato
- [x] Emisor, cliente, número y fecha, notas, forma de pago/IBAN
- [x] IVA por línea (21/10/4/0 %), IRPF, recargo de equivalencia, exenciones
- [x] Series de numeración y fecha de operación
- [x] Demuestra que el núcleo aguanta sin ser modificado por el tipo

**Fase 6 — Estilos**

- [ ] Colores y paleta global
- [ ] Tipografías, tamaños, interlineado
- [ ] Bordes, esquinas, sombras, fondos
- [ ] Rejillas de tabla: cebra, líneas, cabecera de color
- [ ] Encabezados y pies repetidos
- [ ] Temas de partida con ajuste fino

**Fase 7 — Fuentes locales**

- [ ] Paquete amplio de Google Fonts alojado en tu servidor
- [ ] Subconjuntos latin y latin-ext en woff2, con licencias
- [ ] Script de construcción y carga bajo demanda
- [ ] Buscador con vista previa y fuentes propias (`.ttf`, `.woff2`)
- [ ] Incrustación en el PDF

**Fase 8 — Tabla elástica y paginación**

- [ ] La tabla crece y empuja lo de debajo
- [ ] Paginación con cabecera repetida
- [ ] Totales en la última página (o en todas)

**Fase 9 — PDF**

- [ ] Vectorial, con texto seleccionable
- [ ] Modelo limpio y documento relleno
- [ ] Todos los papeles y orientaciones
- [ ] Pruebas de comparación pantalla/PDF

**Fase 10 — Archivo de diseño y persistencia**

- [ ] Exportar e importar diseño con su `tipoDocumento`; datos por separado
- [ ] Plantilla en IndexedDB que se reabre al entrar
- [ ] Aviso informativo de almacenamiento local
- [ ] Autoguardado, varias plantillas con miniaturas
- [ ] Borrar todo con un clic y migración entre versiones

**Fase 11 — Tipos: presupuesto, albarán, recibo**

- [ ] `documents/presupuesto/` (validez de la oferta y aceptación)
- [ ] `documents/albaran/` (cantidades sin precios, espacio de firma)
- [ ] `documents/recibo/` (importe, concepto y forma de pago)
- [ ] Cada tipo solo añade su carpeta; el núcleo no se modifica

**Fase 12 — Más tipos**

- [ ] Rectificativa y abono, pedido/orden de compra
- [ ] Parte de trabajo, ticket y vale, carta de reclamación
- [ ] Hoja de encargo, etiquetas y tarjetas
- [ ] Un tipo por carpeta, en cualquier orden

**Fase 13 — Galería de plantillas**

- [ ] Plantillas de cada tipo dentro de su propia carpeta
- [ ] Galería con miniaturas, filtrable por tipo
- [ ] Guía para aportar plantillas o tipos mediante pull request
- [ ] Modo aleatorio: botón con selector de tipo que genera un diseño completo (plantilla + tema + variaciones de estilo + datos ficticios) para no empezar de cero; el motor es genérico y cada tipo aporta solo su generador de datos de ejemplo

**Fase 14 — Modo lote**

- [ ] Importar CSV; las columnas dependen del esquema del tipo elegido
- [ ] Asignar columnas a variables
- [ ] Generar todos los PDF en un ZIP, con progreso y errores por fila

**Fase 15 — Extras**

- [ ] Idiomas y monedas
- [ ] PWA sin conexión
- [ ] Móvil y tableta
- [ ] Accesibilidad

**Versión 2:** estudiar Verifactu (numeración inalterable, huella, QR oficial) y la factura electrónica entre empresas, como ampliación del tipo factura.

## Decisiones abiertas

- Nombre definitivo del proyecto y de la carpeta pública (`/factura`); si el repo se renombra o se mantiene.
- Cuántas familias de Google Fonts y con qué pesos.
- PDF con librería propia o con impresión del navegador (prueba de concepto en la Fase 9).
- Alcance en móvil: edición completa o modo reducido.
- Licencia del repositorio.
