// item.js
let modsData;
let otherData;

$(document).ready(() => {
    // Function to get the item ID from the URL query parameter
    function getItemId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Function to fetch the item data based on the item ID
    async function fetchItemData(itemId) {
        try {
            const modsResponse = await $.getJSON('mods.json');
            const otherResponse = await $.getJSON('other.json');
    
            modsData = modsResponse;
            otherData = otherResponse;
    
            const allData = [...modsData, ...otherData];
    
            // Find the item with the given ID
            const selectedItem = allData.find(item => item.id === itemId);
    
            return { selectedItem, modsData, otherData };
        } catch (error) {
            console.error("Error fetching item data:", error);
            return null;
        }
    }

    // Function to get icon data from Icons.json
    function getIconData(statusClass) {
        // Replace this with the actual path to your Icons.json file
        const iconsJsonPath = 'icons.json';

        // Return a Promise for fetching and processing the icon data
        return fetch(iconsJsonPath)
            .then(response => response.json())
            .then(iconData => iconData[statusClass] || {})
            .catch(error => {
                console.error('Error fetching icon data:', error);
                return {};
            });
    }

    function trimLink(link) {
        // Remove "https://" if present
        let trimmedLink = link.replace(/^https?:\/\//, '');
    
        // Remove "www." if present
        trimmedLink = trimmedLink.replace(/^www./, '');
    
        // Check if the link is "store.steampowered.com"
        if (trimmedLink.startsWith("store.steampowered.com")) {
            return "Steam";
        }
    
        // Check if the link is "t.me"
        if (trimmedLink.startsWith("t.me")) {
            return "Telegram";
        }

        if (trimmedLink.startsWith("curseforge.com")) {
            return "CurseForge";
        }

        if (trimmedLink.startsWith("github.com")) {
            return "GitHub";
        }
    
        // Remove everything after the first "/"
        trimmedLink = trimmedLink.split('/')[0];
    
        // Remove everything after the first "." (e.g., "com", "net", "org")
        trimmedLink = trimmedLink.split('.')[0];
    
        // Capitalize the first letter
        trimmedLink = trimmedLink.charAt(0).toUpperCase() + trimmedLink.slice(1);
    
        return trimmedLink;
    }
    

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        } else {
          return text;
        }
      } 

// Function to generate link divs based on item links
function generateLinkDivs(links) {
    // Check if links array is empty or not
    if (links && links.length > 0 && links[0] !== "") {
        // Generate link divs for each link in the array
        const linkDivs = links.map(link => {
            const trimmedLink = trimLink(link);
            return `<div class="link gamelink" onclick="window.location.href='${link}'">${trimmedLink}</div>`;
        });
        // Join the generated link divs into a single string
        const linkHTML = linkDivs.join('');
        // Return the generated HTML string
        return linkHTML;
    } else {
        // Return a nothig if links field is not present, empty, or contains an empty string
        return '';
    }
}

// Function to generate translation divs based on item translation link and whether it's from mods.json
function generateTranslationDiv(translationLink, isMod, isVerified) {
    // Check if translationLink is empty or not
    if (translationLink && translationLink !== "") {
        // Generate translation div for the link
        const trimmedLink = trimLink(translationLink);
        const translationHTML = `<div class="link gamelink" onclick="window.location.href='${translationLink}'">${trimmedLink}</div>`;
        // Return the generated HTML string
        return translationHTML;
    }
    if (isMod && !isVerified) {
        // If the item is from mods.json and isVerified is false, link to GitHub
        return `<div class="link translationlink" onclick="window.location.href='https://github.com/SKZGx/UA-Translation'">GitHub</div>`;
    } else {
        // Return an empty string if translationLink is empty or if it's a mod with isVerified set to true
        return '';
    }
}


    // Determine if the item is from mods.json (you need to replace this with your actual logic)
    const isMod = true; // Replace this with the actual logic to determine if the item is from mods.json

    // Call the function to generate translation div
    const translationLink = ''; // Replace this with the actual translation link
    const translationDiv = generateTranslationDiv(translationLink);

    // Add the generated translation div to your HTML element
    $('#TranslationContainer').html(translationDiv);


    // Function to fetch category icons from ItemCategories.json
async function fetchCategoryIcons() {
    try {
        const iconsResponse = await fetch('ItemCategories.json');
        const iconsData = await iconsResponse.json();
        return iconsData;
    } catch (error) {
        console.error("Error fetching category icons:", error);
        return [];
    }
}


    // Function to update the item page with the fetched data
async function updateItemPage() {
    try {
        const itemId = getItemId();

        if (itemId) {
            const { selectedItem, modsData, otherData } = await fetchItemData(itemId);

            if (selectedItem) {
                document.title = "СУМ" + " - переклад " + selectedItem.title;

                const categoryIcons = await fetchCategoryIcons();

                    // Update meta description
                    const metaDescription = document.createElement('meta');
                    metaDescription.setAttribute('name', 'description');
                    metaDescription.setAttribute('content', selectedItem.description);
                    document.head.appendChild(metaDescription);
                    // Update og:description
                    const ogDescription = document.createElement('meta');
                    ogDescription.setAttribute('property', 'og:description');
                    ogDescription.setAttribute('content', truncateText(selectedItem.description, 120));
                    document.head.appendChild(ogDescription);

                    //update og:title
                    //update meta og:title
                    const ogTitle = document.createElement('meta');
                    ogTitle.setAttribute('property', 'og:title');
                    ogTitle.setAttribute('content', "СУМ" + " - переклад " + selectedItem.title);
                    document.head.appendChild(ogTitle);

                    //update og:image
                    //update meta og:image
                    // const ogImage = document.createElement('meta');
                    // ogImage.setAttribute('property', 'og:image');
                    // ogImage.setAttribute('content', selectedItem.image);
                    // document.head.appendChild(ogImage);

                    // update meta twitter:image
                    // const twitterImage = document.createElement('meta');
                    // twitterImage.setAttribute('name', 'twitter:image');
                    // twitterImage.setAttribute('content', selectedItem.image);
                    // document.head.appendChild(twitterImage);
                    
                    //update meta twitter:description
                    const twitterDescription = document.createElement('meta');
                    twitterDescription.setAttribute('name', 'twitter:description');
                    twitterDescription.setAttribute('content', truncateText(selectedItem.description, 120));
                    document.head.appendChild(twitterDescription);

                    //update meta twitter:title
                    const twitterTitle = document.createElement('meta');
                    twitterTitle.setAttribute('name', 'twitter:title');
                    twitterTitle.setAttribute('content', "СУМ" + " - переклад " + selectedItem.title);
                    document.head.appendChild(twitterTitle);

                // Create HTML string for tooltip content
                const tooltipContent = selectedItem.tooltip ? selectedItem.tooltip : (selectedItem.verified ? 'Переклад вже в грі! Завантаження додаткових файлів не потрібно. Насолоджуйтеся грою з українською локалізацією!' : '');

                // Create HTML string for tooltip
                const tooltipHTML = tooltipContent
                    ? `<div id="tooltip" class="tooltip">${tooltipContent}</div>`
                    : '';

                // Determine if the item is from mods.json
                const isMod = modsData.some(mod => mod.id === selectedItem.id);
                const isVerified = modsData.some(mod => mod.id === selectedItem.id && mod.verified);

                // Determine the game version text
                const gameVersionText = selectedItem.gameversion && selectedItem.gameversion.length > 0 ? `<p class="gameversion iteminfo">Версія гри: ${selectedItem.gameversion}</p>` : '';

                const engineText = selectedItem.engine && selectedItem.engine.length > 0 ? `<p class="engine iteminfo">Рушій: ${selectedItem.engine}</p>` : '';
                
                const categoriesText = selectedItem.categories && selectedItem.categories.length > 0 ? `
                    <div class="categories iteminfo">Категорії:&nbsp; 
                        ${selectedItem.categories.map(category => {
                            const categoryIcon = categoryIcons.find(icon => icon.title === category);
                            // Generate a random color within a range
                            const randomColor = getRandomDarkColor('#000000', '#FFFFFF', 0.5);
                            return `
                                <span class="category" style="background-color: ${categoryIcon ? categoryIcon.color : randomColor};">
                                    ${categoryIcon && categoryIcon.icon ? `<div class="category-icon">${categoryIcon.icon}</div>` : ''}
                                    ${category}
                                </span>`;
                        }).join('<i class="space"></i>')}
                    </div>` 
                : '';


                // Create HTML string for item data
                const itemHTML = `
                <div class="ItemContainerInfo">
                    <div class="TextImageContainer">
                    <div class="ItemTopContainer">
                        <div class="ItemImageContainer">
                            <div class="itemimage" style="background-image: url('${selectedItem.image}');" title="${selectedItem.title} Image" style="max-width: 100%;"></div>
                            <div id="IconContainer" class="IconContainer">
                                
                            </div>
                        </div>
                        <div class="ItemTextContainer">
                        

                            <h2 class="itemtitle">${selectedItem.title}</h2>
                            ${gameVersionText}
                            ${engineText}
                            ${categoriesText}
                            <p class="itemtranslator">Автори перекладу: ${selectedItem.author}</p>
                        </div>
                        </div>
                        <div class="ItemBottomContainer">
                        ${tooltipHTML}
                        <div class="itemdescriptioncont"><h2>Опис</h2>${generateDescriptionParagraphs(selectedItem.description)}</div>
                        <div class="buttonContainer">
                            ${generateLinkDivs(selectedItem.link)}
                            ${generateTranslationDiv(selectedItem.translation, isMod, isVerified)}
                        </div>

                        </div>
                    </div>
                </div>
            `;

                // Set innerHTML of the item container
                $('#ItemContainer').html(itemHTML);


                // Set innerHTML of the item container
                $('#ItemContainer').html(itemHTML);

                // Update the total translation count
                updateTotalTranslation(modsData, otherData);
                populateIconContainer(selectedItem, modsData, otherData);

            } else {
                document.title = "Йой, халепа";

                // No item ID provided, display a default image
                const defaultItemHTML = `
                    <div class="ItemContainerInfo">
                        <img src="https://i.imgur.com/yXSBdgZ.png" height="300px" alt="Зображення ''щось не так''">
                        <div class="text404">Йой, халепа, щось сталось не так.</div>
                        <div class="text404">Такої сторінки не знайдено.</div>
                        <a href="index" class="button404">Перейти на головну</a>
                    </div>
                `;
                $('#ItemContainer').html(defaultItemHTML);
            }
        } else {
            document.title = "Йой, халепа";
            // No item ID provided, display a default image
            const defaultItemHTML = `
                <div class="ItemContainerInfo">
                <div class="error404">
                    <img src="https://i.imgur.com/yXSBdgZ.png" height="300px" alt="Зображення ''щось не так''">
                    <div class="container404">
                    <div class="textcontainer404">
                    <div class="text404">Йой, халепа, щось сталось не так.</div>
                    <div class="text404">Такої сторінки не знайдено.</div></div>
                    <a href="index" class="button404">Перейти на головну</a>
                    </div>
                </div>
                </div>
            `;
            $('#ItemContainer').html(defaultItemHTML);
        }
    } catch (error) {
        console.error("Error updating item page:", error);
    }
}


    // Call the function to update the item page when the DOM is loaded
    updateItemPage();
});

