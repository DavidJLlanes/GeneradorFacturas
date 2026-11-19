# Generador de Facturas — Hoja de ruta

Diseñador visual de facturas que funciona como una pizarra: el usuario coloca y edita cada pieza a su gusto, sube su logo, rellena sus datos y los de su cliente, y descarga el PDF. Sin registro, sin servidor de datos y sin servicios de terceros.

- Repositorio: https://github.com/DavidJLlanes/GeneradorFacturas
- Despliegue de pruebas: `/var/www/djl.com.es/factura` (djl.com.es/factura)

## Principios

1. **Sin registro.** Nadie crea cuenta. La identidad es el propio navegador o el archivo de diseño.
2. **Privacidad total.** Todo se procesa en el navegador. Ningún dato, logo ni factura sale del dispositivo.
3. **Sin servicios de terceros.** Ni CDN, ni Google Fonts, ni analítica externa. Todo se sirve desde el propio dominio.
4. **Todo es editable.** Colores, tipografías, encabezados, pies, rejillas, posiciones, tamaños, papel… nada queda fijo.
5. **Diseño y datos separados.** El mismo diseño sirve como modelo limpio o relleno con una factura real.
6. **Archivo portable.** Un diseño se exporta e importa como un único archivo y funciona en cualquier dispositivo.
7. **Código ordenado.** Archivos y carpetas pequeños con una sola responsabilidad, sin monolitos.

## Alcance

**Incluye:** editor tipo pizarra con zoom, piezas libres, estilos completos, paquete local de fuentes, varios tamaños y proporciones de papel, PDF limpio y relleno, exportar/importar diseños, plantilla reutilizable guardada en el navegador, galería de plantillas, modo lote por CSV.

**No incluye (de momento):** cuentas, sincronización en la nube, colaboración, sistema de facturación con Verifactu.

> **Aviso legal.** La versión 1 es una herramienta de diseño y generación de PDF. No es un sistema informático de facturación con Verifactu ni conserva registros inalterables. Revisar los requisitos aplicables con una gestoría antes de promocionarla como herramienta de facturación.

## Arquitectura

- **Tecnología:** TypeScript + Vite, sin framework de UI. Genera archivos estáticos con base `/factura/`.
- **Modelo del documento:** todas las medidas en milímetros. Cada pieza tiene posición, tamaño, estilo y contenido. El zoom es solo una escala de visualización.
- **Dos vistas del mismo modelo:** pantalla (editor) y PDF (vectorial, con fuentes incrustadas). Una batería de pruebas compara ambas para garantizar que lo que se ve es lo que se descarga.
- **Persistencia:** IndexedDB (diseños, logos, preferencias) y archivos exportados. No se usan cookies para guardar datos.
- **Despliegue:** `git pull` manual en `/var/www/djl.com.es/factura` (sin GitHub Actions) y `location /factura/` en Nginx.

### Estructura de carpetas prevista

```
src/
  core/        modelo del documento, unidades, historial (deshacer/rehacer)
  canvas/      pizarra: zoom, desplazamiento, selección, guías, rejilla
  pieces/      un archivo por tipo de pieza
  styles/      colores, tipografías, bordes, rejillas de tabla, temas
  fonts/       catálogo, carga bajo demanda, fuentes propias
  paper/       tamaños y proporciones de papel
  data/        variables, emisor, cliente, líneas, cálculos de impuestos
  render/      renderizador de pantalla y renderizador PDF
  storage/     IndexedDB, exportar e importar
  batch/       importación CSV y generación por lotes
  ui/          paneles, barras de herramientas, diálogos, aviso de almacenamiento
public/
  fonts/       paquete local de Google Fonts
  templates/   galería de plantillas de partida
docs/
```

## Formato del archivo de diseño

Un único archivo JSON versionado (por ejemplo `*.factura.json`):

- `formato` y `version` para poder migrar diseños antiguos.
- `papel`: tamaño, orientación y márgenes.
- `piezas`: lista con tipo, posición, tamaño, capa, bloqueo, estilo y contenido o variable.
- `estilos`: paleta y tipografías globales.
- `recursos`: logo e imágenes incrustados (redimensionados y comprimidos al subirlos).
- `fuentes`: familias usadas, con referencia al paquete local o incrustadas si son propias.
- `miniatura`: vista previa pequeña.

Los **datos** (emisor, cliente, líneas) se guardan aparte, para poder reutilizar un diseño con muchas facturas.

---

## Fases

### Fase 0 — Base y despliegue
- [ ] Estructura del repositorio, TypeScript, Vite con base `/factura/`
- [ ] Linter, formato y pruebas (Vitest)
- [ ] README con descripción, privacidad y aviso legal
- [ ] Configuración de Nginx y primer despliegue de prueba en `/factura`
- [ ] Documentar el flujo de despliegue manual

### Fase 1 — Lienzo (pizarra)
- [ ] Página con zoom y desplazamiento (rueda, gestos táctiles, atajos)
- [ ] Zoom hasta el detalle para editar zonas pequeñas
- [ ] Seleccionar, mover y redimensionar piezas; selección múltiple
- [ ] Guías magnéticas, rejilla con ajuste y reglas en mm
- [ ] Alinear y distribuir
- [ ] Capas (orden), bloquear, ocultar y duplicar
- [ ] Deshacer y rehacer ilimitado
- [ ] Atajos de teclado

