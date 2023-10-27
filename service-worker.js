const cacheName = 'SUMTRANSLATE BETA 0.9';
const maxImageAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Files to cache
const imageFilesToCache = [
  'https://i.ibb.co/tQsvMtK/android.png',
  // Add more image URLs to be cached here
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        // Cache only image files
        return cache.addAll(imageFilesToCache);
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
        if (response) {
          // Check if the cached image is too old
          const cachedDate = new Date(response.headers.get('date'));
          const currentDate = new Date();
          if (currentDate - cachedDate > maxImageAge) {
            // Image is older than the threshold, refresh it
            return fetchAndCache(event.request);
          }
          return response;
        }

        const url = new URL(event.request.url);

        if (imageFilesToCache.includes(url.href)) {
          // Image is not in the cache, fetch it and cache it
          return fetchAndCache(event.request);
        } else {
          // For non-image files, fetch them directly from the network
          return fetch(event.request);
        }
      })
    );
});

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    // Clone the response to cache it
    const responseToCache = response.clone();

    caches.open(cacheName)
      .then((cache) => {
        cache.put(request, responseToCache);
      });

    return response;
  });
}
