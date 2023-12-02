//script.js

function displayTranslations(data, currentPage, itemsPerPage) {
    const cardContainer = document.querySelector('.container-content #data-container');
    
    // Select and remove only the existing translation items
    const existingItems = cardContainer.querySelectorAll('.item');
    existingItems.forEach(item => {
        cardContainer.removeChild(item);
    });

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
    imageElement.style.backgroundImage = `url('https://i.ibb.co/wpwMCLY/default-image.png')`;
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
    
    if (item.description.length > 100) {
        popupElement.textContent = item.description;
    } else {
        popupElement.style.display = 'none'; // Приховувати pop-up, якщо текст менше 100 символів
    }
}
        const authorElement = document.createElement('p');
        authorElement.classList.add('author');
        authorElement.textContent = `Автор(и): ${item.author || 'Команда СУМ'}`;
        
        // Create a container div for the author and its scrolling effect
        const authorContainer = document.createElement('div');
        authorContainer.classList.add('author-container');
        
        // Add the author element to the author container
        authorContainer.appendChild(authorElement);
        authorElement.setAttribute('title', `Автор(и): ${item.author || 'Команда СУМ'}`);

        

        
        // Check if the author text has more than 27 characters and add the scrolling effect if true
        if (authorElement.textContent.length > 28) {
            authorContainer.classList.add('scrolling-text');
        }
        
        // Add the author container to the item container
        itemContainer.appendChild(authorContainer);
        // Додавання кнопки "Переклад" з посиланням на GitHub
        const translationButton = document.createElement('a');
        translationButton.classList.add('translation-button');
        translationButton.target = '_blank'; // Відкривати посилання в новій вкладці

        // Перевірка значення тегу 'completed'
        if (item.completed === false) {
            // Якщо 'completed' дорівнює false, встановлюємо текст кнопки "в процесі"
            translationButton.classList.add('notcompleted'); // Додаємо клас 'notcompleted'
            translationButton.setAttribute("id", "notcompleted");
            translationButton.href = item.Link || 'https://www.buymeacoffee.com/megatrex4';
            siteURL = item.Link || 'https://www.buymeacoffee.com/megatrex4';
            const siteName = extractSiteName(siteURL);
            translationButton.innerHTML = `В процесі&ensp; <span class="spantranslate">(${siteName})</span>`;
            translationButton.href = siteURL;


        } else {
            // Інакше встановлюємо текст кнопки "Переклад"
            translationButton.textContent = 'Переклад';
            if (item.hasOwnProperty('Link') && item.Link) {
                const siteURL = item.Link;
                const siteName = extractSiteName(siteURL);
                translationButton.innerHTML = `Переклад&ensp; <span class="spantranslate">(${siteName})</span>`;
                translationButton.href = siteURL;
            } else {
                // В іншому випадку встановлюємо стандартне посилання
                translationButton.href = 'https://github.com/SKZGx/UA-Translation';
                siteURL = 'https://github.com/SKZGx/UA-Translation';
                const siteName = extractSiteName(siteURL);
                translationButton.innerHTML = `Переклад&ensp; <span class="spantranslate">(${siteName})</span>`;
                translationButton.href = siteURL;
            }
            
 // Посилання на GitHub
            
            if (item.hasOwnProperty('verified') && item.verified === true) {
                // Створити значок <i> для галочки
                
                const icon = document.createElement('i');
                if (item.hasOwnProperty('semiverified') && item['semiverified'] === true) {
                    itemContainer.id = 'semiverified';
                  } else {
                    itemContainer.id = 'verified';
                  }
                icon.classList.add('fa', 'fa-question-circle-o', 'translation-icon', 'left-icon'); // Додати класи для значка галочки
                
            
                // Додати обробник подій для показу підказки при наведенні
                icon.addEventListener('mouseenter', function () {
                    const tooltip = document.querySelector('.custom-tooltip');
                    if (tooltip) {
                        // Задати текст підказки відповідно до вашого потреби
                        tooltip.querySelector('.tooltip-content').textContent = item.tooltip || 'Ця відмітка означає що розробник додав переклад в свій продукт і він вже вбудований, нічого довантажувати і встановлювати не треба';
                        
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
        itemContainer.appendChild(authorContainer);
        
        itemContainer.appendChild(authorElement); // Додавання елементу із ім'ям автора або "команда СУМ"
        authorContainer.appendChild(authorElement);
        itemContainer.appendChild(translationButton); // Додавання кнопки "Переклад"

        cardContainer.appendChild(itemContainer);

// Додавання обробників подій для показу/приховування pop-up
descriptionContainer.addEventListener('mouseenter', () => {
    if (item.description.length > 100) {
        popupElement.style.display = 'block';
        // Знайдіть елемент .description та додайте йому клас hide
        const description = itemContainer.querySelector('.description');
        if (description) {
            description.classList.add('hide');
        }
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




function extractSiteName(url) {
    // Remove "https://", "http://", or "www." from the beginning
    let siteName = url.replace(/^(https?:\/\/)?(www\.)?/, '');

    // Remove everything after the first "/" or the top-level domain (e.g., ".com")
    siteName = siteName.replace(/\/|\.com.*/, '');

    return siteName;
}
















let displayedItems = 15;
let minecraftData = [];
let gamesData = [];
let notcompletedData = [];
let officialData = [];
let currentTab = 'all';
let frommembers = [];

function showTab(tabName) {
    currentTab = tabName;
    displayedItems = 15;
    loadAndDisplayData(tabName);

    // Find the corresponding tab element and add the 'active' class
    const tabElement = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabElement) {
        setActiveTab(tabElement);
    }
}

function showAllTranslations() {
    showTab('all');
}

function showGamesTranslations() {
    showTab('games');
}

function showMinecraftTranslations() {
    showTab('minecraft');
}

function showNotCompletedTranslations() {
    showTab('notcompleted');
    loadAndDisplayNotCompletedData();
}

function showFromMembersTranslations(){
    showTab('frommembers');
    showFromMembersTranslations();
}


function showOfficialTranslations() {
    currentTab = 'official';
    displayedItems = 15;
    
    // Filter the official translations based on the "verified" property
    officialData = minecraftData.concat(gamesData).filter(item => item.verified === true);
    
    // Update the visibility of the "Show More" button
    const showMoreButton = document.getElementById('show-more-button');
    if (showMoreButton) {
        showMoreButton.style.display = displayedItems >= officialData.length ? 'none' : 'block';
    }
    
    // Display official translations
    displayTranslations(officialData.slice(0, displayedItems), 1, displayedItems);

    // Set the active tab to "official"
    const officialTab = document.querySelector('[data-tab="official"]');
officialTab.addEventListener('click', () => {
    setActiveOfficialTab();
});

    loadOfficialData();
}

function setActiveOfficialTab() {
    loadOfficialData(); // Call the loadOfficialData function instead of showOfficialTranslations
}






// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();

function loadAndDisplayData(tab) {
    const itemsPerPage = 15;
    let dataToDisplay = [];

    if (tab === 'games') {
        dataToDisplay = gamesData;
    } else if (tab === 'minecraft') {
        dataToDisplay = minecraftData;
    } else if (tab === 'notcompleted') {
        dataToDisplay = notcompletedData;
    } else if (tab === 'official') {
        dataToDisplay = officialData;
    } else if (tab === 'frommembers') {
        dataToDisplay = frommembers;
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

async function countElementsInJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        const data = await response.json();
        return data.length;
    } catch (error) {
        console.error('Error counting elements:', error);
        return 0;
    }
}

async function countTotalTranslations() {
    const modsCount = await countElementsInJSONFile('mods.json');
    const otherCount = await countElementsInJSONFile('other.json');

    const totalTranslations = modsCount + otherCount;

    // Display the total count in the specified element
    const translationCountElement = document.getElementById('translationCount');
    if (translationCountElement) {
        translationCountElement.textContent = totalTranslations;
    }
}

// Call the function to count and display the total translations
countTotalTranslations();




function loadOfficialData() {
    currentTab = 'official'; // Set the current tab to 'official'

    // You should provide the file paths for the official data files
    const officialDataFiles = [
        'other.json',
        'mods.json',
        // Add more file paths as needed
    ];

    // Fetch data from each official data file
    const requests = officialDataFiles.map(fileName => {
        return fetch(fileName)
            .then(response => response.json())
            .then(data => data);
    });

    // After all data is fetched, merge and filter it
    Promise.all(requests)
        .then(dataArray => {
            const mergedData = [].concat(...dataArray); // Merge data from different files
            officialData = mergedData.filter(item => item.verified === true); // Update officialData

            // Update the visibility of the "Show More" button
            const showMoreButton = document.getElementById('show-more-button');
            if (showMoreButton) {
                showMoreButton.style.display = displayedItems >= officialData.length ? 'none' : 'block';
            }

            // Display official translations
            displayTranslations(officialData.slice(0, displayedItems), 1, displayedItems);
        })
        .catch(error => {
            console.error('Error loading official data:', error);
        });
}


function loadAndDisplayNotCompletedData() {
    currentTab = 'notcompleted'; // Set the current tab to 'notcompleted'

    // You should provide the file paths for the not completed data files
    const notCompletedDataFiles = [
        'other.json',
        'mods.json',
        // Add more file paths as needed
    ];

    // Fetch data from each not completed data file
    const requests = notCompletedDataFiles.map(fileName => {
        return fetch(fileName)
            .then(response => response.json())
            .then(data => data);
    });

    // After all data is fetched, merge and filter it
    Promise.all(requests)
        .then(dataArray => {
            const mergedData = [].concat(...dataArray); // Merge data from different files
            const notCompletedData = mergedData.filter(item => item.completed === false);

            // Update the visibility of the "Show More" button
            const showMoreButton = document.getElementById('show-more-button');
            if (showMoreButton) {
                showMoreButton.style.display = displayedItems >= notCompletedData.length ? 'none' : 'block';
            }

            // Display not completed translations
            displayTranslations(notCompletedData.slice(0, displayedItems), 1, displayedItems);
        })
        .catch(error => {
            console.error('Error loading not completed data:', error);
        });
}



function loadAndDisplayFromMembersTranslations() {
    // Set the current tab to 'frommembers'
    
    currentTab = 'frommembers';

    // Define the file paths for the data
    const frommembersFiles = [
        'other.json',
        'mods.json',
        // Add more file paths as needed
    ];
    

    // Fetch data from each data file
    const requests = frommembersFiles.map(fileName => {
        return fetch(fileName)
            .then(response => response.json())
            .then(data => data);
    });

    // After all data is fetched, merge and filter it
    Promise.all(requests)
        .then(dataArray => {
            const mergedData = [].concat(...dataArray); // Merge data from different files

            // Filter the data to show items from members
            const frommembers = mergedData.filter(item => {
                const author = item.author ? item.author.toLowerCase() : '';
                return author !== '' && author.toLowerCase() !== 'команда сум';
            });
            
            // Update the visibility of the "Show More" button
            const showMoreButton = document.getElementById('show-more-button');
            if (showMoreButton) {
                showMoreButton.style.display = displayedItems >= frommembers.length ? 'none' : 'block';
            }
            

            // Display translations from members
            displayTranslations(frommembers.slice(0, displayedItems), 1, displayedItems);

            // Set the active tab to "frommembers"
            setActiveTab(document.querySelector('[data-tab="frommembers"]'));

            // Update the URL with the tab parameter
            history.pushState(null, null, `?tab=frommembers`);
        })
        .catch(error => {
            console.error('Error loading from members data:', error);
        });
}





// Додайте обробник події для кнопки "Показати більше"
// Add this event listener for the "Show More" button
// Add this event listener for the "Show More" button
const showMoreButton = document.getElementById('show-more-button');
if (showMoreButton) {
    showMoreButton.addEventListener('click', () => {
        displayedItems += 15; // Increase the number of displayed items

        // Load and display more data based on the current tab
        if (currentTab === 'frommembers') {
            // Load more items for the "frommembers" tab
            loadAndDisplayFromMembersTranslations();
        } else {
            // Load more items for other tabs
            loadAndDisplayData(currentTab);
        }
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

// Add this function to show the loading animation
function showLoadingAnimation() {
    const overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
}

// Modify your existing loadTranslationsFromFile function
function loadTranslationsFromFile(fileName, currentPage, itemsPerPage) {
    // Show loading animation
    showLoadingAnimation();

    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            if (fileName === 'mods.json') {
                minecraftData = data;
            } else if (fileName === 'other.json') {
                gamesData = data;
            }
            displayedItems = 15;
            // Hide loading animation after loading the data
            const overlay = document.querySelector('.overlay');
            overlay.style.display = 'none';

            loadAndDisplayData(currentTab);
        })
        .catch(error => {
            console.error(`Error loading JSON data from file ${fileName}:`, error);

            // Hide loading animation in case of an error
            const overlay = document.querySelector('.overlay');
            overlay.style.display = 'none';
        });
}





// Завантажити дані з файлу other.json при запуску сторінки
loadTranslationsFromFile('mods.json', 1, displayedItems);

// Завантажити дані з файлу mods.json при запуску сторінки
loadTranslationsFromFile('other.json', 1, displayedItems);

// Відображення всіх перекладів за замовчуванням при завантаженні сторінки
showAllTranslations();
showTab('all');
