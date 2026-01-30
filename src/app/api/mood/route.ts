import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connect } from "@/app/lib/mongodb";
import { auth } from "@/app/lib/auth";
import Mood from "@/app/models/Mood";
import Todo from "@/app/models/Todo";
import { decrypt, encrypt } from "@/app/lib/encryption";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openRouterApiKey = process.env.OPENROUTER_API_KEY;



const openrouter = new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        'HTTP-Referer': 'https://my-echo.space',
        'X-Title': 'Echo Space',
    },
});

export async function POST(req: Request) {
    try {

        const { content, imgUrl } = await req.json();
        if (!content) {
            return NextResponse.json({ error: "Journal entry is required." }, { status: 400 });
        }


        await connect();
        const session = await auth();
        const user = session?.user;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized Request" }, { status: 401 });
        }




        const prompt = `You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should be a JSON object with the following structure:
  - \`mood\`: An object containing:
  - \`label\`: A single, commonly used word that represents the overall emotional tone, avoiding complex or overly paraphrased terms.
  - \`score\`: A numerical rating out of 10, where positive scores indicate positive mood, 0 means neutral negetive score indicated negative mode.
  - \`comment\`: A supportive message based on the mood, offering suggestions for improvement if needed.
    - \`todo\`: An array of objects, where each object represents a meaningful, actionable task identified in the journal entry—either explicitly stated or reasonably inferred. Only include tasks that seem important or relevant to the user's well-being or goals; it's not necessary to list everything.
    Each task should follow this structure:
            - \`todo\`: A clear, concise description of the task or goal.
            - \`type\`: The category of the task (e.g., "mental health", "general", "work", "personal").
            - \`status\`: The current status of the task, such as "pending", "completed", or "in progress".

Ensure the response is empathetic and concise.
Analyze the following journal entry and provide the requested JSON response: "${content}"`;


        let mood, parsedMood, todos = [];
        try {
            const completion = await openrouter.chat.completions.create({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: prompt.replace("Analyze the following journal entry and provide the requested JSON response: \"${content}\"", "")
                    },
                    {
                        role: "user",
                        content: `Analyze the following journal entry and provide the requested JSON response:\n\n"${content}"`
                    },
                ],
            });
            mood = completion.choices[0]?.message?.content?.trim();
        } catch (error) {
            console.error("Error with OpenRouter API:", error);
            return NextResponse.json({ error: "Failed to process mood analysis." }, { status: 500 });
        }
        // const response = result.response;
        // const mood = response.candidates[0].content.parts[0].text;

        // console.log(mood);

        function cleanResponse(response: string) {
            // Remove markdown code blocks
            let cleaned = response.replace(/```json|```/g, '').trim();
            // Replace control characters (newlines, tabs, etc.) within string values
            // This regex finds strings and replaces control characters within them
            cleaned = cleaned.replace(/\\n/g, ' ').replace(/\\r/g, '').replace(/\\t/g, ' ');
            return cleaned;
        }

        //OAI method
        // const completion = await openai.chat.completions.create({
        //     model: "gpt-4",
        //     messages: [
        //         {
        //             role: "system",
        //             content: "You are an AI assistant specialized in mood analysis. Given a journal entry, you will determine the primary mood of the writer. Your response should be a JSON object with the following structure:\n\n- `mood`: An object containing:\n  - `label`: A single word representing the overall emotional tone.\n  - `score`: A numerical rating out of 20, where higher scores indicate a more positive mood.\n  - `comment`: A supportive message based on the mood, offering encouragement or suggestions for improvement if needed.\n\nEnsure the response is empathetic and concise."
        //         },
        //         {
        //             role: "user",
        //             content: `Analyze the following journal entry and provide the requested JSON response:\n\n"${content}"`
        //         },
        //     ],
        // });


        // const mood = completion.choices[0]?.message?.content?.trim();

        // let parsedMood;
        // let todos = [];


        try {
            const cleanedResponse = typeof mood === "string" ? cleanResponse(mood) : mood;

            parsedMood = typeof cleanedResponse === "string" ? JSON.parse(cleanedResponse) : cleanedResponse;


            const extractedTodos = Array.isArray(parsedMood.todo) ? parsedMood.todo : [];

            // If `parsedMood` has a nested "mood" key, extract the inner mood object.
            if (parsedMood.mood) {
                parsedMood = parsedMood.mood;
            }

            todos = extractedTodos.map((item: any) => ({
                todo: item.todo,
                type: item.type,
                status: item.status,
            }));

            // OAI method
            // parsedMood = typeof mood === "string" ? JSON.parse(mood) : mood;
            // If `parsedMood` has a nested "mood" key, extract the correct value
            // if (parsedMood.mood) {
            //     parsedMood = parsedMood.mood; // This ensures you're only getting the inner mood object
            // }
        } catch (error) {
            console.error("Error parsing mood:", error);
            parsedMood = { label: "Unknown", score: 0, comment: "No valid response received." };
        }
        // const parsedMood = typeof mood === "string" ? JSON.parse(mood) : mood;

        if (!mood) {
            return NextResponse.json({ error: "Failed to detect mood." }, { status: 500 });
        }

        await connect();


        const encryptedContent = encrypt(content);

        const newMood = new Mood({
            userId: user?.id,
            mood: parsedMood?.label,
            score: parsedMood?.score,
            comment: parsedMood?.comment,
            content: encryptedContent,
            imgUrl: imgUrl || "",
            // todo: parsedMood?.todo,
            createdAt: new Date(),
        });
        await newMood.save();

        const newTodo = todos.map((item: any) => ({
            userId: user?.id,
            todo: typeof item === 'string' ? item : item.todo,
            type: typeof item === 'string' ? 'general' : item.type,
            status: typeof item === 'string' ? 'pending' : item.status,
        }));
        // console.log("Todo payload before insert:", newTodo);

        if (newTodo.length > 0) {
            await Todo.insertMany(newTodo);
            // console.log("Saved todos:", newTodo);
        }
        return NextResponse.json({
            message: "Mood saved successfully.", mood: parsedMood.label, comment: parsedMood.comment, score: parsedMood.score, todo: parsedMood.todo
        });

    } catch (error) {
        console.error("Error in mood route:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
