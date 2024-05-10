// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  } 

// Function to load and display random items
$(document).ready(() => {
    // Load mods data
    $.getJSON('mods.json', function(modsData) {
        // Load other data
        $.getJSON('other.json', function(otherData) {
            // Combine mods and other data into a single array
            const allData = [...modsData, ...otherData];
            
            // Shuffle the combined array
            const shuffledData = shuffleArray(allData);

            // Select the first 6 elements
            const selectedItems = shuffledData.slice(0, 5);

            // Generate HTML for selected items
            const itemsHTML = selectedItems.map(item => `
                <div class="randomItem" onclick="window.open('item.html?id=${item.id}', '_self')">
                    <div class="randomItemImage" style="background: url(&quot;${item.image}&quot;)" alt="${item.title}"></div>
                    <h3 class="randomItemTitle" title="${item.title}">${truncateText(item.title, 15)}</h3>
                    <div class="randomItemAuthor"><p class="randomItemAuthorText" title="${item.author}">від ${truncateText(item.author, 10)}</p></div>
                </div>
            `).join('');

            // Append HTML to the randomItems div
            $('.randomItems').html(itemsHTML);

            // Get the randomItems container
            const randomItemsContainer = $('.randomItems');

            // Scroll the container to the first element's position
            const firstItemPosition = randomItemsContainer.children().first().position().left;
            randomItemsContainer.scrollLeft(firstItemPosition);

            // Add event listener to adjust scroll position on window resize
            $(window).on('resize', function() {
                randomItemsContainer.scrollLeft(firstItemPosition);
            });
        });
    });
});
