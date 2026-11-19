# Archivos, fuentes propias y almacenamiento local

Todo ocurre en el navegador: no hay servidor ni cuenta. Botón **Archivo** de la barra.

## Archivo de diseño (`.diseno.json`)

- Contiene el documento (papel, elementos, paleta), el `tipoDocumento` y las **fuentes propias** que usa, incrustadas en base64. **Nunca lleva datos.**
- «Abrir diseño» lo carga como un paso del historial (se puede deshacer). Si es de otro tipo de documento, se deja como sesión de ese tipo y la página se recarga en él.
- Código: `src/storage/design-file/` (`format`, `build-design`, `parse-design`, `validate-document`, `apply-design`, `migrate`).

## Archivo de datos (`.datos.json`)

Lo rellenado (cliente, líneas…), aparte del diseño y con su `tipoDocumento`. Solo se abre en el mismo tipo. Código: `src/storage/data-file/`.

## Fuentes propias

`.ttf`, `.otf`, `.woff` y `.woff2` (máximo 1,5 MB), desde el buscador de fuentes → «Mis fuentes» → «Añadir fuente propia…». Se reconocen por su contenido, no por la extensión. Su id es `custom:<huella>`: el mismo archivo da siempre el mismo id. Un archivo sirve para todos los pesos. Código: `src/fonts/custom/`.

## Almacenamiento local

- IndexedDB (`generador-documentos`), con respaldo en memoria si el navegador no la permite. Código: `src/storage/local/`.
- **Autoguardado** de diseño y datos ~0,8 s después de cada cambio (los cambios de selección o zoom no cuentan) y al cerrar la pestaña. Al entrar se reabre la sesión; `#plantilla=…` en la dirección tiene prioridad.
- **Mis plantillas**: el diseño actual (con datos) guardado con nombre y miniatura esquemática. Debajo, las plantillas de partida del tipo.
- **Aviso** de que todo queda solo en este navegador, con el espacio usado y petición de almacenamiento persistente.
- **Borrar todo** (dos pulsaciones) vacía el almacén y recarga.

## Migración entre versiones

Cada archivo y cada registro lleva `version`. `migrateTo` aplica en orden las migraciones `n → n+1` registradas en `src/storage/design-file/migrate.ts`. Un archivo de una versión más nueva se rechaza con un aviso; uno dañado, con un mensaje claro. Al cambiar el formato: subir la versión y añadir su migración.
