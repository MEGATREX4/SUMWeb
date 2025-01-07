exports.handler = async (event, context) => {
    // Доступ до змінної середовища
    const webhookUrl = process.env.DISCORD_WEBHOOK;
  
    if (!webhookUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "DISCORD_WEBHOOK не встановлено" }),
      };
    }
  
    // Приклад обробки запиту
    if (event.httpMethod === "POST") {
      try {
        const body = JSON.parse(event.body);
  
        // Надсилаємо запит на Discord Webhook
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
  
        return {
          statusCode: response.status,
          body: JSON.stringify({ message: "Дані відправлено успішно" }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }
    }
  
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Метод не дозволено" }),
    };
  };
  