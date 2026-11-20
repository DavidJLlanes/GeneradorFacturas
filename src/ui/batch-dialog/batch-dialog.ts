import type { Editor } from '../../canvas/editor/create-editor';
import { buildDocuments, type BatchDocument } from '../../batch/convert/build-documents';
import { parseCsv, writeCsv, type Csv } from '../../batch/csv/parse-csv';
import { runBatch } from '../../batch/run/run-batch';
import { autoMap } from '../../batch/targets/auto-map';
import { buildTargets, type Target } from '../../batch/targets/build-targets';
import { exampleCsv } from '../../batch/targets/example-csv';
import { formatFieldValue } from '../../data/format-field';
import { downloadBlob } from '../../storage/files/download-blob';
import { getSession } from '../../storage/session/session-context';
import { fileSlug } from '../../storage/files/file-name';
import { pickTextFile } from '../../storage/files/pick-text-file';
import { option, selectField } from '../fields/form-fields';
import { createMappingSection } from './mapping-section';
import '../dialog/dialog.css';
import './batch.css';

const button = (text: string, primary = false): HTMLButtonElement => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = primary ? 'pd-btn pd-primary' : 'pd-btn';
  b.textContent = text;
  return b;
};

const paragraph = (className = 'pd-hint'): HTMLParagraphElement => {
  const p = document.createElement('p');
  p.className = className;
  return p;
};

let dialog: HTMLDialogElement | null = null;
let show: ((editor: Editor) => void) | null = null;

