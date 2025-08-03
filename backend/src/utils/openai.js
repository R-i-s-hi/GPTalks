import "dotenv/config"

const getOpenAiResponse = async (message) => {

    const url = 'https://openrouter.ai/api/v1/completions';
    const options = {
        method: 'POST',
        headers: {Authorization: `Bearer ${process.env.API_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({model: process.env.MODEL, prompt: message})
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data || !data.choices || !Array.isArray(data.choices) || !data.choices[0]?.text) {
            console.error("Malformed OpenRouter response:", data);
            throw new Error("Failed to retrieve assistant reply.");
        }

        return data.choices[0].text;
    } catch (error) {
        console.error("getOpenAiResponse error:", error);
        return null;
    }
}

export default getOpenAiResponse;