// Function to generate a random color within a range and make it darker
function getRandomDarkColor(min, max, factor) {
    // Convert hex color strings to RGB arrays
    const minRGB = hexToRgb(min);
    const maxRGB = hexToRgb(max);
    
    // Generate random RGB values within the range
    const r = Math.floor(Math.random() * (maxRGB.r - minRGB.r + 1)) + minRGB.r;
    const g = Math.floor(Math.random() * (maxRGB.g - minRGB.g + 1)) + minRGB.g;
    const b = Math.floor(Math.random() * (maxRGB.b - minRGB.b + 1)) + minRGB.b;
    
    // Make the color darker by reducing each RGB component by a factor
    const darkR = Math.max(0, Math.floor(r * factor));
    const darkG = Math.max(0, Math.floor(g * factor));
    const darkB = Math.max(0, Math.floor(b * factor));
    
    // Convert RGB values back to hex color string
    return rgbToHex(darkR, darkG, darkB);
}

// Function to convert hex color string to RGB array
function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Function to convert RGB values to hex color string
function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function generateDescriptionParagraphs(description) {
    if (description && description.includes('\n')) {
        // Split the description by newline characters
        const paragraphs = description.split('\n');
        // Generate a <p> tag for each paragraph and join them together
        const paragraphHTML = paragraphs.map(paragraph => `<p class="itemdescription">${paragraph}</p>`).join('');
        // Return the generated HTML string
        return paragraphHTML;
    } else {
        // Return the description as a single <p> tag if no newline characters are present
        return `<p class="itemdescription">${description}</p>`;
    }
}


