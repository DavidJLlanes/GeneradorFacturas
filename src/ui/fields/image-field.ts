import { isImageDataUrl } from '../../images/image-limits';
import { readImageFile } from '../../images/read-image-file';

export interface ImageField {
  row: HTMLElement;
  /** El selector de archivo; sirve para saber si el control tiene el foco. */
  input: HTMLInputElement;
  /** Refleja la imagen actual (data URL) o ninguna. */
  set(src: unknown): void;
  /** Avisa con la imagen nueva (data URL) o undefined si se quitó. */
  onChange(listener: (src: string | undefined) => void): void;
}

// Campo para subir una imagen (PNG, JPG o SVG), con vista previa y botón para quitarla.
export function createImageField(text: string): ImageField {
  const row = document.createElement('div');
  row.className = 'pd-row imgf';
  const label = document.createElement('span');
  label.textContent = text;

  const box = document.createElement('div');
  box.className = 'imgf-box';
  const thumb = document.createElement('img');
  thumb.className = 'imgf-thumb';
  thumb.alt = '';
  thumb.hidden = true;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/svg+xml';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'pd-btn imgf-remove';
  remove.textContent = 'Quitar';
  remove.hidden = true;
  const error = document.createElement('small');
  error.className = 'imgf-error';
  error.setAttribute('role', 'alert');
  box.append(thumb, input, remove, error);
  row.append(label, box);

  const listeners: ((src: string | undefined) => void)[] = [];
  const emit = (src: string | undefined): void => listeners.forEach((fn) => fn(src));

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      error.textContent = '';
      emit(await readImageFile(file));
    } catch (e) {
      error.textContent = e instanceof Error ? e.message : 'No se pudo cargar la imagen.';
    }
  });
  remove.addEventListener('click', () => emit(undefined));

  return {
    row,
    input,
    set(src) {
      const has = isImageDataUrl(src);
      thumb.hidden = !has;
      remove.hidden = !has;
      if (has && thumb.src !== src) thumb.src = src;
    },
    onChange: (fn) => void listeners.push(fn),
  };
}
