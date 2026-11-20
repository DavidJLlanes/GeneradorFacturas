// Registra el service worker para poder usar la aplicación sin conexión. Solo en la versión
// publicada: en desarrollo daría copias viejas.
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .then(() => Promise.all([navigator.serviceWorker.ready, document.fonts.ready]))
      .then(([registration]) => {
        const urls = performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((name) => name.includes(`${import.meta.env.BASE_URL}fonts/`));
        registration.active?.postMessage({ type: 'cache-fonts', urls });
      })
      .catch(() => undefined);
  });
}
