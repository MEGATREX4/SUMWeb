// googling.js

// Function to fetch data
function fetchData(filePath) {
    // Replace this with your actual function to fetch data
    // Example using fetch:
    return fetch(filePath)
        .then(response => response.json())
        .then(data => data);
}

// Function to update meta keywords
function updateMetaKeywords(keywords) {
    const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (metaKeywordsTag) {
        metaKeywordsTag.content = keywords;
    }
}

// Function to combine and modify keywords
function combineAndModifyKeywords(otherData, modsData) {
    // Extract title lines from other.json and mods.json
    const otherTitles = otherData.map(item => [`${item.title} українською`, `${item.title} СУМ`, `${item.title}`, `скачать ${item.title}`, `завантажити ${item.title}`, `мод ${item.title}`]);
    const modsTitles = modsData.map(item => [`${item.title} українською`, `${item.title} СУМ`, `${item.title}`, `скачать ${item.title}`, `завантажити ${item.title}`, `мод ${item.title}`],);

    // Combine titles from both files
    const combinedTitles = [...otherTitles, ...modsTitles];

    // Combine all keywords
    const combinedKeywords = [...combinedTitles.flat(), 'українізація модів', 'MEGATREX4', 'СУМ МАЙНКРАФТ', 'СУМ 60 секунд', 'СУМ 60 seconds', 'MEGATREX4 переклад', 'MEGATREX4 стрім', 'спільнота українізації модів', 'СУМ', 'СУМ спільнота українізації модів', 'українізація модів', 'моди', 'майнкрафт моди', 'моди українською', 'моди майнкрафт українською', 'моди скачати', 'моди завантажити', 'моди майнкрафт завантажити', 'моди MEGATRE4', 'MEGATREX4 ютуб', 'MEGATREX4 Youtube', 'MEGATREX4 Twitch', 'геймінг', 'Minecraft', 'переклад модів', 'геймерська спільнота', 'українська мова', 'Crowdin', 'аматорський переклад', 'СУМ', 'Спільнота Українізації Модів', 'українські гравці', 'онлайн-ігри', 'грейдерське спільнота', 'модифікації для гри'];

    // Join keywords into a string
    const keywordsString = combinedKeywords.join(', ');

    return keywordsString;
}

// Function to fetch data and update meta keywords
function fetchDataAndUpdateKeywords() {
    try {
        // Replace these file paths with the actual paths for other.json and mods.json
        const otherFilePath = '/other.json'; // Adjust the path based on your file structure
        const modsFilePath = '/mods.json';   // Adjust the path based on your file structure

        // Fetch data from other.json and mods.json
        const otherData = fetchData(otherFilePath);
        const modsData = fetchData(modsFilePath);

        // Wait for both data to be fetched
        Promise.all([otherData, modsData])
            .then(([otherData, modsData]) => {
                // Combine and modify keywords
                const keywords = combineAndModifyKeywords(otherData, modsData);

                // Update meta keywords
                updateMetaKeywords(keywords);

                console.log('Script executed successfully!');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.error('Error in script execution:', error);
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchDataAndUpdateKeywords);
