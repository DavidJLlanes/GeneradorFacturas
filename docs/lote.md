# Modo lote

Genera muchos documentos de un mismo tipo a partir de un CSV: un PDF por documento, todos en un ZIP. Todo ocurre en el navegador; no se sube nada.

Se abre con el botón **Lote** (grupo «Exportar»).

## Flujo

1. **CSV de ejemplo**: descarga las cabeceras del tipo abierto con una fila de muestra.
2. **Elegir archivo CSV**: acepta `;`, `,` o tabulador, comillas dobles y saltos de línea dentro de una celda.
3. **Asignar columnas**: cada campo del tipo (y cada columna de su tabla de líneas) se asigna a una columna del CSV. Se rellena solo si la cabecera se llama igual que el campo, sin acentos ni mayúsculas. Los campos repetidos (nombre del emisor y del cliente) se distinguen por su grupo: «Cliente: NIF».
4. **Agrupar filas por** (opcional): filas consecutivas con el mismo valor forman un solo documento y cada fila aporta una línea a la tabla (una factura con varias líneas). Sin agrupar, cada fila es un documento.
5. **Nombrar cada PDF con**: la posición (`001`, `002`…) y, si se elige, un dato (por ejemplo el número).
6. **Generar ZIP**: con barra de progreso y botón de cancelar. Los documentos con errores se omiten y quedan en `errores.txt` dentro del ZIP.

Los campos sin columna asignada se toman de los datos que haya en el editor (por ejemplo los del emisor). Los obligatorios que no estén ni en el CSV ni en el editor dan error en esa fila.

## Formatos de celda

- Fechas: `DD/MM/AAAA`, `DD-MM-AAAA`, `DD.MM.AAAA` o `AAAA-MM-DD`.
- Importes: `1.234,56`, `1234.5`, `12 €`.
- Números: `1.234,5`.
- Opciones: el valor o su texto, sin distinguir mayúsculas.
- Casillas: `sí`, `x`, `1`, `true`.
- Imágenes: no se importan por CSV; se usa la del editor.

## Estructura

- `src/batch/csv/`: lectura y escritura de CSV.
- `src/batch/targets/`: destinos sacados del esquema, asignación automática y CSV de ejemplo.
- `src/batch/convert/`: valor de celda a tipo de dato y filas a documentos.
- `src/batch/zip/`: escritor de ZIP propio (deflate con `CompressionStream` si existe).
- `src/batch/run/`: bucle de generación, nombres y cancelación.
- `src/pdf-file/`: motor PDF (ver `docs/pdf.md`).
- `src/ui/batch-dialog/`: diálogo.

Ningún tipo de documento contiene código del lote: todo sale del esquema.
