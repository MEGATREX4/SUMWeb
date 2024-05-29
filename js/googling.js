// googling.js

// Function to fetch data
async function fetchData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Error fetching data from ${filePath}`);
    }
    return response.json();
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
    const generateTitles = (data) => data.map(item => [
        `${item.title} СУМ, ${item.title} українською`, `${item.title} СУМ`, `${item.title}`,
        `скачать ${item.title}`, `завантажити ${item.title}`, `мод ${item.title}`
    ]);

    const otherTitles = generateTitles(otherData);
    const modsTitles = generateTitles(modsData);

    const combinedTitles = [...otherTitles, ...modsTitles];
    const additionalKeywords = [
        'українізація модів', 'MEGATREX4', 'СУМ МАЙНКРАФТ', 'СУМ 60 секунд', 'СУМ 60 seconds', 
        'MEGATREX4 переклад', 'MEGATREX4 стрім', 'спільнота українізації модів', 'СУМ', 
        'СУМ спільнота українізації модів', 'моди', 'майнкрафт моди', 'моди українською', 
        'моди майнкрафт українською', 'моди скачати', 'моди завантажити', 'моди майнкрафт завантажити', 
        'моди MEGATRE4', 'MEGATREX4 ютуб', 'MEGATREX4 Youtube', 'MEGATREX4 Twitch', 'геймінг', 
        'Minecraft', 'переклад модів', 'геймерська спільнота', 'українська мова', 'Crowdin', 
        'аматорський переклад', 'українські гравці', 'онлайн-ігри', 'грейдерське спільнота', 
        'модифікації для гри'
    ];

    const combinedKeywords = [...combinedTitles.flat(), ...additionalKeywords];
    return combinedKeywords.join(', ');
}

// Function to fetch data and update meta keywords
async function fetchDataAndUpdateKeywords() {
    try {
        const otherFilePath = '/other.json'; // Adjust the path based on your file structure
        const modsFilePath = '/mods.json';   // Adjust the path based on your file structure

        const [otherData, modsData] = await Promise.all([
            fetchData(otherFilePath), 
            fetchData(modsFilePath)
        ]);

        const keywords = combineAndModifyKeywords(otherData, modsData);
        updateMetaKeywords(keywords);

        console.log('Script executed successfully!');
    } catch (error) {
        console.error('Error in script execution:', error);
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchDataAndUpdateKeywords);
