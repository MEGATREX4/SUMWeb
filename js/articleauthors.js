$(document).ready(function() {
    // Select all divs for displaying the author
    var authorDivs = $(".articleauthor");

    // Iterate over each author div
    authorDivs.each(function() {
        var authorDiv = $(this);
        var authorID = authorDiv.attr("id");

        // Load data from the JSON file using Axios
        axios.get('articleauthors.json')
            .then(function(response) {
                var data = response.data;

                // Find the author data corresponding to the author id
                var authorData = data.find(function(author) {
                    return author.authorID === authorID;
                });

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

                    // Set the author div's HTML to display the author information
                    authorDiv.html(authorHTML);
                }
            })
            .catch(function(error) {
                console.error('Error loading author data:', error);
            });
    });
});
