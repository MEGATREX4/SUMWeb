


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

  let statusClasses = getStatusClasses(mod, modsData, otherData);

  if (statusClasses.length > 0) {
    statusClasses.forEach(statusClass => {
      card.classList.add(statusClass);
    });
  }

  card.id = `${mod.id}`;

  card.innerHTML = `
    <div class="TopCardContainer">
      <div class="cardimage" style="background-image: url('${mod.image}')" title="Зображення ${mod.title}" style="max-width: 100%;"></div>
      <div id="${mod.id}" class="textContainer">
        <h2 title="${mod.title} українською" class="modtitle">${truncateText(mod.title, 35)}</h2>
        <p>від <span title="${mod.author}" class="author">${truncateText(mod.author, 35)}</span></p>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    window.location.href = `item.html?id=${mod.id}`;
  });

  document.querySelector('.CardsContainer').appendChild(card);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description-container');
  card.appendChild(descriptionContainer);

  const cleanedDescription = mod.description
    .replace(/^-{3,}\s*$/gm, ' ')
    
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/!\[.*?\]\s*/g, ' ')
    .replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff|heic|ico|tif)(\?[^\s]*)?/gi, '')
    .replace(/https?:\/\/[^\s]+/gi, '')
    .replace(/\*\*\*\*(.*?)\*\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s+/g, ' ')
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/#+/g, ' ')


  const trimmedDescription = cleanedDescription.length > 100 ? cleanedDescription.substring(0, 100) + '...' : cleanedDescription;

  const markdownHTML = marked.parse(trimmedDescription);

  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.classList.add('short-description');
  descriptionParagraph.innerHTML = markdownHTML;

  descriptionContainer.appendChild(descriptionParagraph);

  if (statusClasses.length > 0) {
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('IconContainer');
    card.appendChild(iconContainer);

    addIcons(iconContainer, statusClasses);
  }
}


function getStatusClasses(mod, modsData, otherData) {
  const statusClasses = [];

  if (mod.completed === false) {
    statusClasses.push('completed');
  } else if (mod.semiverified === true) {
    statusClasses.push('semiverified');
  } else if (mod.verified === true) {
    statusClasses.push('verified');
  }

  const modExistsInModsData = modsData.some(modData => modData.id === mod.id);
  const modExistsInOtherData = otherData.some(otherMod => otherMod.id === mod.id);

  if (modExistsInModsData) {
    statusClasses.push('minecraft');
  } else if (modExistsInOtherData) {
    statusClasses.push('other');
  }

  return statusClasses;
}

let cachedIconData = null;

function getIconData(statusClasses) {
  if (cachedIconData) {
    return Promise.resolve(filterIconsByStatusClasses(cachedIconData, statusClasses));
  }

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

function addIcons(element, statusClasses) {
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


function displayCards(currentPage, pageSize, data) {
  data.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentData = data.slice(startIndex, endIndex);

  const cardsContainer = document.querySelector('.CardsContainer');
  if (cardsContainer) {
    cardsContainer.innerHTML = '';

    if (currentData.length > 0) {
      cardsContainer.classList.remove('createCardFlex');
      currentData.forEach(item => createModCard(item));
    } else {
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


function displayPageNumber(pageNumber, isActive) {
  const pagesContainer = document.getElementById('Pages');

  const pageElement = document.createElement('div');
  pageElement.classList.add('page-number');
  if (isActive) {
    pageElement.classList.add('ActivePage');
  }
  pageElement.textContent = pageNumber;

  pageElement.addEventListener('click', () => navigatePage(pageNumber, totalPages));

  pagesContainer.appendChild(pageElement);
}

function updatePageNavigation(currentPage, pageSize, filteredData) {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagesContainer = document.getElementById('Pages');

  pagesContainer.innerHTML = '';

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
    const isActive = totalPages === currentPage;
    pagesContainer.innerHTML += `
      <div class="page-number ${isActive ? 'ActivePage' : ''}" onclick="navigatePage(${totalPages}, ${totalPages})">${totalPages}</div>
    `;
  };

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




function navigatePage(newPage, totalPages) {
  if (!isNaN(newPage) && newPage >= 1) {
      const targetPage = Math.min(newPage, totalPages);
      if (targetPage !== currentPage) {
          currentPage = targetPage;
          updateURL(currentPage);  
          displayCards(currentPage, pageSize, filteredData);
          updatePageNavigation(currentPage, pageSize, filteredData);
      }
  } else {
      displayErrorMessage();
  }
}



function getUniqueAuthors(mods, other) {
  const modsAuthors = mods.flatMap(mod => mod.authors || []);
  const otherAuthors = other.flatMap(item => item.authors || []);
  const allAuthors = [...new Set([...modsAuthors, ...otherAuthors])];
  
  return allAuthors;
}


function updateAuthorsList(authors) {
  const authorsContainer = document.querySelector('.AuthorsContainer');
  authorsContainer.innerHTML = '';

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
  const filtersForm = document.createElement('form');
  filtersForm.classList.add('filters-form');
  filtersForm.id = 'filtersForm';

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
      filtersForm.appendChild(filterContainer);
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

    filtersForm.appendChild(authorCheckbox);
    filtersForm.appendChild(authorLabel);
  });

  filtredContainer.appendChild(filtersForm);

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
      urlParams.delete('c');
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
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();

  if (!Array.isArray(allData)) {
    console.error('allData is not an array or is undefined');
    return;
  }

  if (!(selectedCategories instanceof Set)) {
    console.error('selectedCategories is not a Set or is undefined');
    return;
  }

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
          return true;
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




function parseURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);

  const categories = urlParams.get('c');
  if (categories) {
    selectedCategories = new Set(decodeURIComponent(categories).split('&'));
    document.querySelectorAll('.filtred input').forEach(input => {
      input.checked = selectedCategories.has(input.value);
    })
  } else {
    selectedCategories = new Set();
    document.querySelectorAll('.filtred input').forEach(input => {
      input.checked = false;
    })
  }

  const filters = urlParams.get('filter');
  if (filters) {
    const filterArray = decodeURIComponent(filters).split('&');
    document.querySelectorAll('.filtred input').forEach(input => {
      input.checked = filterArray.includes(input.value);
    });
  } else {
    document.querySelectorAll('.filtred input').forEach(input => {
      input.checked = false;
    });
  }

  const searchQuery = urlParams.get('q');
  if (searchQuery) {
    document.getElementById('searchInput').value = decodeURIComponent(searchQuery);
  }
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

let selectedFilters = 'none';
let searchQuery = '';

function saveToStorageHandleInitialURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  const filterParam = urlParams.get('filter');
  const categoryParam = urlParams.get('c');
  const searchParam = urlParams.get('q');

  if (pageParam && !isNaN(pageParam)) {
    currentPage = parseInt(pageParam);
  }

  if (filterParam) {
    selectedFilters = filterParam;
  }

  if (categoryParam) {
    if (categoryParam) {
      selectedCategories = new Set(categoryParam.split('&'));
    } else {
      selectedCategories = new Set();
    }
  }

  if (searchParam) {
    searchQuery = searchParam;
  }
}


function loadFromStorageHandleInitialURLParams() {
  const filterParam = selectedFilters;
  const categoryParam = Array.from(selectedCategories).join('&');

  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&');
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
        handleFilterSelection();
      }
    });

    const filtersForm = document.getElementById('filtersForm');
    if (filtersForm) {
      filters.forEach(filter => {
        const input = filtersForm.querySelector(`input[value="${filter}"]`);
        if (input) {
          input.checked = true;
          handleFilterSelection();
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
        filterDataByCategories();
      }
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = searchQuery;
    if (searchQuery) {
      handleFilterSelection();
    }
  }
}



function loadAndApplyFilterParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  const categoryParam = urlParams.get('c');
  const searchQuery = urlParams.get('q');

  // Apply filter parameters if they exist
  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&');
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
      }
    });
    handleFilterSelection();
  }

  if (categoryParam) {
    const categories = categoryParam.split('&');
    categories.forEach(category => {
      const input = document.getElementById(category);
      if (input) {
        input.checked = true;
      }
    });
    filterDataByCategories();
  }

  const searchInput = document.getElementById('searchInput');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    handleFilterSelection();
  }
}







function saveFilterParameters() {
  const selectedFilters = Array.from(document.querySelectorAll('.filtred input:checked')).map(checkbox => checkbox.value);
  const filtersString = selectedFilters.join('&');
  const selectedCategories = Array.from(selectedCategories).join('&');
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
  sessionStorage.setItem('selectedFilters', filtersString);
  sessionStorage.setItem('selectedCategories', selectedCategories);
  sessionStorage.setItem('searchQuery', searchQuery);
  
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('filter', filtersString);
  urlParams.set('c', selectedCategories);
  urlParams.set('q', searchQuery);
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
}


function loadFilterParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  const categoryParam = urlParams.get('c');
  const searchQuery = urlParams.get('q');

  if (filterParam && filterParam !== 'none') {
    const filters = filterParam.split('&');
    filters.forEach(filter => {
      const input = document.getElementById(filter);
      if (input) {
        input.checked = true;
      }
    });
    handleFilterSelection();
  }

  if (categoryParam) {
    if (categoryParam) {
      const categories = categoryParam.split('&');
      categories.forEach(category => {
        const input = document.getElementById(category);
        if (input) {
          input.checked = true;
        }
      });
      filterDataByCategories();
    } else {
      selectedCategories = new Set();
    }
  }

  const searchInput = document.getElementById('searchInput');
  if (searchQuery && searchInput) {
    searchInput.value = searchQuery;
    handleFilterSelection();
  }
}

function getURLParameters() {
  const params = new URLSearchParams(window.location.search);
  const categories = params.get('c'); // Get 'c' parameter for categories

  return categories ? categories.split('&') : []; // Split by '&' if multiple categories
}


function applyFilters() {
  saveFilterParameters();
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
  const categories = Array.from(selectedCategories).map(cat => encodeURIComponent(cat)).join('&'); // Encode category names
  const url = new URL(window.location.href);
  url.searchParams.set('searchQuery', searchQuery);
  url.searchParams.set('c', categories);
  window.history.pushState({}, '', url.toString());
}



function loadAndDisplayCategories() {
  fetch('ItemCategories.json')
    .then(response => response.json())
    .then(categoriesData => {
      const categoriesContainer = document.querySelector('.categories-cards');
      categoriesContainer.innerHTML = '';

      const urlCategories = getURLParameters(); // Get categories from URL

      categoriesData.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('filter', 'CategoryFilter');
        categoryElement.style.backgroundColor = category.color;

        const encodedIcon = category.icon ? `data:image/svg+xml,${encodeURIComponent(category.icon)}` : '';

        const isChecked = urlCategories.includes(category.title); // Check if category is in URL

        categoryElement.innerHTML = `
          <input type="checkbox" id="category-${category.id}" value="${category.title}" ${isChecked ? 'checked' : ''}>
          <div class="filter-icon">
            ${encodedIcon ? `<div style="background-image: url('${encodedIcon}');" class="ItemIcons"></div>` : ''}
            <label for="category-${category.id}" class="filter-label">${category.title}</label>
          </div>
        `;

        categoriesContainer.appendChild(categoryElement);

        categoryElement.querySelector('input').addEventListener('change', (event) => {
          const isChecked = event.target.checked;
          const categoryId = category.id;

          // Update selectedCategories set
          if (isChecked) {
            selectedCategories.add(event.target.value);
          } else {
            selectedCategories.delete(event.target.value);
          }

          filterDataByCategories();
          applyFilters(); // Update URL with new filters
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
      return Array.from(selectedCategories).every(category => itemCategories.has(category));
    });
  }

  handleFilterSelection();
}


document.addEventListener('DOMContentLoaded', () => {
  parseURLParameters();
  
  loadAndDisplayCategories();
});





Promise.all([
  fetch('mods.json').then(response => response.json()),
  fetch('other.json').then(response => response.json())
])
  .then(([mods, other]) => {
    modsData = mods;
    otherData = other;
    allData = [...modsData, ...otherData];
    filteredData = allData;


    const uniqueAuthors = getUniqueAuthors(mods, other);

    pageSize = 15;
    currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;

    saveToStorageHandleInitialURLParams();
    loadFromStorageHandleInitialURLParams();

    displayCards(currentPage, pageSize, filteredData);
    updatePageNavigation(currentPage, pageSize, filteredData);

    createFilterInputs(uniqueAuthors);

    if (modsData && otherData) {
      updateTotalTranslation(modsData, otherData);
    }

    handleDataInitialization();
  })
  .catch(error => console.error("Error loading data:", error));

function handleDataInitialization() {
  handleFilterSelection();
  saveToStorageHandleInitialURLParams();
  loadFromStorageHandleInitialURLParams();

}

document.querySelector('#category-header').addEventListener('click', function() {
  const categoriesCards = document.querySelector('.categories-cards');
  categoriesCards.classList.toggle('open');
});
