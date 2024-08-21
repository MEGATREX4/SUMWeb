//showcards.js


let pageSize;
let allData;
let currentPage;
let modsData;
let otherData;
let filteredData;
let selectedCategories = new Set();

function createModCard(mod) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Call getStatusClasses with modsData and otherData
  let statusClasses = getStatusClasses(mod, modsData, otherData);

  // Only add the status classes if they are not empty
  if (statusClasses.length > 0) {
    statusClasses.forEach(statusClass => {
      card.classList.add(statusClass); // Add each status class to the card
    });
  }

  card.id = `${mod.id}`;

  // Populate the card with mod data
  card.innerHTML = `
    <div class="TopCardContainer">
      <div class="cardimage" style="background-image: url('${mod.image}')" title="Зображення ${mod.title}" style="max-width: 100%;"></div>
      <div id="${mod.id}" class="textContainer">
        <h2 title="${mod.title} українською" class="modtitle">${truncateText(mod.title, 35)}</h2>
        <p>від <span title="${mod.author}" class="author">${truncateText(mod.author, 35)}</span></p>
      </div>
    </div>
  `;

  // Add click event listener to redirect to the item page
  card.addEventListener('click', () => {
    window.location.href = `item.html?id=${mod.id}`;
  });

  // Append the card to the CardsContainer
  document.querySelector('.CardsContainer').appendChild(card);

  // Add description block
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description-container');
  card.appendChild(descriptionContainer);

  // Preprocess the Markdown content to remove unwanted elements
  const cleanedDescription = mod.description
    .replace(/^-{3,}\s*$/gm, ' ')               // Remove horizontal rules
    
    .replace(/!\[.*?\]\(.*?\)/g, ' ')           // Remove image links in Markdown
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')        // Treat regular Markdown links as plain text
    .replace(/!\[.*?\]\s*/g, ' ')               // Remove any remaining image Markdown syntax
    .replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|heic|ico|tif)(\?[^\s]*)?/gi, '') // Remove direct image URLs with extensions
    .replace(/https?:\/\/[^\s]+/gi, '')       // Remove any remaining URLs
    .replace(/\*\*\*\*(.*?)\*\*\*\*/g, '$1')  // Remove bold markdown syntax (****text****)
    .replace(/\*\*(.*?)\*\*/g, '$1')          // Remove bold markdown syntax (**text**)
    .replace(/^\s+/g, ' ')                     // Remove all spaces at the beginning of the string
    .replace(/\r\n/g, ' ')                     // Remove line breaks
    .replace(/\n/g, ' ')                      // Remove line breaks
    .replace(/#+/g, ' ')                      // Remove headings;


  // Trim the description to 100 characters after cleaning
  const trimmedDescription = cleanedDescription.length > 100 ? cleanedDescription.substring(0, 100) + '...' : cleanedDescription;

  // Convert Markdown to HTML using marked
  const markdownHTML = marked.parse(trimmedDescription);

  // Create a new paragraph element for the description
  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.classList.add('short-description');
  descriptionParagraph.innerHTML = markdownHTML;

  // Append the description paragraph to the description container
  descriptionContainer.appendChild(descriptionParagraph);

  // Add icon container
  if (statusClasses.length > 0) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('IconContainer');
    card.appendChild(iconContainer);

    // Use Promise to get icon data and add icons to the container
    addIcons(iconContainer, statusClasses);
  }
}






// Function to get the status classes based on mod properties and type
function getStatusClasses(mod, modsData, otherData) {
  const statusClasses = [];

  if (mod.completed === false) {
    statusClasses.push('completed');
  } else if (mod.semiverified === true) {
    statusClasses.push('semiverified');
  } else if (mod.verified === true) {
    statusClasses.push('verified');
  }

  // Check if the mod exists in modsData
  const modExistsInModsData = modsData.some(modData => modData.id === mod.id);
  // Check if the mod exists in otherData
  const modExistsInOtherData = otherData.some(otherMod => otherMod.id === mod.id);

  if (modExistsInModsData) {
    statusClasses.push('minecraft');
  } else if (modExistsInOtherData) {
    statusClasses.push('other');
  }

  // Return an array of status classes
  return statusClasses;
}

let cachedIconData = null;

