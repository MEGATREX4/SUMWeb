const cacheName = 'SUMTRANSLATE_REL_1';
const maxImageAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Files to cache
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://i.ibb.co/tQsvMtK/android.png',
  // Add more paths to your static assets here
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((existingCacheName) => {
          if (existingCacheName !== cacheName) {
            return caches.delete(existingCacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response to cache it
          const responseToCache = response.clone();

          caches.open(cacheName)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
    );
});