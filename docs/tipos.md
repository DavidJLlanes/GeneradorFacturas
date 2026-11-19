# Tipos de documento incluidos

Cada tipo vive solo en `src/documents/<tipo>/` (ver `docs/anadir-tipo.md`). Se abren con `#tipo=<id>` en la dirección.

| Tipo        | Id            | Papel       | Numeración | Qué aporta                                                                            |
| ----------- | ------------- | ----------- | ---------- | ------------------------------------------------------------------------------------- |
| Factura     | `factura`     | A4          | `0007`     | IVA por línea, IRPF, recargo de equivalencia, exenciones y series (`docs/factura.md`) |
| Presupuesto | `presupuesto` | A4          | `P-0012`   | Líneas con IVA, «válido hasta» calculado, condiciones y recuadro de aceptación        |
| Albarán     | `albaran`     | A4          | `AL-0031`  | Cantidades sin precios, total de unidades, dirección de entrega y doble firma         |
| Recibo      | `recibo`      | A5 apaisado | `R-0045`   | Importe en cifras y en letra (hasta 999.999.999,99 €), concepto, forma de pago, firma |

## Detalles

- **Presupuesto**: `validezDias` + `fecha` dan `validoHasta` (campo calculado). El IVA se agrupa por tipo (21, 10, 4, 0 %) y solo salen las filas de los tipos usados.
- **Albarán**: no tiene ningún campo de dinero. `totalUnidades` suma las cantidades sin errores de coma flotante.
- **Recibo**: `src/documents/recibo/letras.ts` escribe el importe en letra con apócopes («un euro», «veintiún mil euros», «un millón de euros»). Sin importe no escribe nada.
- Todos comparten la numeración con serie opcional y el pie «Página X de N», y usan el kit genérico del núcleo `src/core/template-kit/` para construir sus plantillas.
