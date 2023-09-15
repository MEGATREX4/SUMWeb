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

    displayTranslations(officialData.slice(startIndex, endIndex), 1, displayedItems);

    // Позначаємо вкладку "Офіційні" як активну
    const officialTab = document.querySelector('.tab:nth-child(5)');
    if (officialTab) {
        setActiveTab(officialTab);
    }
}




