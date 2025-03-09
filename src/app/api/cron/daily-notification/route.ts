import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Send notification to all subscribed users
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
            },
            body: JSON.stringify({
                app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
                included_segments: ['Subscribed Users'],
                contents: {
                    en: "Hey! Time to check in with Echo. How are you feeling today?"
                },
                name: "Daily Check-in Reminder",
                send_after: "8:00PM",
                delayed_option: "timezone",
                delivery_time_of_day: "8:00PM",
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send notification');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 