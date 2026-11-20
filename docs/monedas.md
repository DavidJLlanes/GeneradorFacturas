# Monedas

La moneda es una propiedad del diseño, como el papel o los colores: se elige con el botón **Moneda** (grupo «Papel y moneda»), se guarda en el archivo de diseño (`documento.currency`) y se deshace con ↶.

- Cambia el símbolo y el formato de todos los importes: campos de dinero, tabla de líneas, totales, pantalla, PDF y modo lote.
- **No convierte cantidades**: 100 € pasan a ser 100 $.
- Monedas ofrecidas (todas con dos decimales, como guardamos los importes en céntimos): EUR, USD, GBP, CHF, CAD, AUD, MXN, ARS, COP, PEN y BRL. Sin elegir, el euro.
- El formato numérico sigue siendo el español (`1.234,56`); el navegador pone el símbolo de cada moneda (en español, `US$` para el dólar y `GBP` para la libra).
- Un archivo antiguo sin moneda se abre en euros. Un código desconocido se ignora.

Código: `src/data/currency.ts` (lista y lectura), `setCurrency` en `src/canvas/commands/style-commands.ts` y `src/ui/currency-dialog/`. Las piezas reciben `currency` en su entrada de dibujo.
