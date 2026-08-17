// New Drip Service Worker (PWA Cache & Fast Boot)
const CACHE_NAME = newdrip-v1;
const ASSETS_TO_CACHE = [
  /,
  /index.html,
  /styles.css,
  /app.js,
  /manifest.json,
  /icon-192.png,
  /icon-512.png,
  /apple-touch-icon.png,
  /logo_dark.png,
  /logo_light.png,
  /compounding_hero.jpg,
  /tax_shield_hero.jpg,
  /expense_stage.jpg,
  /broker_stage.jpg
];

self.addEventListener(install, (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener(activate, (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener(fetch, (e) => {
  // Pass through API calls live
  if (e.request.url.includes(/api/)) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cache and update in background
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
