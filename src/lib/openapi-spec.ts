

export const openApiSpec: any = {
    openapi: '3.0.0',
    info: {
        title: 'Echo API',
        version: '1.0.0',
        description: 'API documentation for Echo, an AI-powered journaling companion.',
    },
    servers: [
        {
            url: 'https://my-echo.space/api',
            description: 'Production Server',
        },
        {
            url: 'http://localhost:3000/api',
            description: 'Local Development Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    image: { type: 'string' },
                    subscription: { type: 'string', enum: ['free', 'plus', 'admin'] },
                    badge: { type: 'array', items: { type: 'string' } },
                    wantsWeeklyReport: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            MoodEntry: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    mood: { type: 'string' },
                    score: { type: 'number' },
                    comment: { type: 'string' },
                    content: { type: 'string' },
                    imgUrl: { type: 'string' },
                    todo: { type: 'array', items: { type: 'string' } },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            Chat: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    messages: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                role: { type: 'string', enum: ['user', 'ai'] },
                                text: { type: 'string' },
                                timestamp: { type: 'string', format: 'date-time' }
                            }
                        }
                    },
                    threadSummary: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            }
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    paths: {
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                requestBody: {
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password'],
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    image: { type: 'string', format: 'binary' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                },
            },
        },
        '/mood': {
            post: {
                tags: ['Mood & Journal'],
                summary: 'Create a new mood entry',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string' },
                                    imgUrl: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Entry created',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/MoodEntry',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/mood-tracker': {
            get: {
                tags: ['Mood & Journal'],
                summary: 'Get mood tracking data',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of mood entries for tracking',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            mood: { type: 'string' },
                                            score: { type: 'number' },
                                            _id: { type: 'string' },
                                            createdAt: { type: 'string', format: 'date-time' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/entries': {
            get: {
                tags: ['Entry Management'],
                summary: 'Get all entries',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'search',
                        in: 'query',
                        schema: { type: 'string' },
                        description: 'Search term for content or mood'
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of entries',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/MoodEntry' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/entries/{id}': {
            get: {
                tags: ['Entry Management'],
                summary: 'Get specific entry',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Entry details',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MoodEntry' }
                            }
                        }
                    }
                }
            },
            delete: {
                tags: ['Entry Management'],
                summary: 'Delete entry',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Entry deleted',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            patch: {
                tags: ['Entry Management'],
                summary: 'Update entry',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    mood: { type: 'string' },
                                    score: { type: 'number' },
                                    comment: { type: 'string' },
                                    content: { type: 'string' },
                                    imgUrl: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Entry updated' }
                }
            }
        },
        '/chat': {
            post: {
                tags: ['Chat System'],
                summary: 'Send message to Echo',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['message'],
                                properties: {
                                    message: { type: 'string' },
                                    chatId: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'AI Response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        chatId: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Chat System'],
                summary: 'Get chat history',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of chats',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Chat' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/profile': {
            get: {
                tags: ['User Profile'],
                summary: 'Get user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'User profile data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        user: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            put: {
                tags: ['User Profile'],
                summary: 'Update user profile',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    image: { type: 'string' },
                                    currentPassword: { type: 'string' },
                                    newPassword: { type: 'string' },
                                    wantsWeeklyReport: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Profile updated' }
                }
            }
        },
        '/space/draw': {
            get: {
                tags: ['Space'],
                summary: 'Check drawing status',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Status',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        drawCount: { type: 'number' },
                                        canDraw: { type: 'boolean' },
                                        requiresMessage: { type: 'boolean' },
                                        nextAvailableAt: { type: 'string', format: 'date-time' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Space'],
                summary: 'Record drawing',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Drawing recorded' }
                }
            }
        }
    },
};
