import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is required. Set it in your .env file.");
}

export const openrouter = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://echojournal.life",
        "X-Title": "Echo Space",
    },
});
