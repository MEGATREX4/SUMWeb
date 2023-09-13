//script.js

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
        translationButton.target = '_blank'; // Відкривати посилання в новій вкладці

        // Перевірка значення тегу 'completed'
        if (item.completed === false) {
            // Якщо 'completed' дорівнює false, встановлюємо текст кнопки "в процесі"
            translationButton.textContent = 'в процесі';
            translationButton.classList.add('notcompleted'); // Додаємо клас 'notcompleted'
        } else {
            // Інакше встановлюємо текст кнопки "Переклад"
            translationButton.textContent = 'Переклад';
            translationButton.href = 'https://github.com/SKZGx/UA-Translation'; // Посилання на GitHub
            if (item.hasOwnProperty('verified') && item.verified === true) {
                // Створити значок <i> для галочки
                const icon = document.createElement('i');
                icon.classList.add('fa', 'fa-check', 'translation-icon', 'left-icon'); // Додати класи для значка галочки
            
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

// Оголосіть змінні для зберігання кількості відображених елементів і загальної кількості елементів
let displayedItems = 15;
let minecraftData = [];
let gamesData = [];
let currentTab = 'all';

function showAllTranslations() {
    currentTab = 'all';
    displayedItems = 15;
    loadAndDisplayData('all');
    setActiveTab(document.querySelector('.tab:nth-child(1)'));
}

function showGamesTranslations() {
    currentTab = 'games';
    displayedItems = 15;
    loadAndDisplayData('games');
    setActiveTab(document.querySelector('.tab:nth-child(3)'));
}

function showMinecraftTranslations() {
    currentTab = 'minecraft';
    displayedItems = 15;
    loadAndDisplayData('minecraft');
    setActiveTab(document.querySelector('.tab:nth-child(2)'));
}



// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();

function loadAndDisplayData(tab) {
    const itemsPerPage = 15;
    let dataToDisplay = [];

    if (tab === 'minecraft') {
        dataToDisplay = minecraftData;
    } else if (tab === 'games') {
        dataToDisplay = gamesData;
    } else {
        dataToDisplay = minecraftData.concat(gamesData);
    }

    const startIndex = 0;
    const endIndex = displayedItems;

    const showMoreButton = document.getElementById('show-more-button');

    if (endIndex >= dataToDisplay.length) {
        if (showMoreButton) {
            showMoreButton.style.display = 'none';
        }
    } else {
        if (showMoreButton) {
            showMoreButton.style.display = 'block';
        }
    }

    displayTranslations(dataToDisplay.slice(startIndex, endIndex), 1, displayedItems);
}

// Додайте обробник події для кнопки "Показати більше"
const showMoreButton = document.getElementById('show-more-button');
if (showMoreButton) {
    showMoreButton.addEventListener('click', () => {
        displayedItems += 15;
        loadAndDisplayData(currentTab);
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
            if (fileName === 'mods.json') {
                minecraftData = data;
            } else if (fileName === 'game.json') {
                gamesData = data;
            }

            loadAndDisplayData(currentTab);
        })
        .catch(error => {
            console.error(`Помилка завантаження JSON даних з файлу ${fileName}:`, error);
        });
}

// Завантажити дані з файлу game.json при запуску сторінки
loadTranslationsFromFile('game.json', 1, displayedItems);

// Завантажити дані з файлу mods.json при запуску сторінки
loadTranslationsFromFile('mods.json', 1, displayedItems);





// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();
