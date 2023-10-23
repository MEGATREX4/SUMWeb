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
        const cardTitle = cardDiv.data('title');
        if (confirm(`Видалити запис "${cardTitle}"? Дані запису видаляться назавжди.`)) {
            $.ajax({
                type: 'POST',
                url: '/delete_card',
                data: JSON.stringify({ title: cardTitle }),
                contentType: 'application/json',
                success: function () {
                    cardDiv.remove();
                },
            });
        }
    }

    function saveUpdatedCard(cardDiv, form) {
        const cardTitle = cardDiv.data('title');
        const cardTitleElement = cardDiv.find('h3');
        const cardDescriptionElement = cardDiv.find('p');
        const cardImageElement = cardDiv.find('.imageitem');
        const cardAuthorElement = cardDiv.find('.author');
        const cardVerifiedElement = cardDiv.find('.ver');
        const cardCompletedElement = cardDiv.find('.ove');
        const cardLinkElement = cardDiv.find('.site-linka');
    
        let newTitle = form.find('.new-title').val();
        let newDescription = form.find('.new-description').val();
        let newImage = form.find('.new-image').val();
        let newAuthor = form.find('.new-author').val();
        let newVerified = form.find('.new-verified').prop('checked');
        let newCompleted = form.find('.new-completed').prop('checked');
        let newLink = form.find('.new-link').val();
    
        const currentLink = cardLinkElement.attr('href') || '';
    
        const isDataChanged =
            newTitle !== cardTitleElement.text() ||
            newDescription !== cardDescriptionElement.text() ||
            newImage !== cardImageElement.attr('src') ||
            newAuthor !== cardAuthorElement.text() ||
            newVerified !== cardVerifiedElement.text().includes('Так') ||
            newCompleted !== cardCompletedElement.text().includes('Так') ||
            newLink !== currentLink;
    
        if (!isDataChanged) {
            form.hide();
            return;
        }
    
        const formData = {
            title: cardTitle,
        };
    
        if (newTitle) {
            formData.newTitle = encodeURIComponent(newTitle);
        }
        if (newDescription) {
            formData.newDescription = encodeURIComponent(newDescription);
        }
        if (newImage) {
            formData.newImage = encodeURIComponent(newImage);
        }
        if (newAuthor) {
            formData.newAuthor = encodeURIComponent(newAuthor);
        }
        if (newVerified) {
            formData.newVerified = newVerified;
        }
        if (newCompleted) {
            formData.newCompleted = newCompleted;
        }
        if (newLink && newLink !== '#') {
            formData.newLink = encodeURIComponent(newLink);
        }
    
        $.ajax({
            type: 'POST',
            url: '/edit_card',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                form.hide();
                if (formData.newTitle) {
                    cardTitleElement.text(decodeURIComponent(response.title));
                }
                if (formData.newDescription) {
                    cardDescriptionElement.text(decodeURIComponent(response.description));
                }
                if (formData.newImage) {
                    cardImageElement.attr('src', decodeURIComponent(response.image));
                }
                if (formData.newAuthor) {
                    cardAuthorElement.text(decodeURIComponent(response.author));
                }
                if (formData.newVerified) {
                    cardVerifiedElement.text('Офіційно: ' + (response.verified ? 'Так' : 'Ні'));
                }
                if (formData.newCompleted) {
                    cardCompletedElement.text('Завершено: ' + (response.completed ? 'Так' : 'Ні'));
                }
                if (formData.newLink) {
                    cardLinkElement.attr('href', decodeURIComponent(response.link));
                }
            },
        });
    }
    

    $('.save-button').click(function () {
        const cardDiv = $(this).closest('.card');
        const form = cardDiv.find('.form');
        saveUpdatedCard(cardDiv, form);
    });

    $('.cancel-button').click(function () {
        const form = $(this).closest('.form');
        form.hide();
    });

    $('.add-button').click(function () {
        const newTitle = $('#new-title').val();
        const newDescription = $('#new-description').val();
        const newImage = $('#new-image').val();
        const newAuthor = $('#new-author').val();
        const newLink = $('#new-link').val();
        const newVerified = $('#new-verified').prop('checked');
        const newCompleted = $('#new-completed').prop('checked');

        const titleRegex = /^[0-9]*$/;

        if (!titleRegex.test(newTitle)) {
            alert('Помилка: Заголовок повинен починатися не з цифри чи спеціального символу.');
            return;
        }

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
