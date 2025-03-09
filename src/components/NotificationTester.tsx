'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

export default function NotificationTester() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

    const getSubscription = async () => {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)

        // Log subscription details for testing
        if (sub) {
            console.log('Current subscription:', JSON.stringify(sub))
        }
    }

    const testNotification = async () => {
        try {
            const response = await fetch('/api/test-notification')
            const data = await response.json()

            if (data.success) {
                toast.success('Test notification sent!')
            } else {
                toast.error('Failed to send test notification')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error sending test notification')
        }
    }

    return (
        <div className="flex gap-4">
            <button
                onClick={getSubscription}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
                Get Subscription
            </button>
            <button
                onClick={testNotification}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Send Test Notification
            </button>
        </div>
    )
} 