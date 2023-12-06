const cacheName = 'SUMTRANSLATE_BETA_0.9';
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
      // Cache only image files from specific domains
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

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (!response || response.status !== 200 || response.type !== 'basic') {
      throw new Error('Failed to fetch resource');
    }

    // Clone the response to cache it
    const responseToCache = response.clone();

    caches.open(cacheName).then((cache) => {
      cache.put(request, responseToCache);
    });

    return response;
  });
}