// Function to get icon data from Icons.json
function getIconData(statusClasses) {
  if (cachedIconData) {
    return Promise.resolve(filterIconsByStatusClasses(cachedIconData, statusClasses));
  }

  // Replace this with the actual path to your Icons.json file
  const iconsJsonPath = 'icons.json';

  return fetch(iconsJsonPath)
    .then(response => response.json())
    .then(iconData => {
      cachedIconData = iconData;
      return filterIconsByStatusClasses(iconData, statusClasses);
    })
    .catch(error => {
      console.error('Error fetching icon data:', error);
      return [];
    });
}

// Helper function to filter icons based on status classes
function filterIconsByStatusClasses(iconData, statusClasses) {
  const icons = [];
  statusClasses.forEach(statusClass => {
    const icon = iconData[statusClass];
    if (icon && icon.icon) {
      icons.push(icon);
    }
  });
  return icons;
}

// Function to add icons based on files and status
function addIcons(element, statusClasses) {
  // Use Promise to get icon data
  getIconData(statusClasses).then(icons => {
    icons.forEach(iconData => {
      const iconContainer = document.createElement('div');
      iconContainer.title = iconData.title || '';
      iconContainer.style.backgroundImage = `url("${iconData.icon}")`;
      iconContainer.classList.add('ItemIcons', `${iconData.class}Icon`);
      element.appendChild(iconContainer);
    });
  });
}


function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
}


// Function to display cards based on the current page and data
function displayCards(currentPage, pageSize, data) {
  // Sort the data by ID
  data.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentData = data.slice(startIndex, endIndex);

  // Check if the container exists before setting innerHTML
  const cardsContainer = document.querySelector('.CardsContainer');
  if (cardsContainer) {
    // Clear existing cards
    cardsContainer.innerHTML = '';

    if (currentData.length > 0) {
      //remove createCardFlex
      cardsContainer.classList.remove('createCardFlex');
      currentData.forEach(item => createModCard(item)); // Replace createCard with createModCard
    } else {
      // remove from id createCard class createCard and add createCardFlex to it
      cardsContainer.classList.add('createCardFlex');

      cardsContainer.innerHTML = `
      <div class="ItemContainerInfo">
            <img src="https://i.imgur.com/yXSBdgZ.png" height="300px" alt="Зображення ''щось не так''">
            <div class="text404">Дідько, щось сталось не так.</div>
            <div class="text404">Спробуйте змінити фільтри.</div>

        </div>`;
    }
  } else {
    console.error("Error: Cards container not found!");
  }
}


// Function to display page numbers
function displayPageNumber(pageNumber, isActive) {
  const pagesContainer = document.getElementById('Pages');

  const pageElement = document.createElement('div');
  pageElement.classList.add('page-number');
  if (isActive) {
    pageElement.classList.add('ActivePage');  // Add ActivePage class if the page is active
  }
  pageElement.textContent = pageNumber;

  pageElement.addEventListener('click', () => navigatePage(pageNumber, totalPages));

  pagesContainer.appendChild(pageElement);
}

// Function to update the number of pages and display page navigation
function updatePageNavigation(currentPage, pageSize, filteredData) {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagesContainer = document.getElementById('Pages');

  pagesContainer.innerHTML = ''; // Clear existing navigation buttons

  const displayPageNumber = (pageNumber) => {
    const isActive = pageNumber === currentPage;
    pagesContainer.innerHTML += `
      <div class="page-number ${isActive ? 'ActivePage' : ''}" onclick="navigatePage(${pageNumber}, ${totalPages})">${pageNumber}</div>
    `;
  };

  const displayEllipsis = () => {
    pagesContainer.innerHTML += `
      <div class="ellipsis">...</div>
    `;
  };

  const displayLastPage = () => {
    const isActive = totalPages === currentPage; // Check if it's the last page
    pagesContainer.innerHTML += `
      <div class="page-number ${isActive ? 'ActivePage' : ''}" onclick="navigatePage(${totalPages}, ${totalPages})">${totalPages}</div>
    `;
  };

  // Display the first page number
  displayPageNumber(1);

  if (currentPage > 4) {
    displayEllipsis();
  }

  for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
    displayPageNumber(i);
  }

  if (currentPage < totalPages - 3 && totalPages > 5) {
    displayEllipsis();
  }

  if (totalPages > 1) {
    displayLastPage();
  }
}




