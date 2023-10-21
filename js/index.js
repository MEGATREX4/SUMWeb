// index.js
const tabs = document.querySelectorAll('.tab');

// Get the active tab from the URL parameter or set it to "all" by default
let activeTab = localStorage.getItem('activeTab') || 'all';

// Function to change the active tab and redirect the user
function changeTab(tabName) {
    // Change the active tab
    activeTab = tabName;

    // Save the active tab in the local browser storage
    localStorage.setItem('activeTab', activeTab);

    // Redirect the user to the appropriate page
    if (tabName === 'all') {
        console.log('Loading all data');
        showAllTranslations();
    } else if (tabName === 'minecraft') {
        console.log('Loading minecraft data');
        showMinecraftTranslations();
    } else if (tabName === 'games') {
        console.log('Loading games data');
        showGamesTranslations();
    } else if (tabName === 'notcompleted') {
        console.log('Loading notcompleted data');
        loadAndDisplayNotCompletedData();
    } else if (tabName === 'official') {
        console.log('Loading official data');
        loadOfficialData();
    } else if (tabName === 'about') {
        console.log('Loading about data');
        redirectToAboutPage();
    }
}

// Function to redirect to the "About" page
function redirectToAboutPage() {
    // Change the active tab to "about"
    changeTab('about');

    // Redirect the user to the "about.html" page
    window.location.href = '/about.html';
}

// Add click event listeners to each tab
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Get the data-tab attribute value
        const tabName = tab.getAttribute('data-tab');

        // Change the active tab and redirect the user
        changeTab(tabName);
    });
});

// Change the active tab to the appropriate one
changeTab(activeTab);

// Automatically change the active tab to "Official" or "Not Completed" if specified in the URL
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
