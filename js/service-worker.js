// Define a unique cache name
const cacheName = 'SUMweb2.0';
const oneDayInSeconds = 24 * 60 * 60; // 1 day in seconds

// List of assets to cache
const assetsToCache = [
  '/',
  '/icon/completed.svg',
  '/icon/semiverified.svg',
  '/icon/verified.svg',
  'icons.json'
];

// Install event listener
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(assetsToCache);
      })
  );
});

// Fetch event listener
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Open the cache
            caches.open(cacheName)
              .then(cache => {
                // Cache the response with a specific expiration date
                const cacheExpiration = new Date(Date.now() + oneDayInSeconds * 1000); // Current time + 1 day
                const cacheOptions = {
                  headers: { 'Expires': cacheExpiration.toUTCString() }
                };
                cache.put(event.request, responseToCache, cacheOptions);
              });

            return response;
          }
        );
      })
  );
});

// Activate event listener
self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete outdated caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
