const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo';
const TIMEOUT_MS = 30000;

/**
 * Calls OpenAI GPT API to generate a text suggestion for the given prompt.
 * @param {string} userPrompt - User's description (e.g. "I am unemployed with no income. Help me describe my financial hardship.")
 * @param {string} fieldContext - Which field this is for (e.g. "current financial situation")
 * @returns {Promise<{ text: string }>} - The generated text
 * @throws {Error} - On API error, timeout, or missing API key
 */
export async function generateSuggestion(userPrompt, fieldContext) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('NO_API_KEY');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const systemPrompt = `You are a helpful assistant for a government social support application. The user is describing their situation for the field: "${fieldContext}". Generate a clear, professional, and concise paragraph (2-4 sentences) that they can use in their application. Write in the same language as the user's message. Do not add headings or bullet points.`;
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt || 'Help me describe my situation.' },
        ],
        max_tokens: 300,
        temperature: 0.6,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const message = errBody?.error?.message || response.statusText;
      throw new Error(message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';
    if (!text) throw new Error('Empty response from API');
    return { text };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('TIMEOUT');
    }
    throw err;
  }
}
