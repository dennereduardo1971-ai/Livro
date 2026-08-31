/* Offline dos capítulos já visitados. Nada de fantasia: cache simples.
   O prefixo vem do escopo do próprio worker, então funciona igual em
   qualquer endereço (raiz do domínio ou subpasta do GitHub Pages). */
const CACHE = 'cais-v2';
const BASE = new URL(self.registration.scope).pathname;
const RAIZ = BASE;
const ESSENCIAL = [RAIZ, BASE + 'capitulos', BASE + 'manifest.webmanifest', BASE + 'icone.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ESSENCIAL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia));
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match(RAIZ))),
  );
});
