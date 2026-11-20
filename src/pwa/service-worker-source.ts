// Texto del service worker que hace funcionar la aplicación sin conexión. Se genera al construir,
// con la lista exacta de archivos de esa versión.
//
// - Núcleo (páginas, código, estilos, iconos): se guarda entero al instalar.
// - Fuentes (`/fonts/`): se guardan la primera vez que se usan; son muchas y casi nadie usa todas.
// - Navegación: primero la red (para ver una versión nueva en cuanto se publica) y, sin conexión, la copia.

export function hashOf(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i += 1) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function serviceWorkerSource(base: string, files: readonly string[]): string {
  const core = [base, ...files.map((f) => base + f)];
  const version = hashOf(core.join('|'));
  return `// Generado al construir. No editar.
const VERSION = ${JSON.stringify(version)};
const CORE_CACHE = 'gd-core-' + VERSION;
const FONT_CACHE = 'gd-fonts-v1';
const BASE = ${JSON.stringify(base)};
const CORE = ${JSON.stringify(core)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CORE_CACHE && k !== FONT_CACHE && k.startsWith('gd-')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    if (response.ok) (await caches.open(CORE_CACHE)).put(BASE, response.clone());
    return response;
  } catch (error) {
    const hit = await caches.match(BASE, { ignoreVary: true });
    if (hit) return hit;
    throw error;
  }
}

// La primera vez la página carga sus fuentes antes de que el service worker la controle: ella misma
// pasa la lista de las que ya usa para que también queden guardadas.
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'cache-fonts' || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter((u) => typeof u === 'string' && new URL(u).origin === self.location.origin && new URL(u).pathname.startsWith(BASE + 'fonts/'));
  event.waitUntil(caches.open(FONT_CACHE).then((cache) => Promise.all(urls.map((u) => cache.match(u).then((hit) => hit || cache.add(u).catch(() => undefined))))));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  if (request.mode === 'navigate') event.respondWith(networkFirstPage(request));
  else if (url.pathname.startsWith(BASE + 'fonts/')) event.respondWith(cacheFirst(request, FONT_CACHE));
  else event.respondWith(cacheFirst(request, CORE_CACHE));
});
`;
}
