//tabs.js
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
    changeTab(activeTab); // Це оголошення функції changeTab
}

//tabs.js
document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі необхідні елементи DOM
    const tabs = document.querySelectorAll('.tab');
    
    // Додаємо обробник подій для кожної вкладки
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Отримуємо значення атрибута data-tab вкладки
            const tabName = tab.getAttribute('data-tab');
            
            // Викликаємо функцію зміни вкладки
            changeTab(tabName);
        });
    });
});
