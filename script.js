function displayTranslations(data, currentPage, itemsPerPage) {
    const cardContainer = document.querySelector('.container-content #data-container');
    cardContainer.innerHTML = ''; // Очистити контейнер перед додаванням нових карточок

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    data.slice(startIndex, endIndex).forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const imageElement = document.createElement('div');
        imageElement.classList.add('image');

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
        authorElement.textContent = `Автор: ${item.author || 'команда СУМ'}`;

        // Додавання кнопки "Переклад" з посиланням на GitHub
        const translationButton = document.createElement('a');
        translationButton.classList.add('translation-button');
        translationButton.href = 'https://github.com/SKZGx/UA-Translation'; // Посилання на GitHub
        translationButton.target = '_blank'; // Відкривати посилання в новій вкладці

        // Додавання значка (Font Awesome) зліва від тексту тільки при значенні "verified": true
        if (item.verified === true) {
            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-check', 'translation-icon', 'left-icon'); // Додаємо класи для значка галочки
            translationButton.appendChild(icon);
        }

        // Додавання тексту всередину кнопки
        const buttonText = document.createElement('span');
        buttonText.textContent = 'Переклад';
        translationButton.appendChild(buttonText);

        // Додавання pop-up вікна перед описом
        descriptionContainer.appendChild(popupElement);

        imageContainer.appendChild(imageElement);
        itemContainer.appendChild(imageContainer);
        itemContainer.appendChild(titleElement);
        descriptionContainer.appendChild(descriptionElement);
        itemContainer.appendChild(descriptionContainer);
        itemContainer.appendChild(authorElement); // Додавання елементу із ім'ям автора або "команда СУМ"
        itemContainer.appendChild(translationButton); // Додавання кнопки "Переклад"

        cardContainer.appendChild(itemContainer);

        // Додавання обробників подій для показу/приховування pop-up
        descriptionContainer.addEventListener('mouseenter', () => {
            popupElement.style.display = 'block';
        });

        descriptionContainer.addEventListener('mouseleave', () => {
            popupElement.style.display = 'none';
        });
    });
}

function setActiveTab(tabElement) {
    // Знайти всі вкладки
    const tabs = document.querySelectorAll('.tab');

    // Перебрати всі вкладки і видалити клас 'active'
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Додати клас 'active' до вибраної вкладки
    tabElement.classList.add('active');
}

function loadTranslationsFromFile(fileName, currentPage, itemsPerPage) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            // Показати дані з вказаного файлу, вказавши поточну сторінку та кількість елементів на сторінці
            displayTranslations(data, currentPage, itemsPerPage);
        })
        .catch(error => {
            console.error(`Помилка завантаження JSON даних з файлу ${fileName}:`, error);
        });
}

function showAllTranslations() {
    // Встановіть кількість елементів на сторінці тут (наприклад, 15)
    const itemsPerPage = 15;
    
    // Завантажити дані з файлу mods.json
    const modsDataPromise = fetch('mods.json').then(response => response.json());

    // Завантажити дані з файлу game.json
    const gameDataPromise = fetch('game.json').then(response => response.json());

    // Очікувати завершення обох завдань завантаження
    Promise.all([modsDataPromise, gameDataPromise])
        .then(data => {
            // Об'єднати дані з обох файлів
            const combinedData = [...data[0], ...data[1]];
            // Показати комбіновані дані
            displayTranslations(combinedData, 1, itemsPerPage);
            // Встановити активну вкладку
            setActiveTab(document.querySelector('.tab:nth-child(1)'));
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних:', error);
        });
}

function showMinecraftTranslations() {
    // Встановіть кількість елементів на сторінці тут (наприклад, 15)
    const itemsPerPage = 15;
    // Завантажити і показати дані з файлу mods.json
    loadTranslationsFromFile('mods.json', 1, itemsPerPage);
    // Встановити активну вкладку
    setActiveTab(document.querySelector('.tab:nth-child(2)'));
}

function showGamesTranslations() {
    // Встановіть кількість елементів на сторінці тут (наприклад, 15)
    const itemsPerPage = 15;
    // Завантажити і показати дані з файлу game.json
    loadTranslationsFromFile('game.json', 1, itemsPerPage);
    // Встановити активну вкладку
    setActiveTab(document.querySelector('.tab:nth-child(3)'));
}


// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();
