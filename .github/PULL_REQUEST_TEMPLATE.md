## Qué aporta

- [ ] Plantilla nueva de un tipo existente
- [ ] Tipo de documento nuevo
- [ ] Ampliación genérica del núcleo (sin tocar ningún tipo)

Tipo afectado: <!-- factura, presupuesto… -->

## Comprobaciones

- [ ] `npm run check` pasa (formato, lint, pruebas y build)
- [ ] `npm run check:type -- <tipo>`: el diff solo toca `src/documents/<tipo>/`
- [ ] Los colores son de la paleta (`@primary`, `@text`…), no fijos
- [ ] Captura de la plantilla con «Datos de ejemplo» adjunta
- [ ] No mezcla cambios del núcleo con cambios de un tipo
