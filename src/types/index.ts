export interface Message {
    role: 'user' | 'ai';
    text: string;
    timestamp: Date | string;
}

export interface Chat {
    _id: string;
    messages: Message[];
    updatedAt: Date | string;
    createdAt?: Date | string;
    userId?: string;
}

export interface ApiError {
    message: string;
    error?: string;
    [key: string]: any; // Keep specific flexible fields if necessary, but try to minimize
}
