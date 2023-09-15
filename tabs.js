function changeTab(tabName) {
    // Змініть активну вкладку
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    selectedTab.classList.add('active');

    // Зберегти активну вкладку в локальному сховищі браузера
    localStorage.setItem('activeTab', tabName);

    // Змініть активну вкладку на потрібну
    changeTab(activeTab);
}

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

    // Встановити активну вкладку на сторінці
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const selectedTab = document.querySelector(`[data-tab="${activeTab}"]`);
    selectedTab.classList.add('active');

    // Тут ви можете викликати функції для відображення відповідного вмісту
}

// Викликати функцію для зміни активної вкладки
changeTab(activeTab);
