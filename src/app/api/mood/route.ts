import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { content } = await req.json();

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Invalid input. Please provide a valid journal entry in the "content" field.' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        console.log('API Key:', apiKey);
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API Key is missing in environment variables.' }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant named Echo, you analyze users' daily journal entries." },
                {
                    role: "user",
                    content: `You are Echo, a mood companion designed to detect and respond to the user's mood based on their input. Your task is to interpret the emotional tone of the user's message and reply with a single word that best represents their mood. Be concise and accurate in identifying the mood. Examples of moods include 'happy,' 'sad,' 'anxious,' 'excited,' 'calm,' or similar emotional states. From this journal entry: ${content}`,
                },
            ],
        });

        const mood = completion.choices[0]?.message?.content?.trim();

        if (!mood) {
            return NextResponse.json({ error: 'Failed to analyze mood.' }, { status: 500 });
        }

        return NextResponse.json({ mood });
    } catch (error) {
        console.error('Error during mood analysis:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
