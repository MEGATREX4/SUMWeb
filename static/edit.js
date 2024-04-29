// Function to fetch data from mods.json and other.json
function fetchItems() {
    $.ajax({
        url: '/fetch_items',
        method: 'GET',
        success: function (data) {
            // Append data to the Items div
            $('#Items').html(data);
            clearEditModalFields();
        },
        error: function (xhr, status, error) {
            console.error('Error fetching items:', error);
        }
    });
}

// Call fetchItems function when the document is ready
$(document).ready(function () {
    fetchItems();
});


// Function to fetch data from the server and display cards
function displayCards() {
    // Store the current scroll position
    var scrollPosition = $(window).scrollTop();

    $.ajax({
        url: '/fetch_items',
        method: 'GET',
        success: function(data) {
            // Clear the existing cards
            $('#Items').empty();
            
            // Sort the data by ID
            data.sort(function(a, b) {
                return parseInt(a.id) - parseInt(b.id);
            });
            
            // Loop through the sorted data and create cards
            data.forEach(function(item) {
                // Format the item ID with leading zeros
                var formattedId = item.id.padStart(6, '0'); // Assuming the ID should have 6 digits
                
                // Truncate the description if it's longer than 100 characters
                var truncatedDescription = item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description;

                // Create the card HTML
                var cardHTML = '<div class="card">' +
                                    '<h3 id="' + item.id + '">' + item.title + '</h3>' +
                                    '<div class="card-image" style="background-image: url(\'' + item.image + '\')"></div>' +
                                    '<p>Game Version: ' + item.gameversion + '</p>' +
                                    '<p>Engine: ' + item.engine + '</p>' +
                                    '<p>Categories: ' + item.categories.join(', ') + '</p>' +
                                    '<p>Author: ' + item.author + '</p>' +
                                    '<p class="description">Description: ' + truncatedDescription + '</p>' +
                                    '<button onclick="openEditModal(\'' + formattedId + '\')" class="edit-btn" data-id="' + formattedId + '">Edit</button>' +
                                '</div>';
                
                // Append the card HTML to the Items container
                document.getElementById('Items').innerHTML += cardHTML;
            });

            // Restore the scroll position after the cards have been loaded
            $(window).scrollTop(scrollPosition);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching items:', error);
        }
    });
}






// Call the function to display cards when the document is ready
$(document).ready(function() {
    displayCards();
});






document.addEventListener("DOMContentLoaded", function () {
    // Fetch all categories from the server
    fetch('/fetch_all_categories')
        .then(response => response.json())
        .then(allCategories => {
            // Populate the edit categories checkboxes with all categories
            populateEditCategories(allCategories);
        })
        .catch(error => {
            console.error('Error fetching all categories:', error);
        });
});

// Function to fetch item categories for a specific item and mark checkboxes
function fetchItemCategories(itemId) {
    fetch('/fetch_item_categories/' + itemId)
        .then(response => response.json())
        .then(itemCategories => {
            // Mark checkboxes for categories that the item already has
            markItemCategories(itemCategories);
        })
        .catch(error => {
            console.error('Error fetching item categories:', error);
        });
}

// Function to populate the main editCategories field
function populateEditCategories(itemCategories) {
    // Fetch all available categories
    $.ajax({
        url: '/fetch_all_categories',
        method: 'GET',
        success: function(allCategories) {
            var availableCategories = allCategories;

            // Create checkboxes for all available categories
            var checkboxes = '';
            availableCategories.forEach(function(category) {
                var isChecked = itemCategories.includes(category) ? 'checked' : '';
                checkboxes += '<div class="EditCategoryItem"><input type="checkbox" name="editCategories[]" value="' + category + '" ' + isChecked + '> ' + category + '</div>';
            });

            // Populate the main editCategories field
            $('#editCategories').html(checkboxes);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching categories:', error);
        }
    });
}



