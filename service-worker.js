const cacheName = 'SUMTRANSLATE_REL_1';
const maxImageAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds


// Domains to retrieve and cache images from
const imageDomainsToCache = [
  'curseforge.com',
  'modrinth.com',
  'imgur.com',
  'i.ibb.co',
  'github.com'
];

// Function to retrieve and cache images
function cacheImages() {
  imageDomainsToCache.forEach(domain => {
    // Example: create an image element to trigger browser image caching
    const img = new Image();
    
    // Example URL, replace with the actual image URL
    const imageUrl = `https://${domain}/path/to/image.png`;

    // Set the image source to trigger the fetch and caching
    img.src = imageUrl;

    // Listen for the 'load' event to confirm image loading
    img.addEventListener('load', () => {
      // Image has been loaded and cached
      console.log(`Image cached: ${imageUrl}`);
    });

    // Listen for the 'error' event to handle fetch errors
    img.addEventListener('error', (error) => {
      console.error(`Failed to fetch resource: ${imageUrl}`, error);
    });
  });
}

// Call the function to cache images
cacheImages();
