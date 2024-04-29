document.addEventListener('DOMContentLoaded', function() {
    const selectionSpans = document.querySelectorAll('.selection');

    selectionSpans.forEach(function(span) {
        span.addEventListener('click', function() {
            const textToCopy = span.textContent.trim();

            // Create a temporary textarea to hold the text to copy
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px'; // Move the textarea offscreen
            document.body.appendChild(textarea);

            // Select and copy the text
            textarea.select();
            document.execCommand('copy');

            // Remove the temporary textarea
            document.body.removeChild(textarea);

            // Provide visual feedback that the text has been copied
            span.classList.add('copied');
            setTimeout(function() {
                span.classList.remove('copied');
            }, 1000); // Remove the 'copied' class after 1 second
        });
    });
});
