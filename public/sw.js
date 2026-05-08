// DayZ Codex Service Worker — offline cache para PWA install.
//
// Estratégia:
//  - Cache First para /items/, /maps/, /fonts/, e _next/static (imutáveis)
//  - Network First para HTML (atualiza quando online)
//  - Fallback para shell offline em falha total
//
// Pequeno e auto-suficiente — sem dependências externas.

const VERSION = "v1";
const CACHE_STATIC = `dayz-codex-static-${VERSION}`;
const CACHE_PAGES = `dayz-codex-pages-${VERSION}`;

const STATIC_PATTERNS = [
  /\/_next\/static\//,
  /\/fonts\//,
  /\/items\//,
  /\/maps\//,
  /\.(png|jpe?g|webp|gif|svg|woff2?|ico)$/,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_PAGES).then((cache) => cache.add("/")),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_STATIC && k !== CACHE_PAGES)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // só same-origin

  // Static assets — cache first
  if (STATIC_PATTERNS.some((re) => re.test(url.pathname))) {
    event.respondWith(
      caches.open(CACHE_STATIC).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          return hit ?? new Response("Offline", { status: 503 });
        }
      }),
    );
    return;
  }

  // HTML — network first com fallback cache
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const cache = await caches.open(CACHE_PAGES);
            cache.put(req, res.clone());
          }
          return res;
        } catch {
          const cache = await caches.open(CACHE_PAGES);
          const hit = await cache.match(req);
          return hit ?? cache.match("/") ?? new Response("Offline", { status: 503 });
        }
      })(),
    );
  }
});