// Function to navigate between pages
function navigatePage(newPage, totalPages) {
  if (!isNaN(newPage) && newPage >= 1) {
      // Ensure the requested page is within valid bounds
      const targetPage = Math.min(newPage, totalPages);
      if (targetPage !== currentPage) {
          currentPage = targetPage;  // Update currentPage
          updateURL(currentPage);  // Update the URL before updating the content
          displayCards(currentPage, pageSize, filteredData); // Use filteredData
          updatePageNavigation(currentPage, pageSize, filteredData);
      }
  } else {
      // Display error message for non-numeric or invalid page number
      displayErrorMessage();
  }
}



function getUniqueAuthors(mods, other) {
  const modsAuthors = mods.flatMap(mod => mod.authors || []);
  const otherAuthors = other.flatMap(item => item.authors || []);
  const allAuthors = [...new Set([...modsAuthors, ...otherAuthors])];
  
  return allAuthors;
}


// Add this function to update the list of authors in the HTML
function updateAuthorsList(authors) {
  const authorsContainer = document.querySelector('.AuthorsContainer');
  authorsContainer.innerHTML = ''; // Clear existing authors

  authors.forEach(author => {
    const authorElement = document.createElement('div');
    authorElement.innerText = author;
    authorsContainer.appendChild(authorElement);
  });
}




function FetchFilterIcons() {
  const iconsJsonPath = 'icons.json';

  return fetch(iconsJsonPath)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching filter icons:', error);
      return {};
    });
}




const filterDisplayNames = {
  Mods: { name: 'Моди', icon: 'icon/minecraft.svg', title: 'Моди' },
  Other: { name: 'Інші', icon: 'icon/other.svg', title: 'Інші' },
  Official: { name: 'Офіційні', icon: 'icon/verified.svg', title: 'Офіційні' },
  FromMembers: { name: 'Від учасників', icon: 'icon/frommembers.svg', title: 'Від учасників' },
  NotCompleted: { name: 'У роботі', icon: 'icon/completed.svg', title: 'У роботі' },
};


function toggleModsOtherCheckbox() {
  const modsCheckbox = document.querySelector('input[value="Mods"]');
  const otherCheckbox = document.querySelector('input[value="Other"]');
  
  if (modsCheckbox && otherCheckbox) {
    modsCheckbox.addEventListener('change', () => {
      if (modsCheckbox.checked) {
        otherCheckbox.checked = false;
        handleFilterSelection();
      }
    });
  
    otherCheckbox.addEventListener('change', () => {
      if (otherCheckbox.checked) {
        modsCheckbox.checked = false;
        handleFilterSelection();
      }
    });
  }
}

function createFilterInputs(authors) {
  const filtersContainer = document.querySelector('.FiltersContainer');
  const filtredContainer = document.querySelector('.filtred');
  const filtersForm = document.createElement('form'); // Create form element
  filtersForm.classList.add('filters-form'); // Add class to form
  filtersForm.id = 'filtersForm'; // Add id to form

  const filters = Object.keys(filterDisplayNames);

  const modsHeader = document.createElement('div');
  modsHeader.textContent = 'Тип контенту';
  modsHeader.classList.add('filter-header');
  filtersForm.appendChild(modsHeader);

  const modsContainer = document.createElement('div');
  modsContainer.classList.add('mods-container');
  filtersForm.appendChild(modsContainer);

  const otherContainer = document.createElement('div');
  otherContainer.classList.add('other-container');
  filtersForm.appendChild(otherContainer);

  const otherHeader = document.createElement('div');
  otherHeader.textContent = 'Розширені';
  otherHeader.classList.add('filter-header');
  filtersForm.appendChild(otherHeader);

  filters.forEach(filter => {
    const filterContainer = document.createElement('div');
    filterContainer.classList.add(`${filter.toLowerCase()}`, 'filter');
  
    const input = document.createElement('input');
    input.type = filter === 'Mods' || filter === 'Other' ? 'checkbox' : 'checkbox';
    input.name = filter === 'Mods' || filter === 'Other' ? 'modsOrOther' : null;
    input.id = filter.toLowerCase();
    input.value = filter;
  
    input.addEventListener('change', () => handleFilterSelection());
  
    const div = document.createElement('div');
    div.classList.add('filter-icon');
    div.innerHTML = `<div class="ItemIcons" style="background-image: url(&quot;${filterDisplayNames[filter].icon}&quot;);" title="${filterDisplayNames[filter].title}"></div><label for="${filter.toLowerCase()}">${filterDisplayNames[filter].name}</label>`;
    divFor = filter.toLowerCase();
  
    filterContainer.appendChild(input);
    filterContainer.appendChild(div);
  
    if (filter === 'Mods') {
      modsContainer.appendChild(filterContainer);
    } else if (filter === 'Other') {
      otherContainer.appendChild(filterContainer);
    } else {
      filtersForm.appendChild(filterContainer); // Append filter container to form
    }
  });
  

  authors.forEach(author => {
    const authorCheckbox = document.createElement('input');
    authorCheckbox.type = 'checkbox';
    authorCheckbox.name = 'authors';
    authorCheckbox.value = author;

    authorCheckbox.addEventListener('change', () => handleFilterSelection());

    const authorLabel = document.createElement('label');
    authorLabel.textContent = author;

    filtersForm.appendChild(authorCheckbox); // Append author checkbox to form
    filtersForm.appendChild(authorLabel); // Append author label to form
  });

  filtredContainer.appendChild(filtersForm); // Append form to filtred container

  const selectedFilters = sessionStorage.getItem('selectedFilters');
  if (selectedFilters) {
    const filters = selectedFilters.split('&');
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
      }
    });
  }
}








