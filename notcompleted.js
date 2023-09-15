function showNotCompletedTranslations() {
    currentTab = 'notcompleted'; // Встановлюємо поточну вкладку в 'notcompleted'
    displayedItems = 15; // Встановлюємо кількість відображених елементів
    loadAndDisplayNotCompletedData(); // Завантажуємо та відображаємо невиконані переклади
    setActiveTab(document.querySelector('.tab:nth-child(4)')); // Позначаємо вкладку "В роботі" як активну
}

function loadAndDisplayNotCompletedData() {
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

function showNotCompleted() {
    currentTab = 'notcompleted'; // Встановлюємо поточну вкладку в 'notcompleted'
    displayedItems = 15; // Встановлюємо кількість відображених елементів

    // Отримуємо невиконані переклади
    const notCompletedData = minecraftData.concat(gamesData).filter(item => item.completed === false);

    // Викликаємо функцію для додавання класу .NotCompletedTab
    addNotCompletedTabClass();

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

    // Додамо клас .NotCompletedActive до вкладки "В роботі" при обранні
    const notCompletedTab = document.querySelector('.tab:nth-child(4)');
    if (notCompletedTab) {
        setActiveTab(notCompletedTab); // Позначаємо вкладку "В роботі" як активну
        notCompletedTab.classList.add('NotCompletedActive'); // Додаємо клас .NotCompletedActive
    }
}



