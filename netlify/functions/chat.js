const { Configuration, OpenAIApi } = require("openai");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const { prompt, history } = JSON.parse(event.body);
  if (!prompt || !history) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Prompt and history are required" }),
    };
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: history,
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
