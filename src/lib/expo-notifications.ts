import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt, ExpoPushErrorReceipt } from 'expo-server-sdk';
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

    const receiptIds: string[] = [];
    const tokenMap: { [id: string]: string } = {};
    
    tickets.forEach((ticket, index) => {
        if ('id' in ticket) {
            receiptIds.push((ticket as any).id);
            tokenMap[(ticket as any).id] = messages[index].to as string;
        }
    });

    let receipts;
    try {
        receipts = await expo.getPushNotificationReceiptsAsync(receiptIds);
    } catch (error) {
        console.error("Error fetching receipts:", error);
        return tickets;
    }

    for (const receiptId of Object.keys(receipts)) {
        const receipt = receipts[receiptId] as ExpoPushReceipt | ExpoPushErrorReceipt;
        if (receipt.status === 'error') {
            const receiptErr = receipt as ExpoPushErrorReceipt;
            if (receiptErr.details && receiptErr.details.error === 'DeviceNotRegistered') {
                const deadToken = tokenMap[receiptId];
                console.log(`Device not registered for token: ${deadToken}. Removing from database.`);
                await UserModel.updateOne({ pushToken: deadToken }, { $set: { pushToken: null } });
            } else if (receiptErr.details && receiptErr.details.error) {
                console.error(`Push notification error: ${receiptErr.details.error}`);
            }
        }
    }

    return tickets;
}
