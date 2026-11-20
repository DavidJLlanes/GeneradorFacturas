// Lector de CSV (RFC 4180): comillas dobles, saltos de línea dentro de una celda y delimitador
// detectado solo (`;` de Excel en español, `,` o tabulador). No usa nada externo.

export interface Csv {
  headers: string[];
  rows: string[][];
  delimiter: string;
}

const BOM = String.fromCharCode(0xfeff);

const DELIMITERS = [';', ',', '\t'] as const;

// El delimitador que más aparece en la primera línea (fuera de comillas).
export function detectDelimiter(text: string): string {
  const counts = new Map<string, number>(DELIMITERS.map((d) => [d, 0]));
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    else if (!quoted && (char === '\n' || char === '\r')) break;
    else if (!quoted && counts.has(char)) counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  let best: string = ',';
  let max = 0;
  for (const [delimiter, count] of counts) {
    if (count > max) {
      best = delimiter;
      max = count;
    }
  }
  return best;
}

function splitRecords(text: string, delimiter: string): string[][] {
  const records: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const endCell = (): void => {
    row.push(cell);
    cell = '';
  };
  const endRow = (): void => {
    endCell();
    records.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]!;
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) endCell();
    else if (char === '\n') endRow();
    else if (char === '\r') {
      if (text[i + 1] === '\n') i += 1;
      endRow();
    } else cell += char;
  }
  if (cell !== '' || row.length > 0) endRow();
  return records;
}

export function parseCsv(input: string): Csv {
  const text = input.startsWith(BOM) ? input.slice(1) : input;
  const delimiter = detectDelimiter(text);
  const records = splitRecords(text, delimiter).filter((r) => r.some((c) => c.trim() !== ''));
  const [head = [], ...rows] = records;
  return { headers: head.map((h) => h.trim()), rows, delimiter };
}

// Escribe un CSV (con `;` y BOM para que Excel en español lo abra bien).
export function writeCsv(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  const cell = (v: string): string => (/[;"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [headers, ...rows].map((r) => r.map(cell).join(';'));
  return `${BOM}${lines.join('\r\n')}\r\n`;
}
