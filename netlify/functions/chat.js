const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { prompt } = JSON.parse(event.body);
  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt is required" }),
    };
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: completion.data.choices[0].message.content.trim() }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
