import "dotenv/config"

const getOpenAiResponse = async (message , model) => {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: message
              }  
            ] 
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        const reply = data?.choices?.[0]?.message?.content;
        if (!reply) {
            console.error("Malformed OpenRouter response:", data);
            return null;
        }
        return reply;
    } catch (error) {
        console.error("getOpenAiResponse error:", error);
        return null;
    }
};

export default getOpenAiResponse;