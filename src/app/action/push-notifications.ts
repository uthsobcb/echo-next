'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
    `mailto:${process.env.NEXT_PUBLIC_MAILADDRESS}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

export async function subscribeUser(subscription: PushSubscription) {
    // In production, store subscription in your database
    return { success: true }
}

export async function unsubscribeUser() {
    // In production, remove subscription from your database
    return { success: true }
}

export async function sendNotification(message: string) {
    try {
        // In production, get all subscriptions from database
        const subscriptions = [] // Get from database

        const payload = JSON.stringify({
            title: 'Echo Notification',
            body: message,
            icon: '/assets/logo.png'
        })

        for (const subscription of subscriptions) {
            await webpush.sendNotification(subscription, payload)
        }

        return { success: true }
    } catch (error) {
        console.error('Error sending push notification:', error)
        return { success: false, error: 'Failed to send notification' }
    }
} 