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
        return data.choices[0].text;
    } catch (error) {
        console.error(error);
    }
}

export default getOpenAiResponse;