### Fase 2 — Tamaños y proporciones de papel
- [ ] Tamaños estándar: A3, A4, A5, A6, Carta, Legal
- [ ] Formatos especiales: ticket (80 mm y 58 mm de ancho, largo continuo), cuadrado, apaisado
- [ ] Tamaño personalizado en mm y proporción libre
- [ ] Orientación vertical y horizontal
- [ ] Márgenes y zona de seguridad de impresión
- [ ] Cambiar el papel de un diseño existente adaptando las piezas

### Fase 3 — Piezas y datos
- [ ] Piezas: texto, imagen/logo, rectángulo, línea, forma, cabecera de página, pie de página
- [ ] Piezas de factura: datos del emisor, datos del cliente, número y fecha, tabla de líneas, totales, notas, forma de pago/IBAN, QR
- [ ] Variables (`{{cliente.nombre}}`) para vincular piezas con los datos
- [ ] Edición de textos directamente sobre la página
- [ ] Panel de datos: emisor, cliente, líneas
- [ ] Subida de logo con redimensionado y compresión (PNG, JPG, SVG)
- [ ] Cálculos: IVA por línea (21/10/4/0 %), IRPF, recargo de equivalencia, exenciones, rectificativas
- [ ] Numeración por series y fecha de operación
- [ ] Importes en céntimos para evitar errores de redondeo

### Fase 4 — Estilos
- [ ] Colores de texto, fondo, bordes y acentos con selector y paleta global
- [ ] Tipografías, tamaños, grosor, interlineado y espaciado
- [ ] Bordes, esquinas, sombras y fondos
- [ ] Rejillas de tabla: filas cebra, líneas, cabecera de color, sin bordes
- [ ] Encabezados y pies repetidos en cada página
- [ ] Temas de partida combinables con ajuste fino

### Fase 5 — Fuentes locales
- [ ] Paquete amplio de Google Fonts alojado en el propio servidor (sin llamadas a Google)
- [ ] Catálogo curado, subconjuntos latin y latin-ext, formato woff2
- [ ] Script de construcción que descarga y empaqueta las fuentes con su licencia
- [ ] Carga bajo demanda: solo se descarga la fuente que se usa
- [ ] Buscador y vista previa de fuentes en el editor
- [ ] Subida de fuentes propias (`.ttf`, `.woff2`)
- [ ] Incrustación de las fuentes en el PDF
- [ ] Revisar la licencia de cada familia incluida (la mayoría son OFL)

### Fase 6 — Tabla elástica y paginación
- [ ] La tabla de líneas crece con el contenido y empuja las piezas inferiores
- [ ] Paginación automática con cabecera de tabla repetida
- [ ] Totales y pies en la última página (o en todas, a elección)
- [ ] Textos largos con salto de línea y alturas de fila variables

### Fase 7 — PDF
- [ ] PDF vectorial con texto seleccionable
- [ ] Descarga del **modelo limpio** (sin datos)
- [ ] Descarga de la **factura rellena** con datos reales
- [ ] Todos los tamaños de papel y orientaciones
- [ ] Pruebas de comparación visual entre pantalla y PDF
- [ ] Símbolo € y caracteres especiales verificados

### Fase 8 — Archivo de diseño y persistencia
- [ ] Exportar e importar el diseño como archivo
- [ ] Guardar la plantilla en IndexedDB y reabrirla al entrar en la web
- [ ] Aviso informativo claro sobre el almacenamiento local
- [ ] Autoguardado y recuperación tras cierre inesperado
- [ ] Varias plantillas guardadas con miniaturas
- [ ] Exportar e importar los datos por separado
- [ ] Borrar todos los datos locales con un clic
- [ ] Migración entre versiones del formato

### Fase 9 — Galería de plantillas
- [ ] Plantillas de partida incluidas en el repositorio (`public/templates/`)
- [ ] Galería con miniaturas para empezar desde un diseño
- [ ] Guía para aportar plantillas mediante pull request

### Fase 10 — Modo lote
- [ ] Importar un CSV de clientes o facturas
- [ ] Asignar columnas a variables
- [ ] Generar todas las facturas en PDF y descargarlas en un ZIP
- [ ] Barra de progreso y manejo de errores por fila

### Fase 11 — Extras
- [ ] Otros documentos: presupuestos, albaranes y recibos con el mismo editor
- [ ] Varios idiomas y monedas, con formato de números
- [ ] PWA para uso sin conexión
- [ ] Edición cómoda en móvil y tableta (o modo reducido: rellenar y descargar)
- [ ] Accesibilidad y navegación por teclado
- [ ] Autoguardado visible y atajos documentados

## Versión 2 (futuro)

- [ ] Estudiar Verifactu: numeración inalterable, huella y código QR oficial
- [ ] Valorar factura electrónica entre empresas según el calendario vigente

## Decisiones abiertas

- Nombre definitivo del proyecto y de la carpeta pública (`/factura`).
- Cuántas familias de Google Fonts incluir y con qué pesos (peso total del paquete).
- Si el renderizado a PDF se hace con una librería propia sobre el modelo o con impresión del navegador (se decidirá con una prueba de concepto en la Fase 7).
- Alcance en móvil: edición completa o modo reducido.
- Licencia del repositorio.
