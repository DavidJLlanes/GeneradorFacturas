# Tipos de documento incluidos

Cada tipo vive solo en `src/documents/<tipo>/` (ver `docs/anadir-tipo.md`). Se abren con `#tipo=<id>` en la dirección.

| Tipo                 | Id              | Papel       | Numeración | Qué aporta                                                                             |
| -------------------- | --------------- | ----------- | ---------- | -------------------------------------------------------------------------------------- |
| Factura              | `factura`       | A4          | `0007`     | IVA por línea, IRPF, recargo de equivalencia, exenciones y series (`docs/factura.md`)  |
| Presupuesto          | `presupuesto`   | A4          | `P-0012`   | Líneas con IVA, «válido hasta» calculado, condiciones y recuadro de aceptación         |
| Albarán              | `albaran`       | A4          | `AL-0031`  | Cantidades sin precios, total de unidades, dirección de entrega y doble firma          |
| Recibo               | `recibo`        | A5 apaisado | `R-0045`   | Importe en cifras y en letra (hasta 999.999.999,99 €), concepto, forma de pago, firma  |
| Rectificativa        | `rectificativa` | A4          | `RE-0002`  | Referencia a la factura corregida, motivo e importes con signo (abonos)                |
| Pedido               | `pedido`        | A4          | `PC-0018`  | Proveedor, lugar y fecha de entrega, líneas con IVA, condiciones y autorización        |
| Parte de trabajo     | `parte`         | A4          | `PT-0064`  | Horas de inicio y fin con duración calculada, materiales y firmas de técnico y cliente |
| Ticket               | `ticket`        | 80 mm       | `T000042`  | Total con IVA incluido y su cuota, forma de pago y mensaje final                       |
| Vale                 | `vale`          | A6 apaisado | `V-0009`   | Importe destacado, código con QR, beneficiario y validez                               |
| Carta de reclamación | `carta`         | A4          | —          | Remitente, destinatario, asunto, texto, plazo de respuesta y fecha límite calculada    |
| Hoja de encargo      | `encargo`       | A4          | `HE-0005`  | Objeto y alcance, honorarios, provisión de fondos, pendiente y firma de ambas partes   |
| Etiqueta             | `etiqueta`      | 100 × 60 mm | —          | Producto, referencia, lote, precio destacado y QR                                      |
| Tarjeta de visita    | `tarjeta`       | 85 × 55 mm  | —          | Logo, nombre, cargo, empresa y contacto                                                |

## Detalles

- **Presupuesto**: `validezDias` + `fecha` dan `validoHasta` (campo calculado). El IVA se agrupa por tipo (21, 10, 4, 0 %) y solo salen las filas de los tipos usados.
- **Albarán**: no tiene ningún campo de dinero. `totalUnidades` suma las cantidades sin errores de coma flotante.
- **Recibo**: `src/documents/recibo/letras.ts` escribe el importe en letra con apócopes («un euro», «veintiún mil euros», «un millón de euros»). Sin importe no escribe nada.
- Todos comparten la numeración con serie opcional y el pie «Página X de N», y usan el kit genérico del núcleo `src/core/template-kit/` para construir sus plantillas.

## Fase 12

- Los nueve tipos de la fase 12 usan los bloques genéricos `src/core/template-kit/blocks.ts` (cabecera, partes, tabla, totales, firma, pie).
- **Rectificativa**: los importes pueden ser negativos; el IVA se agrupa por tipo igual que en el presupuesto.
- **Parte**: `duracion` se calcula con las horas `HH:MM` y entiende que el trabajo pasó de medianoche si la hora de fin es anterior.
- **Ticket**: los precios ya llevan IVA; `ivaIncluido` extrae la cuota del total según el tipo elegido.
- **Carta, etiqueta y tarjeta** no son documentos numerados; su numeración solo cumple el contrato del tipo.
