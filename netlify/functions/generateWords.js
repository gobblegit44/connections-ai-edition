const fetch = require('node-fetch');

// Helper to get today's date as YYYY-MM-DD
function getTodayString() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

exports.handler = async (event, context) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OpenAI API key not configured.' })
    };
  }

  // Use today's date in the prompt so the set is different every day
  const today = getTodayString();
  const prompt = `Generate 4 groups of 4 unique, creative, AI-related words each (total 16 words) for the date ${today}. Each group should have a clear, distinct AI-related theme. Format your response as JSON: [{\"group\":\"Group Name\", \"words\":[\"word1\",\"word2\",\"word3\",\"word4\"]}, ...]. Do not include any explanation.`;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.8,
        n: 1,
        stop: ['\n']
      })
    });
    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].text) {
      throw new Error('No choices returned from OpenAI');
    }
    // Parse the words
    const wordsRaw = data.choices[0].text.trim();
    let words;
    try {
      words = JSON.parse(wordsRaw);
    } catch (err) {
      throw new Error('Invalid JSON response from OpenAI');
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ date: today, words })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
