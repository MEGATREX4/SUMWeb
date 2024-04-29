document.addEventListener("DOMContentLoaded", function() {
    // Check if the cache has already been cleared
    if (!localStorage.getItem('cacheCleared')) {
        // Check if the cache exists
        if (caches && caches.keys) {
            caches.keys().then(function(cacheNames) {
                cacheNames.forEach(function(cacheName) {
                    // Check if the cache name matches the specified pattern
                    if (cacheName.startsWith('SUMTRANSLATE_REL_') && cacheName.endsWith('CACHE')) {
                        // Clear the cache
                        caches.delete(cacheName).then(function() {
                            console.log('Cache', cacheName, 'has been cleared.');
                            // Clear localStorage
                            localStorage.clear();
                            // Set flag in localStorage to indicate cache has been cleared
                            localStorage.setItem('cacheCleared', true);
                            // Reload the page
                            location.reload();
                        }).catch(function(error) {
                            console.error('Error clearing cache:', error);
                        });
                    }
                });
            }).catch(function(error) {
                console.error('Error retrieving cache keys:', error);
            });
        } else {
            console.error('Cache API is not supported.');
        }
    }
});
