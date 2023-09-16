// Отримання вкладки з URL
function getTabFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabName = urlParams.get('tab');
    return tabName || 'all'; // За замовчуванням "all", якщо параметр "tab" в URL не знайдено
}

// Функція визначення активної вкладки і виклику відповідної функції
function handleActiveTab() {
    const activeTabName = getTabFromURL();
    switch (activeTabName) {
        case 'games':
            showGamesTranslations();
            break;
        case 'minecraft':
            showMinecraftTranslations();
            break;
        case 'notcompleted':
            showNotCompletedTranslations();
            break;
        case 'official':
            showOfficialTranslations();
            break;
        default:
            showAllTranslations();
            break;
    }
}

// Виклик функції handleActiveTab для визначення активної вкладки
handleActiveTab();



