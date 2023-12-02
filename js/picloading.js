// Replace PNG images with WebP if supported
function replaceImagesWithWebP() {
    if (hasWebPSupport()) {
        $('img').each(function() {
            var img = $(this);
            var src = img.attr('src');
            
            // Check if the image is a PNG
            if (src.toLowerCase().endsWith('.png')) {
                // Replace ".png" with ".webp"
                var webpSrc = src.replace('.png', '.webp');

                // Create a new Image element with the WebP source
                var webpImg = new Image();

                // Set crossorigin attribute for cross-origin requests
                webpImg.crossOrigin = 'anonymous';

                webpImg.src = webpSrc;

                // Check if the WebP image exists, then replace the source
                webpImg.onload = function() {
                    img.attr('src', webpSrc);
                    console.log('Replaced PNG with WebP:', src, '->', webpSrc);
                };
                webpImg.onerror = function() {
                    console.error('WebP image not available:', webpSrc);
                    // Additional information about the error
                    console.error('Error details:', webpImg);
                };
            }
        });
    }
}

// Check if the browser supports WebP
function hasWebPSupport() {
    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
}
