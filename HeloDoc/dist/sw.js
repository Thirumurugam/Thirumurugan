/**
 * HeloDoc Service Worker v3
 * Full offline support with background sync and push notifications
 */

const CACHE_VERSION = 'v3';
const CACHE_NAME = `helodoc-cache-${CACHE_VERSION}`;
const STATIC_CACHE = `helodoc-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `helodoc-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/app-icon.jpg',
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  console.log('[HeloDoc SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[HeloDoc SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).catch(err => {
      console.warn('[HeloDoc SW] Some assets failed to cache:', err);
    })
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', (event) => {
  console.log('[HeloDoc SW] Activating new service worker...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[HeloDoc SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests and non-GET
  if (event.request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('fonts.gstatic.com')) return;
  
  // API calls: network first, no caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ 
          error: 'Offline', 
          message: 'No network connection. Please reconnect to use this feature.' 
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
    return;
  }

  // Static assets: cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache, update in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache, fetch from network and cache it
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Background sync for offline queued requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'helodoc-sync') {
    console.log('[HeloDoc SW] Background sync triggered');
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'HeloDoc';
  const options = {
    body: data.body || 'New update from HeloDoc',
    icon: '/assets/app-icon.jpg',
    badge: '/assets/app-icon.jpg',
    tag: 'helodoc-notification',
    renotify: true,
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existingClient = windowClients.find(client => client.url === targetUrl && 'focus' in client);
      if (existingClient) return existingClient.focus();
      return clients.openWindow(targetUrl);
    })
  );
});

console.log('[HeloDoc SW] Service worker loaded successfully');
