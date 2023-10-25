// search.js
let allData = []; // Сюди зберігати всі дані з файлів

// Функція завантаження даних з файлів і збереження їх
function loadDataFromFiles() {
    fetch('other.json')
        .then(response => response.json())
        .then(data => {
            allData = allData.concat(data);
            // Після завантаження всіх даних, викликайте функцію для відображення
            displayTranslations(allData, 1, 999999); // Змініть параметри, які вам потрібні
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних з файлу other.json:', error);
        });

    fetch('mods.json')
        .then(response => response.json())
        .then(data => {
            allData = allData.concat(data);
            // Після завантаження всіх даних, викликайте функцію для відображення
            displayTranslations(allData, 1, 999999); // Змініть параметри, які вам потрібні
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних з файлу mods.json:', error);
        });
}

// Функція для відображення даних на сторінці


// Виклик функції завантаження даних з файлів
loadDataFromFiles();

// Додавання обробника події для кнопки "Пошук"
// Додавання обробника подій для поля пошуку
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', performSearch);

// Функція пошуку
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm.trim() === '') {
        // If the search input is empty, display all translations
        displayTranslations(allData, 1, 99999999); // You can adjust the number of items per page

        // Check if the showMoreButton exists and is hidden (display is 'none')
        if (showMoreButton && showMoreButton.style.display === 'none') {
            showMoreButton.style.display = 'block'; // Display the button
        }
    } else {
        const searchResults = allData.filter(item => {
            const titleText = item.title.toLowerCase();
            const descriptionText = item.description.toLowerCase();
            return titleText.includes(searchTerm) || descriptionText.includes(searchTerm);
        });

        displayTranslations(searchResults, 1, 99999999); // You can adjust the number of items per page

        // Check if the showMoreButton exists
        if (showMoreButton) {
            showMoreButton.style.display = 'none'; // Hide the button
        }
    }
}



