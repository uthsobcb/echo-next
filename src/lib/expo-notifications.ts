import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import UserModel from '@/app/models/User';

let expo = new Expo();

export async function sendPushNotification(tokens: string[], message: { title: string; body: string; data?: any }) {
    let messages: ExpoPushMessage[] = [];
    for (let pushToken of tokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title: message.title,
            body: message.body,
            data: message.data,
        });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets: ExpoPushTicket[] = [];

    // Send the chunks to the Expo push notification service
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error("Error sending chunk:", error);
        }
    }

    // Handle receipt errors (especially 'DeviceNotRegistered')
    let receiptIds = [];
    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        if (ticket.status === 'error') {
            if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
                const deadToken = messages[i].to as string;
                console.log(`Device not registered for token: ${deadToken}. Removing from database.`);
                await UserModel.updateOne({ pushToken: deadToken }, { $set: { pushToken: null } });
            }
        }
    }

    return tickets;
}
