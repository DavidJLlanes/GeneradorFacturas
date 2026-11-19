# Tipo Factura

Vive entero en `src/documents/factura/`. Es el tipo de referencia para crear los demás.

## Datos

- **Factura:** serie, número, número completo (calculado, `A/0007`), fecha de expedición, fecha de la operación, vencimiento.
- **Emisor y cliente:** nombre o razón social, NIF, domicilio, email, teléfono (y logo del emisor).
- **Líneas:** concepto, cantidad, precio, descuento %, IVA (21, 10, 4, 0 % o exenta) e importe calculado.
- **Impuestos:** retención de IRPF (%), recargo de equivalencia (sí/no), mención de exención.
- **Pago:** forma de pago, IBAN, notas.

## Cálculos (`calc.ts`, todo en céntimos)

- Importe de línea = cantidad × precio − descuento.
- El IVA se calcula por tipo sobre la suma de bases de ese tipo; con recargo de equivalencia se añade el 5,2 / 1,4 / 0,5 % correspondiente (21 / 10 / 4 %).
- IRPF = porcentaje sobre la base imponible total, y se resta del total.
- Las líneas exentas no llevan IVA y añaden la mención de exención (la escrita o "Operación exenta de IVA.").
- Los tipos que no se usan no generan valores, y con "Con datos" sus filas desaparecen de los totales.

## Plantillas

`clasica` (la de arranque) y `moderna` (banda de color). Se abren con `#plantilla=moderna`.
Comparten las piezas de `templates/parts.ts`.

**Varias páginas:** con muchas líneas la tabla crece y se parte repitiendo su cabecera; los totales salen
en la última página. El pie y el número de factura se repiten en todas (la Moderna repite además la banda y
el título). Ver `docs/paginas.md`.

## Límites actuales

- No es un sistema de facturación: no impide saltar números ni garantiza inalterabilidad (Verifactu es de la versión 2). Consulta con tu gestoría antes de usar facturas generadas aquí.
- La serie es un texto libre y el número lo escribe la persona; no hay contador automático.
- La mención `{{menciones}}` se ve tal cual con la vista "Con datos" cuando no hay exenciones; el PDF final (fase 9) dejará esas variables vacías.
- No hay selector de plantillas en pantalla todavía (galería en la fase 13).