// Function to update the total translation count
function updateTotalTranslation(mods, other) {
    try {
      const totalTranslationSpan = document.getElementById('TotalTranslation');
  
      if (totalTranslationSpan) {
        const totalTranslations = mods.length + other.length;
        totalTranslationSpan.textContent = `Ми переклали: ${totalTranslations}`;
      } else {
        console.error("Error: TotalTranslation span not found!");
      }
    } catch (error) {
      console.error("Error updating total translation:", error);
    }
  }
  
  // Call the function after ensuring modsData and otherData are defined
  if (modsData && otherData) {
    updateTotalTranslation(modsData, otherData);
  }
  
// Function to get status classes based on certain conditions
function getStatusClasses(selectedItem, modsData, otherData) {
    try {
        // Initialize an array to store status classes
        const statusClasses = [];

        // Add status classes based on item properties or conditions
        if (selectedItem.verified === true) {
            statusClasses.push('verified');
        } else if (selectedItem.semiverified === true) {
            statusClasses.push('semiverified');
        }
        if (selectedItem.completed === false) {
            statusClasses.push('completed');
        }
        // Add more conditions as needed

        // Check if the mod exists in modsData
        const modExistsInModsData = modsData.some(modData => modData.id === selectedItem.id);
        // Check if the mod exists in otherData
        const modExistsInOtherData = otherData.some(otherMod => otherMod.id === selectedItem.id);
          
        if (modExistsInModsData) {
          statusClasses.push('minecraft');
        } else if (modExistsInOtherData) {
          statusClasses.push('other');
        }


        // Return the array of status classes
        return statusClasses;
    } catch (error) {
        console.error("Error getting status classes:", error);
        return []; // Return an empty array in case of error
    }
}


