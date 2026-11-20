# Reglas permanentes del proyecto

Estas reglas son de máxima importancia y se aplican en **cada iteración**, sin excepción.

## Estructura de archivos

1. **Estructura de archivos perfecta.** Cada archivo está donde le corresponde por su responsabilidad.
2. **No engordar archivos sin necesidad.** Si un archivo crece más allá de su función, se divide.
3. **Una carpeta y archivos únicos por función** (o por funciones muy similares). Una responsabilidad por archivo, con nombres claros. Sin archivos "cajón de sastre" ni monolitos.
4. **Estructura totalmente escalable.** Una función nueva se añade en su propia carpeta con sus propios archivos nuevos, sin tocar ni inflar lo existente.

## Tipos de documento: el núcleo es intocable

**Un tipo de documento nuevo nunca modifica el núcleo, solo añade su carpeta.**

- El proyecto es un motor de documentos. La factura es el primer tipo; presupuesto, albarán, recibo y demás se añaden después.
- Cada tipo vive únicamente en `src/documents/<tipo>/` con todo lo suyo: definición, esquema de datos, cálculos, textos, piezas exclusivas y plantillas. Se descubre solo; no se edita ningún registro ni archivo del núcleo.
- El núcleo (`core`, `canvas`, `pieces`, `styles`, `fonts`, `paper`, `render`, `storage`, `batch`, `ui`) no contiene nada específico de un tipo: ni nombres, ni condiciones por tipo, ni cálculos de un tipo.
- Si un tipo necesita algo que el núcleo no ofrece: parar, ampliar el núcleo **en una iteración aparte y de forma genérica** (nuevo archivo en su propia carpeta), y después usarlo desde el tipo. Nunca mezclar ambos cambios.
- Al terminar de añadir un tipo, comprobar que el diff solo toca `src/documents/<tipo>/`.

## Cómo aplicarlas

- Antes de crear o modificar código, decidir en qué carpeta y archivo vive cada pieza y si hace falta uno nuevo.
- Revisar al final de cada iteración que ningún archivo haya crecido de forma innecesaria.
- La estructura prevista está en `ROADMAP.md` (sección "Estructura de carpetas prevista").

## README principal

- El `README.md` es la portada de GitHub: detallado, con etiquetas (badges) de tecnologías.
- **Se actualiza en cada cambio relevante** (función nueva, tipo de documento, tecnología, comando, estructura de carpetas, cifras como tests o tipos), en el mismo commit que el cambio.
