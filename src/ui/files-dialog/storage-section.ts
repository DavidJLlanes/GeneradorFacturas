import { clearEverything } from '../../storage/local/clear-all';
import { formatBytes, requestPersistence, storageUsage } from '../../storage/local/storage-info';
import { getSession } from '../../storage/session/session-context';
import type { Section } from './templates-section';

// Aviso de almacenamiento local, espacio usado y "Borrar todo".
export function createStorageSection(say: (message: string) => void): Section {
  const element = document.createElement('section');
  element.className = 'fd-section';
  const title = document.createElement('h3');
  title.textContent = 'Almacenamiento en este navegador';
  const notice = document.createElement('p');
  notice.className = 'pd-hint';
  notice.textContent =
    'Tus diseños y datos se guardan solo en este navegador. No se envían a ningún servidor ni hace falta cuenta. ' +
    'Si borras los datos del navegador, se pierden: guarda un archivo de diseño como copia de seguridad.';
  const usage = document.createElement('p');
  usage.className = 'pd-hint';

  const wipe = document.createElement('button');
  wipe.type = 'button';
  wipe.className = 'pd-btn fd-danger';
  let armed = false;
  const label = (): void => {
    wipe.textContent = armed ? '¿Seguro? Pulsa otra vez para borrar todo' : 'Borrar todo';
  };
  label();
  wipe.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      label();
      setTimeout(() => {
        armed = false;
        label();
      }, 4000);
      return;
    }
    void clearEverything(getSession().store).then(() => {
      say('Todo borrado. Se recarga la página…');
      window.location.reload();
    });
  });

  async function refresh(): Promise<void> {
    const info = await storageUsage().catch(() => null);
    const persisted = await requestPersistence().catch(() => false);
    usage.textContent =
      (info
        ? `Ocupa unos ${formatBytes(info.usedBytes)} de ${formatBytes(info.quotaBytes)} disponibles. `
        : '') + (persisted ? 'El navegador lo conservará aunque falte espacio.' : '');
  }

  element.append(title, notice, usage, wipe);
  return { element, refresh };
}
