const form = document.getElementById('translationForm');
const submitButton = document.querySelector('.submit');
const discordWebhookUrl = 'https://discord.com/api/webhooks/1201289349308874863/YfVwUk2F2_DgZCJdcD_2CRA5YtOE8eGcgjIwH-STiOTkkp2_0md3woK9oVydSEn2D7Pv';

submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (form.checkValidity()) {
        const formData = new FormData(form);

        // URL address of your Google Forms
        const googleFormsUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSd-uYhHxSskbOC_64FonftTAV6zjs2yiyAP4kMU62v17TSdhg/formResponse';

        try {
            // Send POST request to Google Forms
            const response = await fetch(googleFormsUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            // Send message to Discord webhook
            const senderNick = formData.get('entry.748306319');
            const senderImageLink = formData.get('entry.1661456688');
            const senderTranslationLink = formData.get('entry.1518902061');
            const addedTranslation = formData.get('entry.1702188272');
            const senderContact = formData.get('entry.130460730');

            const webhookBody = {
                embeds: [{
                    title: 'Новий переклад',
                    fields: [
                        { name: 'Нік', value: senderNick },
                        { name: 'Посилання на картинку', value: senderImageLink },
                        { name: 'Посилання на мод/переклад', value: senderTranslationLink },
                        { name: 'Додали переклад в мод', value: addedTranslation },
                        { name: 'Е-мейл/Телеграм', value: senderContact },
                    ]
                }],
            };

            const discordResponse = await fetch(discordWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookBody),
            });

            // Redirect to another page after successful submission
            if (response.ok && discordResponse.ok) {
                window.location.href = '/submited.html';
            } else {
                window.location.href = '/submited.html';
            }
        } catch (error) {
            alert('Будь ласка, заповніть всі обов\'язкові поля.');
        }
    }
});