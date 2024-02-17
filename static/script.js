$(document).ready(function () {
    $('.edit-button').click(function () {
        const cardDiv = $(this).closest('.card');
        const form = cardDiv.find('.form');
        form.toggle();
        const cardTitle = cardDiv.data('title');
        form.find('.new-title').val(cardTitle);
    });

    

    $('.site-link').each(function () {
        const fullLink = $(this).attr('href');
        if (fullLink) {
            const hostname = new URL(fullLink).hostname;
            $(this).text(hostname);
        }
    });

    function deleteCard(cardDiv) {
        const cardId = cardDiv.data('id');  // Assuming you store the card ID in a 'data-id' attribute
        if (confirm(`Видалити запис з ID "${cardId}"? Дані запису видаляться назавжди.`)) {
            $.ajax({
                type: 'POST',
                url: '/delete_card',
                data: JSON.stringify({ id: cardId }),  // Change 'title' to 'id'
                contentType: 'application/json',
                success: function () {
                    cardDiv.remove();
                },
            });
        }
    }

    function saveUpdatedCard(cardForm) {
        const cardId = cardForm.data('id');
        const formData = cardForm.serialize();  // Serialize the form data
    
        $.ajax({
            type: 'POST',
            url: `/edit_card/${cardId}`,  // Update the URL to include the cardId in the route
            data: formData,
            success: function (response) {
                // Handle the response from the server
                console.log('Server response:', response);
    
                // Assuming the server returns updated data, you can update the card elements
                const cardDiv = $(`[data-id="${cardId}"]`);
                const cardTitleElement = cardDiv.find('h3');
                const cardDescriptionElement = cardDiv.find('p');
                // Update other elements as needed
    
                // Example: Update the title if the server response contains the updated title
                if (response.title) {
                    cardTitleElement.text(response.title);
                }
    
                // Hide the form
                cardForm.hide();
            },
            error: function (error) {
                // Handle errors, if any
                console.error('Error:', error);
            },
        });
    }
    

// Update the click event to submit the form
$('.save-button').click(function (event) {
    event.preventDefault();  // Prevent the default form submission
    const cardForm = $(this).closest('form');
    saveUpdatedCard(cardForm);
});

// Add a click event for the cancel button to hide the form
$('.cancel-button').click(function (event) {
    event.preventDefault();
    const cardForm = $(this).closest('form');
    cardForm.hide();
});

    $('.add-button').click(function () {
        const newTitle = $('#new-title').val();
        const newDescription = $('#new-description').val();
        const newImage = $('#new-image').val();
        const newAuthor = $('#new-author').val();
        const newLink = $('#new-link').val();
        const newVerified = $('#new-verified').prop('checked');
        const newCompleted = $('#new-completed').prop('checked');



        const formData = JSON.stringify({
            title: newTitle,
            description: newDescription,
            image: newImage,
            verified: newVerified,
            author: newAuthor,
            completed: newCompleted,
            link: newLink,
        });

        $.ajax({
            type: 'POST',
            url: '/add_card',
            data: formData,
            contentType: 'application/json',
            success: function (response) {
                const newCardHtml = `
                    <!-- Ваш HTML-код для нової карточки -->
                `;
                const newCard = $(newCardHtml);
                $('.card-container').append(newCard);

                newCard.find('.delete-button').click(function () {
                    deleteCard(newCard);
                });
                newCard.find('.edit-button').click(function () {
                    editCard(newCard);
                });

                $('#new-title').val('');
                $('#new-description').val('');
                $('#new-image').val('');
                $('#new-author').val('');
                $('#new-link').val('');
                $('#new-verified').prop('checked', false);
                $('#new-completed').prop('checked', false);
            },
        });
    });

    function editCard(card) {
        const form = card.find('.form');
        form.show();
        const cardTitle = card.data('title');
        const currentTitle = card.find('h3').text();
        const currentDescription = card.find('p').text();
        const currentImage = card.find('.imageitem').attr('src');
        const currentAuthor = card.find('.author').text();
        const currentVerified = card.find('.ver').text().includes('Так');
        const currentCompleted = card.find('.ove').text().includes('Так');
        const currentLink = card.find('.link').find('a').attr('href');

        form.find('.new-title').val(currentTitle);
        form.find('.new-description').val(currentDescription);
        form.find('.new-image').val(currentImage);
        form.find('.new-author').val(currentAuthor);
        form.find('.new-verified').prop('checked', currentVerified);
        form.find('.new-completed').prop('checked', currentCompleted);
        form.find('.new-link').val(currentLink);
    }

    $('.edit-button').click(function () {
        editCard($(this).closest('.card'));
    });

    

    function sortCardsAZ() {
        const cardContainer = $('.card-container');
        const cards = cardContainer.find('.card').get();
        cards.sort(function (a, b) {
            const titleA = $(a).data('title').toLowerCase();
            const titleB = $(b).data('title').toLowerCase();
            return titleA.localeCompare(titleB);
        });
        cardContainer.empty();
        $.each(cards, function (i, card) {
            cardContainer.append(card);
        });
    }

    function sortCardsZA() {
        const cardContainer = $('.card-container');
        const cards = cardContainer.find('.card').get();
        cards.sort(function (a, b) {
            const titleA = $(a).data('title').toLowerCase();
            const titleB = $(b).data('title').toLowerCase();
            return titleB.localeCompare(titleA);
        });
        cardContainer.empty();
        $.each(cards, function (i, card) {
            cardContainer.append(card);
        });
    }

    $('#sort-az-button').click(sortCardsAZ);
    $('#sort-za-button').click(sortCardsZA);

    function setupCardButtons() {
        // Add event handlers for any dynamically added card buttons
        $('.card-container .delete-button').click(function () {
            deleteCard($(this).closest('.card'));
        });

        $('.card-container .edit-button').click(function () {
            editCard($(this).closest('.card'));
        });
    }

    setupCardButtons();
});
