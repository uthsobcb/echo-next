import OpenAI from "openai";

export const openrouter = new OpenAI({
    // A placeholder keeps builds secret-free. Requests still fail clearly when a
    // hosted provider needs a key and none was supplied. Local providers often
    // accept any non-empty value.
    apiKey: process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || "local-no-key",
    baseURL: process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000",
        "X-Title": "Echo",
    },
});
