function displayTranslations(data) {
    const cardContainer = document.querySelector('.container-content #data-container');
    cardContainer.innerHTML = ''; // Очистити контейнер перед додаванням нових карточок

    data.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const imageElement = document.createElement('div');
        imageElement.classList.add('image');

        if (item.image === null) {
            imageElement.style.backgroundImage = `url('default-image.jpg')`;
        } else {
            imageElement.style.backgroundImage = `url('${item.image}')`;
        }

        const titleElement = document.createElement('h2');
        titleElement.textContent = item.title;
        titleElement.classList.add('title');

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

        // Додавання pop-up вікна перед описом
        itemContainer.appendChild(popupElement);

        imageContainer.appendChild(imageElement);
        itemContainer.appendChild(imageContainer);
        itemContainer.appendChild(titleElement);
        itemContainer.appendChild(descriptionElement);

        cardContainer.appendChild(itemContainer);

        // Додавання обробників подій для показу/приховування pop-up
        itemContainer.addEventListener('mouseenter', () => {
            popupElement.style.display = 'block';
        });

        itemContainer.addEventListener('mouseleave', () => {
            popupElement.style.display = 'none';
        });
    });
}

function showAllTranslations() {
    // Завантажити дані з файлів mods.json та game.json і комбінувати їх
    Promise.all([
        fetch('mods.json').then(response => response.json()),
        fetch('game.json').then(response => response.json())
    ]).then(data => {
        // Об'єднати дані з обох файлів
        const combinedData = [...data[0], ...data[1]];
        // Показати комбіновані дані
        displayTranslations(combinedData);
    }).catch(error => {
        console.error('Помилка завантаження JSON даних:', error);
    });
}

function showMinecraftTranslations() {
    // Завантажити дані з файлу mods.json
    fetch('mods.json')
        .then(response => response.json())
        .then(data => {
            // Показати дані з mods.json
            displayTranslations(data);
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних:', error);
        });
}

function showGamesTranslations() {
    // Завантажити дані з файлу game.json
    fetch('game.json')
        .then(response => response.json())
        .then(data => {
            // Показати дані з game.json
            displayTranslations(data);
        })
        .catch(error => {
            console.error('Помилка завантаження JSON даних:', error);
        });
}

// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();
