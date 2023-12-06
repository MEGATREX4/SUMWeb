const cacheName = 'SUMTRANSLATE_REL_1';
const maxImageAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Domains to automatically cache images from
const imageDomainsToCache = [
  'curseforge.com',
  'modrinth.com',
  'imgur.com',
  'i.ibb.co',
  'github.com'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // Automatically cache images from specified domains
      return cache.addAll([]);
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const isImageFromAllowedDomain = imageDomainsToCache.some(domain => requestUrl.hostname.includes(domain));

  if (isImageFromAllowedDomain) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          // Check if the cached image is too old
          const cachedDate = new Date(response.headers.get('date'));
          const currentDate = new Date();
          if (currentDate - cachedDate > maxImageAge) {
            // Image is older than the threshold, refresh it
            return fetchAndCache(event.request);
          }
          return response;
        } else {
          // Image is not in the cache, fetch it and cache it
          return fetchAndCache(event.request);
        }
      })
    );
  }
});

// Fetch and cache function
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
