const cacheName = 'SUMTRANSLATE_REL_'; // Update cache name to trigger the installation of a new service worker
const maxImageAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Included domains for image caching
const includedImageDomains = [

];

// Files to cache
const filesToCache = [
  'https://i.ibb.co/tQsvMtK/android.png',
  // Add more paths to your static assets and documentation files here
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

  const requestUrl = new URL(event.request.url);
  const isIncludedImageDomain = includedImageDomains.some(domain => requestUrl.hostname.includes(domain));

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // If the request is for an image from an included domain, cache it
        if (isIncludedImageDomain && requestUrl.pathname.endsWith('.png')) {
          return fetchAndCache(event.request);
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

// Function to fetch and cache an image
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        console.error(`Failed to fetch resource: ${request.url}`, response);
        throw new Error('Failed to fetch resource');
      }

      // Clone the response to cache it
      const responseToCache = response.clone();

      caches.open(cacheName).then((cache) => {
        cache.put(request, responseToCache);
      });

      return response;
    })
    .catch((error) => {
      console.error(`Fetch error for resource: ${request.url}`, error);
      throw error;
    });
}
