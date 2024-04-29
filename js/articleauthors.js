document.addEventListener("DOMContentLoaded", function() {
    // Get all the divs for displaying the author
    var authorDivs = document.querySelectorAll(".articleauthor");

    // Iterate over each author div
    authorDivs.forEach(function(authorDiv) {
        // Check if the author div exists and has an id
        if (authorDiv && authorDiv.id) {
            // Load data from the JSON file using Fetch API
            fetch('articleauthors.json')
                .then(response => response.json())
                .then(data => {
                    // Find the author data corresponding to the author id
                    var authorData = data.find(author => author.authorID === authorDiv.id);
                    
                    // If author data is found, construct the author HTML
                    if (authorData) {
                        var authorHTML = `
                            <div class="author">
                                <img src="${authorData.authorImage}" alt="${authorData.authorName}" class="author-image">
                                <div class="author-info">
                                    <p class="author-name">${authorData.authorName}</p>
                                    <p style="font-size: 12px;" class="author-about">${authorData.authorAbout}</p>
                                </div>
                            </div>`;

                        // Set the author div's innerHTML to display the author information
                        authorDiv.innerHTML = authorHTML;
                    }
                })
                .catch(error => console.error('Error loading author data:', error));
        }
    });
});
