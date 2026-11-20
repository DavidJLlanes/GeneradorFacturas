import type { EditorUiState } from '../../canvas/editor/editor-state';
import type { DocumentModel } from '../../core/document/types';
import type { BatchDocument } from '../convert/build-documents';
import { ZipWriter } from '../zip/zip-writer';
import { pdfFileName } from './file-names';

export interface BatchJob {
  doc: DocumentModel;
  ui: EditorUiState;
  documents: readonly BatchDocument[];
  /** Texto con el que se nombra el PDF de cada documento (p. ej. su número). */
  label(document: BatchDocument): string;
}

export interface BatchFailure {
  rows: readonly number[];
  message: string;
}

export interface BatchResult {
  zip: Blob | null;
  made: number;
  failures: readonly BatchFailure[];
  cancelled: boolean;
}

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

const rowsText = (rows: readonly number[]): string =>
  rows.length === 1 ? `fila ${rows[0]}` : `filas ${rows[0]}–${rows[rows.length - 1]}`;

// Genera un PDF por documento y los empaqueta en un ZIP. Un documento con errores de datos o que
// falla al dibujarse se anota y se sigue con los demás. Se puede cancelar con `signal`.
export async function runBatch(
  job: BatchJob,
  onProgress: (done: number, total: number) => void,
  signal?: AbortSignal,
): Promise<BatchResult> {
  const { documentToPdf } = await import('../../pdf-file/document-pdf');
  const zip = new ZipWriter();
  const failures: BatchFailure[] = [];
  const total = job.documents.length;
  let made = 0;
  let cancelled = false;

  for (let i = 0; i < total; i += 1) {
    if (signal?.aborted) {
      cancelled = true;
      break;
    }
    const document = job.documents[i]!;
    onProgress(i, total);
    await tick();
    if (document.errors.length > 0) {
      failures.push({ rows: document.rows, message: document.errors.join('; ') });
      continue;
    }
    try {
      const name = pdfFileName(i, total, job.label(document));
      const bytes = await documentToPdf(
        job.doc,
        { ...job.ui, data: document.data },
        'filled',
        name,
      );
      await zip.add({ name, data: bytes });
      made += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({
        rows: document.rows,
        message: `${rowsText(document.rows)}: no se pudo generar el PDF: ${message}`,
      });
    }
  }
  onProgress(cancelled ? made : total, total);

  if (failures.length > 0) {
    const report = failures.map((f) => f.message).join('\r\n');
    await zip.add({ name: 'errores.txt', data: new TextEncoder().encode(`${report}\r\n`) });
  }
  return { zip: made > 0 || failures.length > 0 ? zip.finish() : null, made, failures, cancelled };
}
