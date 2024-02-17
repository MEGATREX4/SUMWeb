$(document).ready(function () {
    $('.edit-button').click(function () {
        const cardDiv = $(this).closest('.card');
        const form = cardDiv.find('.form');
        form.toggle();
        const cardTitle = cardDiv.data('title');
        form.find('.new-title').val(cardTitle);
    });

    

    $('.site-link').each(function () {
        const fulllink = $(this).attr('href');
        if (fulllink) {
            const hostname = new URL(fulllink).hostname;
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

    function saveUpdatedCard(cardDiv, form) {
        const cardId = cardDiv.data('id');
    
        // Retrieve form input values here
        let newTitle = form.find('.new-title').val();
        let newDescription = form.find('.new-description').val();
        let newImage = form.find('.new-image').val();
        let newAuthor = form.find('.new-author').val();
        let newVerified = form.find('.new-verified').prop('checked');
        let newCompleted = form.find('.new-completed').prop('checked');
        let newlink = form.find('.new-link').val();
    
    
        $.ajax({
            type: 'POST',
            url: `/edit_card/${cardId}`,
            data: {
                'new-title': newTitle,
                'new-description': newDescription,
                'new-image': newImage,
                'new-author': newAuthor,
                'new-verified': newVerified,
                'new-completed': newCompleted,
                'new-link': newlink
            },
            contentType: 'application/x-www-form-urlencoded',  // Set the correct Content-Type
            success: function (response) {
                // Handle the success response
            },
            error: function (error) {
                // Handle the error response
            }
        });
        
    }
    

// Update the click event to submit the form
$('.save-button').click(function (event) {
    event.preventDefault();  // Prevent the default form submission
    const cardForm = $(this).closest('form');
    const cardDiv = cardForm.closest('.card');  // Add this line to get the cardDiv
    saveUpdatedCard(cardDiv, cardForm);  // Pass cardDiv and cardForm as arguments
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
        const newlink = $('#new-link').val();
        const newVerified = $('#new-verified').prop('checked');
        const newCompleted = $('#new-completed').prop('checked');

        const formData = JSON.stringify({
            title: newTitle,
            description: newDescription,
            image: newImage,
            verified: newVerified,
            author: newAuthor,
            completed: newCompleted,
            link: newlink,  // Here it is "link"
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
        const currentlink = card.find('.link').find('a').attr('href');

        form.find('.new-title').val(currentTitle);
        form.find('.new-description').val(currentDescription);
        form.find('.new-image').val(currentImage);
        form.find('.new-author').val(currentAuthor);
        form.find('.new-verified').prop('checked', currentVerified);
        form.find('.new-completed').prop('checked', currentCompleted);
        form.find('.new-link').val(currentlink);
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
