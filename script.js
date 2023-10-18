//script.js

function displayTranslations(data, currentPage, itemsPerPage) {
    const cardContainer = document.querySelector('.container-content #data-container');
    cardContainer.innerHTML = ''; // Очистити контейнер перед додаванням нових карточок

    // Визначення діапазону елементів, які будуть відображені на поточній сторінці
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length); // Обмеження endIndex за допомогою довжини масиву

    // Перебираємо елементи в діапазоні і створюємо карточки
    for (let i = startIndex; i < endIndex; i++) {
        const item = data[i];

        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const imageElement = document.createElement('div');
        imageElement.classList.add('image');

// Встановлення фонового зображення для imageElement
if (item.image !== "") {
    imageElement.style.backgroundImage = `url('${item.image}')`;
} else {
    imageElement.style.backgroundImage = `url('images/default-image.png')`;
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
        
        // Перевірка, чи поле "description" порожнє
        if (item.description === "") {
            const errorText = "Мод/гра поки не має опису, це може бути помилкою, тому зверніться до розробників через пошту, або в соц мережах";
            descriptionElement.textContent = errorText;
            descriptionElement.classList.add('descerror'); // Додавання класу "descerror"
            
            popupElement.textContent = errorText;
            popupElement.classList.add('descerror'); // Додавання класу "descerror"
        } else {
            const descriptionText = item.description.length > 100
                ? item.description.slice(0, 100) + '...'
                : item.description;
        
            descriptionElement.textContent = descriptionText;
            popupElement.textContent = item.description;
        }
        

        // Додавання імені автора або "команда СУМ", якщо автор не вказаний
        const authorElement = document.createElement('p');
        authorElement.classList.add('author');
        authorElement.textContent = `Автор(и): ${item.author || 'Команда СУМ'}`;

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
            if (item.hasOwnProperty('Link') && item.Link) {
                // Якщо є поле 'Link' в JSON і воно не пусте, використовуємо його
                translationButton.href = item.Link;
            } else {
                // В іншому випадку встановлюємо стандартне посилання
                translationButton.href = 'https://github.com/SKZGx/UA-Translation';
            } // Посилання на GitHub
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
    // Знайдіть елемент .description та додайте йому клас hide
    const description = itemContainer.querySelector('.description');
    if (description) {
        description.classList.add('hide');
    }
});

descriptionContainer.addEventListener('mouseleave', () => {
    popupElement.style.display = 'none';
    // Знайдіть елемент .description та видаліть з нього клас hide
    const description = itemContainer.querySelector('.description');
    if (description) {
        description.classList.remove('hide');
    }
});
    }
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

function loadAndDisplayNotCompletedData() {
    currentTab = 'notcompleted'; // Оновлюємо поточну вкладку в 'notcompleted'
    const notCompletedData = minecraftData.concat(gamesData).filter(item => item.completed === false);
    const startIndex = 0;
    const endIndex = displayedItems;

    const showMoreButton = document.getElementById('show-more-button');

    if (endIndex >= notCompletedData.length) {
        if (showMoreButton) {
            showMoreButton.style.display = 'none';
        }
    } else {
        if (showMoreButton) {
            showMoreButton.style.display = 'block';
        }
    }

    displayTranslations(notCompletedData.slice(startIndex, endIndex), 1, displayedItems);
}

// Оголосіть змінні для зберігання кількості відображених елементів і загальної кількості елементів
let displayedItems = 15;
let minecraftData = [];
let gamesData = [];
let notcompletedData = [];
let officialData = [];
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

function showNotCompletedTranslations() {
    currentTab = 'notcompleted'; // Встановлюємо поточну вкладку в 'notcompleted'
    displayedItems = 15; // Встановлюємо кількість відображених елементів
    loadAndDisplayData('notcompleted');
    loadAndDisplayNotCompletedData(); // Завантажуємо та відображаємо невиконані переклади
    setActiveTab(document.querySelector('.tab:nth-child(4)')); // Позначаємо вкладку "В роботі" як активну
}


function showOfficialTranslations() {
    currentTab = 'official'; // Встановлюємо поточну вкладку в 'official'
    displayedItems = 15; // Встановлюємо кількість відображених елементів

    // Отримуємо офіційні переклади з позначкою "verified": true
    const officialData = minecraftData.concat(gamesData).filter(item => item.verified === true);

    const startIndex = 0;
    const endIndex = displayedItems;

    const showMoreButton = document.getElementById('show-more-button');

    if (endIndex >= officialData.length) {
        if (showMoreButton) {
            showMoreButton.style.display = 'none';
        }
    } else {
        if (showMoreButton) {
            showMoreButton.style.display = 'block';
        }
    }

    // Викликаємо функцію displayTranslations для відображення офіційних перекладів
    displayTranslations(officialData.slice(startIndex, endIndex), 1, displayedItems);

    // Позначаємо вкладку "Офіційні" як активну
    const officialTab = document.querySelector('.tab:nth-child(5)');
    if (officialTab) {
        setActiveTab(officialTab);
    }
}


function setActiveOfficialTab() {
    // Встановлюємо поточну вкладку в 'official'
    currentTab = 'official';
    displayedItems = 15;
    loadAndDisplayData('official');

    // Знайти вкладку за її id та додати клас 'active'
    const officialTab = document.getElementById('tab-official');
    if (officialTab) {
        officialTab.classList.add('active');
    }
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
    } else if (tab === 'notcompleted') {
        dataToDisplay = notcompletedData;
    } else if (tab === 'official') {
        dataToDisplay = officialData;
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
    const overlay = document.querySelector('.overlay'); // Отримуємо елемент overlay

    // Показуємо анімацію завантаження перед початком завантаження карточок
    overlay.style.display = 'block';

    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            if (fileName === 'mods.json') {
                minecraftData = data;
            } else if (fileName === 'game.json') {
                gamesData = data;
            }

            // Приховуємо анімацію після завершення завантаження карточок
            overlay.style.display = 'none';

            loadAndDisplayData(currentTab);
        })
        .catch(error => {
            console.error(`Помилка завантаження JSON даних з файлу ${fileName}:`, error);
            // Приховуємо анімацію в разі помилки
            overlay.style.display = 'none';
        });
}




// Завантажити дані з файлу game.json при запуску сторінки
loadTranslationsFromFile('game.json', 1, displayedItems);

// Завантажити дані з файлу mods.json при запуску сторінки
loadTranslationsFromFile('mods.json', 1, displayedItems);

// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();