// Function to fetch icon data from icons.json
async function getIconData() {
    try {
        const iconsResponse = await fetch('icons.json');
        return await iconsResponse.json();
    } catch (error) {
        console.error("Error fetching icon data:", error);
        return null;
    }
}

function addIcons(iconsData, statusClasses) {
    try {
        // Check if iconsData is an object
        if (typeof iconsData === 'object' && iconsData !== null) {
            // Generate HTML for each icon
            const iconHTML = statusClasses.map(statusClass => {
                const icon = iconsData[statusClass];
                // Check if the icon object exists
                if (icon) {
                    // Use an <img> element to display the SVG icon
                    return `<div class="ItemIcons" style="background-image: url(&quot;${icon.icon}&quot;);" alt="${icon.title}" title="${icon.title}"></div>`;
                } else {
                    console.error(`Error: Icon for status class '${statusClass}' not found`);
                    return ''; // Return an empty string for missing icons
                }
            }).join('');

            // Append the generated HTML to IconContainer
            $('#IconContainer').html(iconHTML);
        } else {
            console.error("Error: iconsData is not an object");
        }
    } catch (error) {
        console.error("Error adding icons:", error);
    }
}

// Function to populate IconContainer with SVG icons from icons.json
async function populateIconContainer(selectedItem, modsData, otherData) {
    try {
        // Fetch icons data
        const iconsData = await getIconData();
        
        // Determine status classes for the item
        const statusClasses = getStatusClasses(selectedItem, modsData, otherData);
        
        // Add icons to the IconContainer
        addIcons(iconsData, statusClasses);
    } catch (error) {
        console.error("Error populating icon container:", error);
    }
}