// Function to mark checkboxes for categories that the item already has
function markItemCategories(itemCategories) {
    itemCategories.forEach(function(category) {
        var checkbox = document.querySelector('#editCategories input[value="' + category + '"]');
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}









// Function to open the modal window for editing
function openEditModal(itemId) {
    // Clear the modal fields first
    clearEditModalFields();

    // Fetch the item data directly using the item ID
    $.ajax({
        url: '/fetch_item_by_id/' + itemId,
        method: 'GET',
        success: function(item) {
            // Populate the modal fields with the item's information
            $('#editItemId').val(itemId);
            $('#editTitle').val(item.title);
            $('#editGameVersion').val(item.gameversion);
            $('#editEngine').val(item.engine);
            $('#editDescription').val(item.description);
            $('#editImage').val(item.image);
            $('#editAuthor').val(item.author);
            $('#editTranslation').val(item.translation);
            
            // Populate the main editCategories field
            populateEditCategories(item.categories);

            // Fetch all available categories
            $.ajax({
                url: '/fetch_all_categories',
                method: 'GET',
                success: function(allCategories) {
                    var availableCategories = allCategories;

                    // Find the categories of the item that are not in the main poll
                    var otherCategories = item.categories.filter(function(category) {
                        return !availableCategories.includes(category);
                    });

                    // Populate the editOtherCategories field with additional categories
                    $('#editOtherCategories').val(otherCategories.join(', '));
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching categories:', error);
                }
            });

            // Populate the editLink fields with the item ID included in the link
            for (var i = 0; i < item.link.length; i++) {
                $('#editLink' + (i + 1)).val(item.link[i] + '#'+ itemId);
            }

            // Populate the editVerified field
            $('#editVerified').prop('checked', item.verified);

            // Populate the editCompleted field
            $('#editCompleted').prop('checked', item.completed);

            // Scroll to the h3 element with the corresponding item ID
            var scrollToElement = $('#' + itemId);
            if (scrollToElement.length) {
                $('html, body').animate({
                    scrollTop: scrollToElement.offset().top
                }, 500);
            }

            // Display the modal
            $('#editModal').css('display', 'flex');

            // Add event listener for "Esc" key press to close the modal
            $(document).on('keydown', function(event) {
                if (event.keyCode === 27) { // "Esc" key code
                    closeEditModal();
                }
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching item:', error);
        }
    });
}


// Function to clear the modal fields
function clearEditModalFields() {
    $('#editItemId').val('');
    $('#editTitle').val('');
    $('#editGameVersion').val('');
    $('#editEngine').val('');
    $('#editDescription').val('');
    $('#editImage').val('');
    $('#editAuthor').val('');
    $('#editTranslation').val('');
    $('#editOtherCategories').val('');
    $('#editLink1').val('');
    $('#editLink2').val('');
    $('#editLink3').val('');
    $('#editVerified').prop('checked', false);
    $('#editCompleted').prop('checked', false);
    $('.editCategories').prop('checked', false);
}







// event listener for "Esc" key press to close the modal
$(document).on('keydown', function(event) {
    if (event.keyCode === 27) { // "Esc" key code
        closeEditModal();
    }
})

// Function to close the modal window for editing
function closeEditModal() {
    // Remove the event listener for "Esc" key press
    $(document).off('keydown');

    // Reset all checkboxes
    $('#editModal input[type="checkbox"]').prop('checked', false);

    // Close the modal window
    $('#editModal').css('display', 'none');
}



function saveUpdatedItem() {
    // Extract the edited item data from the modal form
    var updatedItem = {
        id: $('#editItemId').val(),
        title: $('#editTitle').val(),
        gameversion: $('#editGameVersion').val(),
        engine: $('#editEngine').val(),
        description: $('#editDescription').val(),
        image: $('#editImage').val(),
        author: $('#editAuthor').val(),
        translation: $('#editTranslation').val(),
        // Initialize an empty array for categories
        categories: []
        // Add other fields as needed
    };

    // Extract selected categories from checkboxes and add them to the categories array
    $('#editCategories input[type="checkbox"]:checked').each(function() {
        updatedItem.categories.push($(this).val());
    });

    // Extract additional categories from the other categories field and add them to the categories array if it's not empty
    var otherCategories = $('#editOtherCategories').val().split(',').map(function(category) {
        return category.trim();
    });
    if (otherCategories.length > 0) {
        updatedItem.categories = updatedItem.categories.concat(otherCategories);
    }

    // Send the updated item data to the server
    $.ajax({
        url: '/update_item',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            id: updatedItem.id,
            title: updatedItem.title,
            gameversion: updatedItem.gameversion,
            engine: updatedItem.engine,
            description: updatedItem.description,
            image: updatedItem.image,
            author: updatedItem.author,
            translation: updatedItem.translation,
            categories: updatedItem.categories.join(', ') // Join categories into a single string
        }),
        success: function(response) {
            console.log('Item updated successfully:', response);
            // Close the modal window after successful update
            closeEditModal();
            // Refresh the displayed items after update
            fetchItems();
            // Scroll to the updated item
            openEditModal(updatedItem.id);
        },
        error: function(xhr, status, error) {
            console.error('Error updating item:', error);
        }
    });
}











