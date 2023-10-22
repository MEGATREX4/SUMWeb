document.addEventListener('DOMContentLoaded', function () {
    // Define the function to change the active tab
    function changeTab(tabName) {
        // Change the active tab
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        selectedTab.classList.add('active');

        // Store the active tab in localStorage
        localStorage.setItem('activeTab', tabName);

        // Handle tab loading based on the clicked tab
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
        } else if (tabName === 'frommembers') {
            console.log('Loading from members data');
            loadAndDisplayFromMembersTranslations();
        } else if (tabName === 'about') {
            console.log('Loading about data');
            redirectToAboutPage();
        }
    }


    // Get the active tab from localStorage
    const activeTab = localStorage.getItem('activeTab');

    // Get the tab from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    // Set the active tab from the URL parameter or localStorage
    const targetTab = tabParam || activeTab;

    // Call the changeTab function to display the appropriate tab
    if (targetTab) {
        changeTab(targetTab);
    }

    // Get all necessary DOM elements
    const tabs = document.querySelectorAll('.tab');

    // Add event listeners for each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the value of the data-tab attribute of the tab
            const tabName = tab.getAttribute('data-tab');

            // Call the changeTab function to switch tabs
            changeTab(tabName);
        });
    });
});
