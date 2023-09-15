// Додайте цей код у функцію changeTabAbout
function changeTabAbout(tabName) {
    // Змініть активну вкладку
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    selectedTab.classList.add('active');

    // Виконайте автоматичне відкриття вкладки
    autoOpenTab(tabName);

    // Зберегти активну вкладку в локальному сховищі браузера
    localStorage.setItem('activeTab', tabName);

    // Перенаправити користувача на потрібну сторінку
    window.location.href = '/index.html?tab=' + tabName;
}


function changeTabAbout(tabName) {
    // Змініть активну вкладку
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    selectedTab.classList.add('active');

    // Виконайте автоматичне відкриття вкладки
    autoOpenTab(tabName);

    // Зберегти активну вкладку в локальному сховищі браузера
    localStorage.setItem('activeTab', tabName);

    // Перенаправити користувача на потрібну сторінку
    window.location.href = '/index.html?tab=' + tabName;
}

function autoOpenTab(tabName) {
    switch (tabName) {
        case 'all':
            showAllTranslations();
            break;
        case 'minecraft':
            showMinecraftTranslations();
            break;
        case 'games':
            showGamesTranslations();
            break;
        case 'notcompleted':
            showNotCompletedTranslations();
            break;
        case 'official':
            showOfficialTranslations();
            break;
        default:
            // Виконати дії за замовчуванням, якщо вкладка не відома
            break;
    }
}
