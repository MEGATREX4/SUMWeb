document.addEventListener("DOMContentLoaded", function () {
    // Fetch categories from the server or load from categories.json
    fetch('/static/categories.json')
        .then(response => response.json())
        .then(categories => {
            populateCategories(categories);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
});

function populateCategories(categories) {
    var categoriesContainer = document.getElementById('categories');

    categories.forEach(function (category) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'categories';
        checkbox.value = category;

        var label = document.createElement('label');
        label.htmlFor = category;
        label.appendChild(document.createTextNode(category));

        categoriesContainer.appendChild(checkbox);
        categoriesContainer.appendChild(label);
        categoriesContainer.appendChild(document.createElement('br'));
    });

    // Display the category section
    document.getElementById('category-section').style.display = 'block';

    // Add an input field for additional categories
    var additionalCategoriesInput = document.createElement('input');
    additionalCategoriesInput.type = 'text';
    additionalCategoriesInput.name = 'additional_categories';
    additionalCategoriesInput.placeholder = 'Enter additional categories (comma-separated)';
    categoriesContainer.appendChild(additionalCategoriesInput);
}












