// googling.js

// Function to update meta keywords
function updateMetaKeywords(keywords) {
    const metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (metaKeywordsTag) {
        metaKeywordsTag.content = keywords;
    }
}

// Function to fetch data and update meta keywords
function fetchDataAndUpdateKeywords() {
    // Assuming you have a function to fetch data or access your JSON content
    const jsonData = fetchData(); // Replace with your actual function

    // Extract keywords from JSON data (replace this with your logic)
    const keywords = extractKeywordsFromData(jsonData);

    // Update meta keywords
    updateMetaKeywords(keywords);
}

// Call the function when the page loads
fetchDataAndUpdateKeywords();
