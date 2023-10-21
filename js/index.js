// Отримати всі елементи вкладок
const tabs = document.querySelectorAll('.tab');

// Отримати активну вкладку з локального сховища браузера або встановити значення "all" за замовчуванням
let activeTab = localStorage.getItem('activeTab') || 'all';

// Функція для зміни активної вкладки та переадресації користувача
function changeTab(tabName) {
    // Змініть активну вкладку
    activeTab = tabName;

    // Зберегти активну вкладку в локальному сховищі браузера
    localStorage.setItem('activeTab', activeTab);

    // Перенаправити користувача на потрібну сторінку
    if (activeTab === 'all') {
        showAllTranslations();
    } else if (activeTab === 'minecraft') {
        showMinecraftTranslations();
    } else if (activeTab === 'games') {
        showGamesTranslations();
    } else if (activeTab === 'notcompleted') {
        showNotCompletedTranslations();
    } else if (activeTab === 'official') {
        showOfficialTranslations();
    } else if (activeTab === 'about') {
        redirectToAboutPage();
    }

    // Додати виклики функцій завантаження даних тут
    if (activeTab === 'notcompleted') {
        loadAndDisplayNotCompletedData();
    } else if (activeTab === 'official') {
        loadOfficialData(); // Додайте функцію завантаження офіційних даних
    }
}


// Функція для перенаправлення на сторінку "Про нас"
function redirectToAboutPage() {
    // Змініть активну вкладку на "about"
    changeTab('about');

    // Перенаправити користувача на сторінку "about.html"
    window.location.href = '/about.html';
}

// Додайте обробник кліку для кожної вкладки
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Отримати значення атрибуту data-tab
        const tabName = tab.getAttribute('data-tab');

        // Змініть активну вкладку та перенаправте користувача
        changeTab(tabName);
    });
});

// Змініть активну вкладку на потрібну
changeTab(activeTab);

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam) {
        const tabToActivate = document.querySelector(`.tab[data-tab="${tabParam}"]`);
        if (tabToActivate) {
            tabToActivate.click();
        }
    }
});




