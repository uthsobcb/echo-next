"use client";

import { useEffect } from 'react';
import { initOneSignal } from '@/lib/onesignal';
import { NotificationPrompt } from '@/components/NotificationPrompt';

export default function OneSignalInitializer() {
    useEffect(() => {
        initOneSignal();
    }, []);

    return <NotificationPrompt />;
} 