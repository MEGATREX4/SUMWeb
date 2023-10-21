// search.js
let allData = []; // Сюди зберігати всі дані з файлів

// Функція завантаження даних з файлів і збереження їх
function loadDataFromFiles() {
    fetch('game.json')
        .then(response => response.json())
        .then(data => {
            allData = allData.concat(data);
            // Після завантаження всіх даних, викликайте функцію для відображення
            displayTranslations(allData, 1, 25); // Змініть параметри, які вам потрібні
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних з файлу game.json:', error);
        });

    fetch('mods.json')
        .then(response => response.json())
        .then(data => {
            allData = allData.concat(data);
            // Після завантаження всіх даних, викликайте функцію для відображення
            displayTranslations(allData, 1, 25); // Змініть параметри, які вам потрібні
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних з файлу mods.json:', error);
        });
}

// Функція для відображення даних на сторінці
function displayTranslations(data, currentPage, itemsPerPage) {
    // Додайте ваш код для відображення даних на сторінці
    // Ви можете використовувати цю функцію для створення карточок, які відобразять всі дані з вашого масиву `data`
    // Врахуйте, що `currentPage` та `itemsPerPage` визначають, які елементи потрібно відобразити на поточній сторінці
    // Очистіть контейнер перед додаванням нових карточок
    const cardContainer = document.querySelector('.container-content #data-container');
    cardContainer.innerHTML = '';

    // Визначення діапазону елементів, які будуть відображені на поточній сторінці
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length); // Обмеження endIndex за допомогою довжини масиву

    // Перебираємо елементи в діапазоні і створюємо карточки
    for (let i = startIndex; i < endIndex; i++) {
        const item = data[i];

        // Створення та налаштування карточки для кожного елемента `item`
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const imageElement = document.createElement('div');
        imageElement.classList.add('image');

        // Встановлення фонового зображення для imageElement
        if (item.image === null) {
            imageElement.style.backgroundImage = `url('images/default-image.jpg')`;
        } else {
            imageElement.style.backgroundImage = `url('${item.image}')`;
        }

        const titleElement = document.createElement('h2');
        titleElement.textContent = item.title;
        titleElement.classList.add('title');

        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('description-container');

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');

        const popupElement = document.createElement('div');
        popupElement.classList.add('popup');

        // Встановлення тексту опису в обидві елементи
        const descriptionText = item.description.length > 100
            ? item.description.slice(0, 100) + '...'
            : item.description;

        descriptionElement.textContent = descriptionText;
        popupElement.textContent = item.description;

        // Додавання імені автора або "команда СУМ", якщо автор не вказаний
        const authorElement = document.createElement('p');
        authorElement.classList.add('author');
        authorElement.textContent = `Автор: ${item.author || 'Команда СУМ'}`;

        // Додавання кнопки "Переклад" з посиланням на GitHub
        const translationButton = document.createElement('a');
        translationButton.classList.add('translation-button');
        translationButton.target = '_blank'; // Відкривати посилання в новій вкладці

        // Перевірка значення тегу 'completed'
        if (item.completed === false) {
            // Якщо 'completed' дорівнює false, встановлюємо текст кнопки "в процесі"
            translationButton.textContent = 'В процесі';
            translationButton.classList.add('notcompleted'); // Додаємо клас 'notcompleted'
            translationButton.setAttribute("id", "notcompleted");
        } else {
            // Інакше встановлюємо текст кнопки "Переклад"
            translationButton.textContent = 'Переклад';
            translationButton.href = 'https://github.com/SKZGx/UA-Translation'; // Посилання на GitHub
            if (item.hasOwnProperty('verified') && item.verified === true) {
                // Створити значок <i> для галочки
                
                const icon = document.createElement('i');
                itemContainer.id = 'verified';
                icon.classList.add('fa', 'fa-question-circle-o', 'translation-icon', 'left-icon'); // Додати класи для значка галочки
                
            
                // Додати обробник подій для показу підказки при наведенні
                icon.addEventListener('mouseenter', function () {
                    const tooltip = document.querySelector('.custom-tooltip');
                    if (tooltip) {
                        // Задати текст підказки відповідно до вашого потреби
                        tooltip.querySelector('.tooltip-content').textContent = 'Ця відмітка означає що розробник додав переклад в свій мод і він вже вбудований, нічого довантажувати не треба';
                        
                        // Показати підказку і визначити її позицію
                        tooltip.style.display = 'block';
                        tooltip.style.left = `${icon.getBoundingClientRect().left}px`;
                        tooltip.style.top = `${icon.getBoundingClientRect().top - tooltip.offsetHeight}px`;
                    }
                });
            
                // Додати обробник події для приховування підказки при виході миші
                icon.addEventListener('mouseleave', function () {
                    const tooltip = document.querySelector('.custom-tooltip');
                    if (tooltip) {
                        tooltip.style.display = 'none'; // Приховати підказку
                    }
                });
            
                // Додати значок на сторінку (в ваш контейнер або елемент, де ви його вставляєте)
                translationButton.insertBefore(icon, translationButton.firstChild);
                
            }
        }
        // Додавання карточки до контейнера
        cardContainer.appendChild(itemContainer);
    }
}

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
        displayTranslations(allData, 1, 15); // You can adjust the number of items per page
    } else {
        const searchResults = allData.filter(item => {
            const titleText = item.title.toLowerCase();
            const descriptionText = item.description.toLowerCase();
            return titleText.includes(searchTerm) || descriptionText.includes(searchTerm);
        });

        displayTranslations(searchResults, 1, 15); // You can adjust the number of items per page
    }
}