function updateTotalTranslation(mods, other) {
  try {
    const totalTranslationSpan = document.getElementById('TotalTranslation');

    if (totalTranslationSpan) {
      const totalTranslations = mods.length + other.length;
      totalTranslationSpan.textContent = `Спільнота переклала: ${totalTranslations}`;
    } else {
      console.error("Error: TotalTranslation span not found!");
    }
  } catch (error) {
    console.error("Error updating total translation:", error);
  }
}

if (modsData && otherData) {
  updateTotalTranslation(modsData, otherData);
}


if (modsData && otherData) {
  updateTotalTranslation(modsData, otherData);
}

function updateURL(page, selectedFilters, selectedCategories, searchQuery) {
  const urlParams = new URLSearchParams(window.location.search);

  let filtersString = '';
  let categoriesString = '';

  if (page !== undefined) {
    urlParams.set('page', page);
  }

  if (selectedFilters !== undefined) {
    filtersString = selectedFilters ? selectedFilters.join('&') : '';
    urlParams.set('filter', filtersString);
  }

  if (selectedCategories !== undefined) {
    categoriesString = selectedCategories ? Array.from(selectedCategories).join('&') : '';
    if (categoriesString) {
      urlParams.set('c', categoriesString);
    } else {
      urlParams.delete('c'); // Remove 'c' if no categories are selected
    }
  }

  if (searchQuery !== undefined) {
    if (searchQuery && searchQuery.trim() !== '') {
      urlParams.set('q', searchQuery.trim());
    } else {
      urlParams.delete('q');
    }
  }

  const fullURL = `${window.location.pathname}?${urlParams.toString()}`;

  window.history.replaceState({}, '', fullURL);
}








function handleFilterSelection() {
  const selectedFilters = Array.from(document.querySelectorAll('.filtred input:checked')).map(checkbox => checkbox.value);
  const searchQuery = document.getElementById('searchInput').value.toLowerCase(); // Get the search query

  if (!Array.isArray(allData)) {
    console.error('allData is not an array or is undefined');
    return;
  }

  if (!(selectedCategories instanceof Set)) {
    console.error('selectedCategories is not a Set or is undefined');
    return;
  }

  // The categoryFilteredData has been filtered to only include items with all selected categories
  let categoryFilteredData = allData.filter(item => {
    const itemCategories = Array.isArray(item.categories) ? new Set(item.categories) : new Set();
    return selectedCategories.size === 0 || Array.from(selectedCategories).every(category => itemCategories.has(category));
  });

  let contentFilteredData = categoryFilteredData.filter(item => {
    return selectedFilters.length === 0 || selectedFilters.every(filter => {
      switch (filter) {
        case 'Other':
          return otherData.includes(item);
        case 'Mods':
          return modsData.includes(item);
        case 'Official':
          return item.verified === true;
        case 'FromMembers':
          return item.author !== 'СУМ';
        case 'NotCompleted':
          return !item.completed;
        default:
          return true; // If the filter is not recognized, include the item
      }
    });
  });

  filteredData = contentFilteredData.filter(item => {
    const titleMatches = searchQuery === '' || item.title.toLowerCase().includes(searchQuery);
    const descriptionMatches = searchQuery === '' || item.description.toLowerCase().includes(searchQuery);
    return titleMatches || descriptionMatches;
  });

  let totalPages = Math.ceil(filteredData.length / pageSize);

  totalPages = Math.max(totalPages, 1);

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  toggleModsOtherCheckbox(filteredData.length > 0);

  displayCards(currentPage, pageSize, filteredData);
  updatePageNavigation(currentPage, pageSize, filteredData);

  updateURL(currentPage, selectedFilters, selectedCategories, searchQuery);
}





