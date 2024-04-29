document.addEventListener("DOMContentLoaded", function() {
    // Get the contents div
    var contentsDiv = document.querySelector(".contents");

    // Create HTML for the Table of Contents title
    var tocTitleHTML = '<div class="toctitle" onclick="toggleTOC()"><p><i class="fa fa-bars" aria-hidden="true"></i> Зміст</p></div>';

    // Create HTML for the unordered list to hold the Table of Contents
    var tocListHTML = '<div class="tocListContainer"><ul id="tocList" style="display: block;">';

    // Initialize variables for creating unique anchor IDs
    var headerTexts = {};

    // Get all the header elements inside the paragraph
    var headers = document.querySelectorAll(".paragraph h2, .paragraph h3, .paragraph h4");

    // Loop through each header element
    headers.forEach(function(header) {
        // Skip the h2 header
        if (header.tagName.toLowerCase() === "h2" && header.textContent.trim() === "Часті запитання") {
            return;
        }

        // Generate a unique anchor ID for the header
        var headerText = header.textContent.trim();
        var anchorID = headerText.toLowerCase().replace(/\s+/g, "-");
        var originalAnchorID = anchorID;
        var suffix = 1;
        while (headerTexts[anchorID]) {
            anchorID = originalAnchorID + "-" + suffix;
            suffix++;
        }
        headerTexts[anchorID] = true;

        // Set the ID attribute of the header to the generated anchor ID
        header.setAttribute("id", anchorID);

        // Determine the header level and add corresponding classes
        var degreeClass = "";
        if (header.tagName.toLowerCase() === "h2") {
            degreeClass = "third-degree";
        } else if (header.tagName.toLowerCase() === "h3") {
            degreeClass = "second-degree";
        } else if (header.tagName.toLowerCase() === "h4") {
            degreeClass = "first-degree";
        }

        // Create HTML for the list item and link to the header
        var listItemHTML = '<li class="' + degreeClass + '"><a href="#' + anchorID + '">' + headerText + '</a></li>';

        // Append the HTML for the list item to the Table of Contents list
        tocListHTML += listItemHTML;
    });

    // Close the HTML for the unordered list
    tocListHTML += '</ul></div>';

    // Combine the HTML for the Table of Contents title and list
    var tocHTML = tocTitleHTML + tocListHTML;

    // Set the contents div innerHTML to the combined HTML
    contentsDiv.innerHTML = tocHTML;
});

// Function to toggle visibility of Table of Contents
function toggleTOC() {
    var tocList = document.getElementById("tocList");
    if (tocList.style.display === "block") {
        tocList.style.display = "none";
    } else {
        tocList.style.display = "block";
    }
}
