# Reglas permanentes del proyecto

Estas reglas son de máxima importancia y se aplican en **cada iteración**, sin excepción.

## Estructura de archivos

1. **Estructura de archivos perfecta.** Cada archivo está donde le corresponde por su responsabilidad.
2. **No engordar archivos sin necesidad.** Si un archivo crece más allá de su función, se divide.
3. **Una carpeta y archivos únicos por función** (o por funciones muy similares). Una responsabilidad por archivo, con nombres claros. Sin archivos "cajón de sastre" ni monolitos.
4. **Estructura totalmente escalable.** Una función nueva se añade en su propia carpeta con sus propios archivos nuevos, sin tocar ni inflar lo existente.

## Cómo aplicarlas

- Antes de crear o modificar código, decidir en qué carpeta y archivo vive cada pieza y si hace falta uno nuevo.
- Revisar al final de cada iteración que ningún archivo haya crecido de forma innecesaria.
- La estructura prevista está en `ROADMAP.md` (sección "Estructura de carpetas prevista").
