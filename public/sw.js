// LumenCity Service Worker — minimal shell cache
// Sadece app shell'i cache'le; offline çalışma değil, "Ana ekrana ekle" için şart

const CACHE_NAME = "lumencity-v1";
const SHELL_URLS = [
  "/app",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: API çağrılarını her zaman ağdan al
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API ve harici istekler → ağdan git
  if (url.pathname.startsWith("/api/") || url.origin !== self.location.origin) {
    return;
  }

  // Uygulama shell → cache first
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