function addSearchInputEventListener() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      localStorage.setItem('searchQuery', searchInput.value.toLowerCase());
      handleFilterSelection();
    });
  }
}

addSearchInputEventListener();







toggleModsOtherCheckbox();

let selectedFilters = 'none'; // Initialize selectedFilters variable with 'none' as default
let searchQuery = ''; // Initialize searchQuery variable

function saveToStorageHandleInitialURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  const filterParam = urlParams.get('filter');
  const categoryParam = urlParams.get('c'); // Get the categories parameter
  const searchParam = urlParams.get('q'); // Get the search query parameter

  if (pageParam && !isNaN(pageParam)) {
    currentPage = parseInt(pageParam);
  }

  if (filterParam) {
    selectedFilters = filterParam; // Update selectedFilters variable
  }

  if (categoryParam) {
    if (categoryParam) {
      selectedCategories = new Set(categoryParam.split('&')); // Update selectedCategories variable
    } else {
      selectedCategories = new Set(); // Handle the case where 'c' is empty
    }
  }

  if (searchParam) {
    searchQuery = searchParam; // Update searchQuery variable
  }
}



function loadFromStorageHandleInitialURLParams() {
  const filterParam = selectedFilters;
  const categoryParam = Array.from(selectedCategories).join('&'); // Get selected categories

  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&');
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
        handleFilterSelection(); // Trigger filter selection after setting checkboxes
      }
    });

    const filtersForm = document.getElementById('filtersForm');
    if (filtersForm) {
      filters.forEach(filter => {
        const input = filtersForm.querySelector(`input[value="${filter}"]`);
        if (input) {
          input.checked = true;
          handleFilterSelection(); // Trigger filter selection after setting checkboxes
        }
      });
    }
  }

  if (categoryParam) {
    const categories = categoryParam.split('&');
    categories.forEach(category => {
      const input = document.getElementById(category);
      if (input) {
        input.checked = true;
        filterDataByCategories(); // Apply the saved categories
      }
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = searchQuery; // Set the value of the search input
    if (searchQuery) {
      handleFilterSelection(); // Trigger search if searchQuery is present
    }
  }
}



function loadAndApplyFilterParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  const categoryParam = urlParams.get('c'); // Get categories parameter
  const searchQuery = urlParams.get('q');

  // Apply filter parameters if they exist
  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&'); // Use '&' as the separator
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
      }
    });
    handleFilterSelection(); // Apply the saved filters
  }

  // Apply categories parameters if they exist
  if (categoryParam) {
    const categories = categoryParam.split('&');
    categories.forEach(category => {
      const input = document.getElementById(category);
      if (input) {
        input.checked = true;
      }
    });
    filterDataByCategories(); // Apply the saved categories
  }

  // Apply search query if it exists
  const searchInput = document.getElementById('searchInput');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    handleFilterSelection(); // Trigger search if searchQuery is present
  }
}







function saveFilterParameters() {
  const selectedFilters = Array.from(document.querySelectorAll('.filtred input:checked')).map(checkbox => checkbox.value);
  const filtersString = selectedFilters.join('&');
  const selectedCategories = Array.from(selectedCategories).join('&'); // Collect selected categories
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
  // Save to sessionStorage
  sessionStorage.setItem('selectedFilters', filtersString);
  sessionStorage.setItem('selectedCategories', selectedCategories); // Save selected categories
  sessionStorage.setItem('searchQuery', searchQuery);
  
  // Update URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('filter', filtersString);
  urlParams.set('c', selectedCategories); // Add categories to URL
  urlParams.set('q', searchQuery);
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
}


function loadFilterParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  const categoryParam = urlParams.get('c'); // Get categories parameter
  const searchQuery = urlParams.get('q');

  // Apply filter parameters if they exist
  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&'); // Use '&' as the separator
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
      }
    });
    handleFilterSelection(); // Apply the saved filters
  }

  // Apply categories parameters if they exist
  if (categoryParam) {
    if (categoryParam) {
      const categories = categoryParam.split('&');
      categories.forEach(category => {
        const input = document.getElementById(category);
        if (input) {
          input.checked = true;
        }
      });
      filterDataByCategories(); // Apply the saved categories
    } else {
      selectedCategories = new Set(); // Handle the case where 'c' is empty
    }
  }

  // Apply search query if it exists
  const searchInput = document.getElementById('searchInput');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    handleFilterSelection(); // Trigger search if searchQuery is present
  }
}


function applyFilters() {
  saveFilterParameters();
  sessionStorage.setItem('searchQuery', document.getElementById('searchInput').value.toLowerCase());
}


function loadAndDisplayCategories() {
  fetch('ItemCategories.json')
    .then(response => response.json())
    .then(categoriesData => {
      const categoriesContainer = document.querySelector('.categories-cards');
      categoriesContainer.innerHTML = '';

      categoriesData.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('filter');
        categoryElement.style.backgroundColor = category.colour;

        const encodedIcon = `data:image/svg+xml,${encodeURIComponent(category.icon)}`;

        categoryElement.innerHTML = `
          <input type="checkbox" id="${category.title}" value="${category.title}">
          <div class="filter-icon">
            <div style="background-image: url('${encodedIcon}');" class="ItemIcons"></div>
            <label for="${category.title}" class="filter-label">${category.title}</label>
          </div>
        `;

        categoriesContainer.appendChild(categoryElement);

        categoryElement.querySelector('input').addEventListener('change', (event) => {
          const isChecked = event.target.checked;
          const categoryValue = event.target.value;

          if (isChecked) {
            selectedCategories.add(categoryValue);
          } else {
            selectedCategories.delete(categoryValue);
          }

          filterDataByCategories();
          
        });
      });
    })
    .catch(error => console.error('Error loading categories:', error));
}


function filterDataByCategories() {
  if (selectedCategories.size === 0) {
    filteredData = [...modsData, ...otherData];
  } else {
    filteredData = allData.filter(item => {
      const itemCategories = new Set(item.categories || []);
      // Check if all selected categories are included in the item's categories
      return Array.from(selectedCategories).every(category => itemCategories.has(category));
    });
  }

  handleFilterSelection();
}


document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayCategories();
});




// Load mods and other data
Promise.all([
  fetch('mods.json').then(response => response.json()),
  fetch('other.json').then(response => response.json())
])
  .then(([mods, other]) => {
    // Assign mods and other data to variables
    modsData = mods;
    otherData = other;
    allData = [...modsData, ...otherData]; // Initialize allData with mods and other data
    filteredData = allData; // Initialize filteredData with allData


    // Get unique authors from mods and other data
    const uniqueAuthors = getUniqueAuthors(mods, other);

    // Initialize page size and current page from URL parameters
    pageSize = 15;
    currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;

    // Save and load initial URL parameters
    saveToStorageHandleInitialURLParams();
    loadFromStorageHandleInitialURLParams();

    // Display initial cards and page navigation
    displayCards(currentPage, pageSize, filteredData);
    updatePageNavigation(currentPage, pageSize, filteredData);

    // Create filter inputs based on unique authors
    createFilterInputs(uniqueAuthors);

    // Update total translation count if mods and other data are defined
    if (modsData && otherData) {
      updateTotalTranslation(modsData, otherData);
    }

    // Call the function that depends on allData
    handleDataInitialization();
  })
  .catch(error => console.error("Error loading data:", error));

// Define a function to handle operations after allData is initialized
function handleDataInitialization() {
  handleFilterSelection();
  saveToStorageHandleInitialURLParams();
  loadFromStorageHandleInitialURLParams();

}