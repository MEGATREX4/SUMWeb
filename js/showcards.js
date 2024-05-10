//showcards.js


let pageSize;
let allData;
let currentPage;
let modsData;
let otherData;
let filteredData;

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
      <div id="${mod.id}" class="textContainer"><h2 title="${mod.title} українською" class="modtitle">${truncateText(mod.title, 20)}</h2>
      <p>від <span title="${(mod.author)}" class="author">${truncateText(mod.author, 35)}</span>
      </div>
    </div>
  `;

  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description-container');
  card.appendChild(descriptionContainer);

  const shortDescription = document.createElement('p');
  shortDescription.classList.add('short-description');
  const trimmedDescription = mod.description.length > 100 ? mod.description.substring(0, 100) + '...' : mod.description;
  const cleanDescription = trimmedDescription.replace(/\r\n/g, '').replace(/\n/g, ''); // Replace \r\n with empty string and \n with empty string
  shortDescription.innerText = cleanDescription;
  descriptionContainer.appendChild(shortDescription);




  // Add icons based on status classes
  if (statusClasses.length > 0) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('IconContainer');

    // Use Promise to get icon data
    addIcons(iconContainer, statusClasses);

    // Append the IconContainer to descriptionContainer
    descriptionContainer.appendChild(iconContainer);
  }

  // Add a click event listener to redirect to the item page when clicking on cardimage or textContainer
  const clickableElements = card.querySelectorAll('.cardimage, .modtitle');
  clickableElements.forEach(element => {
    element.addEventListener('click', (event) => {
      // Prevent following the link if the click is not on cardimage or textContainer
      if (!event.target.classList.contains('cardimage') && !event.target.classList.contains('modtitle')) {
        return;
      }

      // Extract the mod ID from the clicked card
      const modId = mod.id;

      // Redirect to item with the mod ID as a query parameter
      window.location.href = `item.html?id=${modId}`;
    });
  });

  // Append the card to the CardsContainer
  document.querySelector('.CardsContainer').appendChild(card);
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

// Function to get icon data from Icons.json
function getIconData(statusClasses) {
  // Replace this with the actual path to your Icons.json file
  const iconsJsonPath = 'icons.json';

  // Return a Promise for fetching and processing the icon data
  return fetch(iconsJsonPath)
    .then(response => response.json())
    .then(iconData => {
      const icons = [];
      statusClasses.forEach(statusClass => {
        const icon = iconData[statusClass];
        if (icon && icon.icon) {
          icons.push(icon);
        }
      });
      return icons;
    })
    .catch(error => {
      console.error('Error fetching icon data:', error);
      return [];
    });
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
    currentData.forEach(item => createModCard(item)); // Replace createCard with createModCard
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




// Function to fetch filter icons from icons.json
function FetchFilterIcons() {
  // Replace this with the actual path to your icons.json file
  const iconsJsonPath = 'icons.json';

  return fetch(iconsJsonPath)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching filter icons:', error);
      return {};
    });
}




// Constant object mapping filter variable names to display names and icons
const filterDisplayNames = {
  Mods: { name: 'Моди', icon: 'icon/minecraft.svg', title: 'Моди' },
  Other: { name: 'Інші', icon: 'icon/other.svg', title: 'Інші' },
  Official: { name: 'Офіційні', icon: 'icon/verified.svg', title: 'Офіційні' },
  FromMembers: { name: 'Від учасників', icon: 'icon/frommembers.svg', title: 'Від учасників' },
  NotCompleted: { name: 'У роботі', icon: 'icon/completed.svg', title: 'У роботі' },
};


// Function to handle toggling between Mods and Other checkboxes
function toggleModsOtherCheckbox() {
  const modsCheckbox = document.querySelector('input[value="Mods"]');
  const otherCheckbox = document.querySelector('input[value="Other"]');
  
  // Check if both checkboxes are found before adding event listeners
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

// Modify the createFilterInputs function to include headers
function createFilterInputs(authors) {
  const filtersContainer = document.querySelector('.FiltersContainer');
  const filtredContainer = document.querySelector('.filtred');
  const filtersForm = document.createElement('form'); // Create form element
  filtersForm.classList.add('filters-form'); // Add class to form
  filtersForm.id = 'filtersForm'; // Add id to form

  const filters = Object.keys(filterDisplayNames);

  // Add headers for Mods/Other and Official/FromMembers/NotCompleted
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
  
    // Add event listener only for radio buttons
    input.addEventListener('change', () => handleFilterSelection());
  
    const div = document.createElement('div');
    div.classList.add('filter-icon');
    div.innerHTML = `<div class="ItemIcons" style="background-image: url(&quot;${filterDisplayNames[filter].icon}&quot;);" title="${filterDisplayNames[filter].title}"></div><label for="${filter.toLowerCase()}">${filterDisplayNames[filter].name}</label>`; // Use filterDisplayNames object
    divFor = filter.toLowerCase();
  
    filterContainer.appendChild(input);
    filterContainer.appendChild(div);
  
    // Append filters to respective containers based on Mods/Other
    if (filter === 'Mods') {
      modsContainer.appendChild(filterContainer);
    } else if (filter === 'Other') {
      otherContainer.appendChild(filterContainer);
    } else {
      filtersForm.appendChild(filterContainer); // Append filter container to form
    }
  });
  

  // Create checkboxes for each unique author
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

  // Retrieve selected filters from Session Storage and set checkboxes
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


// Call the function after ensuring modsData and otherData are defined
if (modsData && otherData) {
  updateTotalTranslation(modsData, otherData);
}

// Function to update the URL with the current page, selected filters, and search query
function updateURL(page, selectedFilters, searchQuery) {
  // Create a new URLSearchParams object to handle URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Define variables to hold the values of filters and search query
  let filtersString = '';
  let queryParam = '';

  // Update page number if it has changed
  if (page !== undefined) {
    urlParams.set('page', page);
  }

  // Update selected filters if they have changed
  if (selectedFilters !== undefined) {
    // Concatenate selected filters with '&' delimiter
    filtersString = selectedFilters ? selectedFilters.join('&') : '';
    urlParams.set('filter', filtersString); // Keep filters parameter even if it's empty
  }

  // Update search query if it has changed
  if (searchQuery !== undefined) {
    if (searchQuery && searchQuery.trim() !== '') {
      urlParams.set('q', searchQuery.trim());
    } else {
      urlParams.delete('q');
    }
  }

  // Construct the full URL with updated parameters
  const fullURL = `${window.location.pathname}?${urlParams}`;

  // Replace the current state in the browser history with the updated URL
  window.history.replaceState({}, '', fullURL);
}













// Call the toggleModsOtherCheckbox function to set up the event listeners




// Function to handle filter selection and search
function handleFilterSelection() {
  const selectedFilters = Array.from(document.querySelectorAll('.filtred input:checked')).map(checkbox => checkbox.value);
  
  const searchQuery = document.getElementById('searchInput').value.toLowerCase(); // Get the search query

  // Filter data based on selected filters and search query
  filteredData = allData.filter(item => {
    // Check if item matches selected filters
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.every(filter => {
      if (filter === 'Other') {
        return otherData.includes(item);
      } else if (filter === 'Mods') {
        return modsData.includes(item);
      } else if (filter === 'Official') {
        return item.verified === true;
      } else if (filter === 'FromMembers') {
        return item.author !== 'СУМ';
      } else if (filter === 'NotCompleted') { // Add condition for 'NotCompleted'
        return !item.completed;
      }
      // Add more conditions for other filters if needed
      return true;
    });

    // Check if item matches search query
    const matchesSearchQuery = searchQuery === '' || item.title.toLowerCase().includes(searchQuery) || item.description.toLowerCase().includes(searchQuery);

    // Return true if item matches both filters and search query
    return matchesFilters && matchesSearchQuery;
  });

  // Get the total number of pages with the filtered data
  let totalPages = Math.ceil(filteredData.length / pageSize);

  // Ensure there is at least one page
  totalPages = Math.max(totalPages, 1);

  // Reset current page to the last page if it exceeds the total pages after filtering
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // Toggle Mods/Other checkbox based on the presence of filtered data
  toggleModsOtherCheckbox(filteredData.length > 0);

  // Update the displayed cards and page navigation with the filtered data
  displayCards(currentPage, pageSize, filteredData);
  updatePageNavigation(currentPage, pageSize, filteredData);

  // Update the URL with the current page, selected filters, and search query
  updateURL(currentPage, selectedFilters, searchQuery);
}


// Function to add event listener to search input field and save to local storage
function addSearchInputEventListener() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      localStorage.setItem('searchQuery', searchInput.value.toLowerCase());
      handleFilterSelection();
    });
  }
}

// Call the function to add event listener to search input field
addSearchInputEventListener();







// Call the toggleModsOtherCheckbox function to set up the event listeners
toggleModsOtherCheckbox();

let selectedFilters = 'none'; // Initialize selectedFilters variable with 'none' as default
let searchQuery = ''; // Initialize searchQuery variable

function saveToStorageHandleInitialURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  const filterParam = urlParams.get('filter');
  const searchParam = urlParams.get('q'); // Get the search query parameter

  if (pageParam && !isNaN(pageParam)) {
    currentPage = parseInt(pageParam);
  }

  if (filterParam) {
    selectedFilters = filterParam; // Update selectedFilters variable
  }

  if (searchParam) {
    searchQuery = searchParam; // Update searchQuery variable
  }
}

// Function to load selected filters from storage and apply them to UI
function loadFromStorageHandleInitialURLParams() {
  const filterParam = selectedFilters;

  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&');
    // Update selected filters in the UI
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
        handleFilterSelection(); // Trigger filter selection after setting checkboxes
      }
    });

    // Set selected filters in the form with id "filtersForm"
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

  // Load search query from storage and apply it to UI
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = searchQuery; // Set the value of the search input
    if (searchQuery) {
      handleFilterSelection(); // Trigger search if searchQuery is present
    }
  }
}


// Function to load filter parameters and search query from sessionStorage and apply them to the form
function loadAndApplyFilterParameters() {
  const filterParam = new URLSearchParams(window.location.search).get('filter');
  const searchQuery = new URLSearchParams(window.location.search).get('q');

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

  // Apply search query if it exists
  const searchInput = document.getElementById('searchInput');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
  }
}







// Save filter parameters to sessionStorage
function saveFilterParameters() {
  const selectedFilters = Array.from(document.querySelectorAll('.filtred input:checked')).map(checkbox => checkbox.value);
  const filtersString = selectedFilters.join('&');
  sessionStorage.setItem('selectedFilters', filtersString);
}

// Load filter parameters from sessionStorage and apply them to the form
function loadFilterParameters() {
  const filterParam = sessionStorage.getItem('selectedFilters');

  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&');
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
        handleFilterSelection(); // Apply the saved filters

      }
    });
    handleFilterSelection(); // Apply the saved filters
  }
}

// Call saveFilterParameters when filters are applied
function applyFilters() {
  saveFilterParameters();
  // Save search query along with filter parameters
  sessionStorage.setItem('searchQuery', document.getElementById('searchInput').value.toLowerCase());
  // Apply filters logic
}







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
    pageSize = 12;
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