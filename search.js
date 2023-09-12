//search.js
function performSearch() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll('.item');
    cards.forEach(card => {
        const titleElement = card.querySelector('.title');
        const descriptionElement = card.querySelector('.description');

        const titleText = titleElement.textContent.toLowerCase();
        const descriptionText = descriptionElement.textContent.toLowerCase();

        if (titleText.includes(searchTerm) || descriptionText.includes(searchTerm)) {
            card.style.display = 'inline-block';
        } else {
            card.style.display = 'none';
        }
    });
}