function build(): void {
  const d = document.createElement('dialog');
  d.className = 'pd bt';
  d.setAttribute('aria-label', 'Modo lote');
  const title = document.createElement('h2');
  title.textContent = 'Modo lote: un PDF por fila';
  const intro = paragraph();
  intro.textContent =
    'Importa un CSV, asigna sus columnas a los campos del documento y descarga todos los PDF en un ZIP. Todo ocurre en tu navegador. Los campos sin columna (por ejemplo tus datos de emisor) se toman de los datos que tengas ahora en el editor.';

  const example = button('Descargar CSV de ejemplo');
  const pick = button('Elegir archivo CSV…', true);
  const top = document.createElement('div');
  top.className = 'bt-top';
  top.append(example, pick);

  const loaded = paragraph();
  const mapSection = createMappingSection(() => refresh());
  const groupField = selectField('Agrupar filas por (opcional)', []);
  const nameField = selectField('Nombrar cada PDF con', []);
  const options = document.createElement('div');
  options.className = 'pd-fields';
  options.append(groupField.row, nameField.row);

  const summary = paragraph();
  const errorList = document.createElement('ul');
  errorList.className = 'bt-errors';
  const bar = document.createElement('progress');
  bar.hidden = true;
  const status = paragraph();

  const close = button('Cerrar');
  const generate = button('Generar ZIP', true);
  generate.disabled = true;
  const actions = document.createElement('div');
  actions.className = 'pd-actions';
  actions.append(close, generate);

  const work = document.createElement('div');
  work.hidden = true;
  work.append(loaded, mapSection.element, options, summary, errorList);
  d.append(title, intro, top, work, bar, status, actions);
  document.body.append(d);

  let editor: Editor;
  let targets: readonly Target[] = [];
  let csv: Csv | null = null;
  let documents: BatchDocument[] = [];
  let running: AbortController | null = null;

  const labelOf = (document_: BatchDocument): string => {
    const target = targets.find((t) => t.id === nameField.input.value);
    if (!target) return '';
    return formatFieldValue(target.kind, document_.data[target.fieldKey], target.options);
  };

  function refresh(): void {
    if (!csv) return;
    const group = Number(groupField.input.value);
    documents = buildDocuments(csv.rows, {
      targets,
      mapping: mapSection.mapping(),
      groupColumn: group >= 0 ? group : null,
      base: editor.ui.get().data,
    });
    const bad = documents.filter((x) => x.errors.length > 0);
    const good = documents.length - bad.length;
    summary.textContent = `${documents.length} ${documents.length === 1 ? 'documento' : 'documentos'}: ${good} listos${bad.length > 0 ? ` y ${bad.length} con errores (se omiten)` : ''}.`;
    errorList.replaceChildren(
      ...bad.slice(0, 20).flatMap((x) =>
        x.errors.slice(0, 2).map((message) => {
          const li = document.createElement('li');
          li.textContent = message;
          return li;
        }),
      ),
    );
    generate.disabled = good === 0 || running !== null;
  }

  groupField.input.addEventListener('change', refresh);
  nameField.input.addEventListener('change', refresh);

  example.addEventListener('click', () => {
    const { headers, row } = exampleCsv(targets, editor.ui.get().sample);
    const blob = new Blob([writeCsv(headers, [row])], { type: 'text/csv;charset=utf-8' });
    downloadBlob(`ejemplo-${fileSlug(getSession().typeId, 'documentos')}.csv`, blob);
  });

  pick.addEventListener('click', () => {
    void pickTextFile('.csv,.txt,text/csv').then((file) => {
      if (!file) return;
      csv = parseCsv(file.text);
      status.textContent = '';
      if (csv.headers.length === 0 || csv.rows.length === 0) {
        loaded.textContent = 'El archivo no tiene filas de datos.';
        work.hidden = false;
        mapSection.element.replaceChildren();
        summary.textContent = '';
        errorList.replaceChildren();
        generate.disabled = true;
        csv = null;
        return;
      }
      loaded.textContent = `${file.name}: ${csv.rows.length} filas, ${csv.headers.length} columnas.`;
      mapSection.show(targets, csv.headers, autoMap(csv.headers, targets));
      const columns = csv.headers.map((h, i) => option(h || `Columna ${i + 1}`, String(i)));
      groupField.input.replaceChildren(option('— cada fila es un documento —', '-1'), ...columns);
      nameField.input.replaceChildren(
        option('Solo su posición (001, 002…)', ''),
        ...targets
          .filter((t) => !t.columnKey && t.kind !== 'toggle')
          .map((t) => option(t.label, t.id)),
      );
      const numero = targets.find((t) => !t.columnKey && /n[uú]mero/i.test(t.label));
      if (numero) nameField.input.value = numero.id;
      work.hidden = false;
      refresh();
    });
  });

  generate.addEventListener('click', () => {
    const good = documents.filter((x) => x.errors.length === 0).length;
    running = new AbortController();
    generate.textContent = 'Cancelar';
    generate.disabled = false;
    bar.hidden = false;
    bar.max = documents.length;
    bar.value = 0;
    const abort = running;
    const onClick = (): void => abort.abort();
    generate.addEventListener('click', onClick, { once: true });
    status.textContent = `Generando ${good} PDF…`;
    void runBatch(
      { doc: editor.doc(), ui: editor.ui.get(), documents, label: labelOf },
      (done, total) => {
        bar.value = done;
        status.textContent = `Generando… ${done} de ${total}`;
      },
      abort.signal,
    )
      .then((result) => {
        if (result.zip) {
          downloadBlob(
            `lote-${fileSlug(getSession().typeId, 'documentos')}-${new Date().toISOString().slice(0, 10)}.zip`,
            result.zip,
          );
        }
        const failed = result.failures.length;
        status.textContent =
          `${result.cancelled ? 'Cancelado. ' : ''}${result.made} PDF en el ZIP` +
          (failed > 0 ? ` · ${failed} con errores (detallados en errores.txt)` : '.');
      })
      .catch((error: unknown) => {
        status.textContent = `No se pudo generar el lote: ${error instanceof Error ? error.message : String(error)}`;
      })
      .finally(() => {
        running = null;
        generate.removeEventListener('click', onClick);
        generate.textContent = 'Generar ZIP';
        bar.hidden = true;
        refresh();
      });
  });

  close.addEventListener('click', () => {
    running?.abort();
    d.close();
  });

  dialog = d;
  show = (current) => {
    editor = current;
    const schema = current.ui.get().schema;
    targets = schema ? buildTargets(schema) : [];
    csv = null;
    documents = [];
    work.hidden = true;
    status.textContent = targets.length === 0 ? 'Este documento no tiene campos de datos.' : '';
    example.disabled = pick.disabled = targets.length === 0;
    generate.disabled = true;
  };
}

export function openBatchDialog(editor: Editor): void {
  if (!dialog?.isConnected) build();
  show?.(editor);
  dialog?.showModal();
}
