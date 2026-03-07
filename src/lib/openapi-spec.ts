

export const openApiSpec: any = {
    openapi: '3.0.0',
    info: {
        title: 'Echo API',
        version: '2.0.0',
        description: 'API documentation for Echo, an AI-powered journaling companion with streaks, XP, badges, and community features.',
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
                    badge: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['Echo Sunshine', 'Pen Whisperer', 'Mindful Scribe', 'Thought Architect', 'Guardian of Inked Wisdom']
                        },
                        description: 'Badges earned by journaling. Unlocked at 1, 7, 30, 45, 60 entries.'
                    },
                    wantsWeeklyReport: { type: 'boolean' },
                    currentStreak: { type: 'integer', description: 'Consecutive days journaled' },
                    maxStreak: { type: 'integer', description: 'All-time longest streak' },
                    totalXp: { type: 'integer', description: 'Total XP accumulated' },
                    lastEntryDate: { type: 'string', format: 'date-time', description: 'Date of last journal entry' },
                    timezone: { type: 'string', example: 'America/New_York', description: 'IANA timezone for streak calculation' },
                    pushToken: { type: 'string', description: 'Expo device push token for notifications' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            MoodEntry: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    mood: { type: 'string' },
                    score: { type: 'number', description: 'Mood score (-10 to +10)' },
                    comment: { type: 'string', description: 'AI-generated supportive comment' },
                    content: { type: 'string', description: 'Encrypted journal content' },
                    imgUrl: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                },
            },
            StreakData: {
                type: 'object',
                description: 'Gamification data returned when creating a journal entry',
                properties: {
                    currentStreak: { type: 'integer' },
                    totalXp: { type: 'integer' },
                    milestone: { type: 'string', nullable: true, description: 'Message when hitting a streak milestone (every 7 days). Null if no milestone.' },
                }
            },
            Todo: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    todo: { type: 'string', description: 'Task description' },
                    type: { type: 'string', example: 'mental health', description: 'Category: mental health, work, personal, general' },
                    status: { type: 'string', enum: ['pending', 'in progress', 'completed'] },
                    createdAt: { type: 'string', format: 'date-time' },
                }
            },
            SpaceMessage: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    content: { type: 'string' },
                    author: { type: 'string', description: 'User ID of the author' },
                    createdAt: { type: 'string', format: 'date-time' },
                }
            },
            Post: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    slug: { type: 'string' },
                    author: { type: 'string' },
                    published: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' },
                }
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
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' }
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
        // ─── AUTHENTICATION ────────────────────────────────────────────────────────
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                description: 'Creates a new user account. Sends a welcome email upon success.',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password'],
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 6 },
                                    image: { type: 'string', format: 'binary' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        imageUrl: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    '400': { description: 'Missing fields, weak password, or user already exists' },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                description: 'Authenticates a user and returns a JWT token.',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
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
                                        token: { type: 'string', description: 'JWT Bearer token' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Invalid credentials' },
                },
            },
        },
        '/auth/logout': {
            post: {
                tags: ['Authentication'],
                summary: 'Logout user (API / mobile)',
                description: 'Clears the auth cookie. For REST clients, simply discard the token.',
                responses: {
                    '200': { description: 'Logged out successfully' }
                }
            },
            get: {
                tags: ['Authentication'],
                summary: 'Logout & redirect (web)',
                description: 'Clears the auth cookie and redirects to the home page. For browsers only.',
                responses: {
                    '302': { description: 'Redirect to home page' }
                }
            }
        },
        '/auth/forgot-password': {
            post: {
                tags: ['Authentication'],
                summary: 'Request password reset code',
                description: 'Sends a 6-digit verification code to the user\'s email. The code expires in 5 minutes.',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email'],
                                properties: {
                                    email: { type: 'string', format: 'email' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Verification code sent to email' },
                    '400': { description: 'Email required or user not found' },
                }
            }
        },
        '/auth/reset-password': {
            post: {
                tags: ['Authentication'],
                summary: 'Reset password with verification code',
                description: 'Takes the email, 6-digit code, and new password. The code must be valid and unexpired.',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'code', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    code: { type: 'string', description: '6-digit code from email' },
                                    password: { type: 'string', description: 'New password' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Password successfully reset' },
                    '400': { description: 'Invalid or expired code' },
                }
            }
        },

        // ─── USER PROFILE ──────────────────────────────────────────────────────────
        '/profile': {
            get: {
                tags: ['User Profile'],
                summary: 'Get user profile',
                description: 'Returns the authenticated user\'s full profile including streak and XP stats.',
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
                description: 'Update name, avatar, or password.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    image: { type: 'string', description: 'Image URL or base64' },
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
        '/users/push-token': {
            post: {
                tags: ['User Profile'],
                summary: 'Save Expo push token & timezone',
                description: 'Called by the mobile app after notification permission is granted. Stores the Expo push token and IANA timezone for streak reminders.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string', example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' },
                                    timezone: { type: 'string', example: 'America/New_York', description: 'IANA timezone string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Push data updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        pushToken: { type: 'string' },
                                        timezone: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        // ─── MOOD & JOURNAL ────────────────────────────────────────────────────────
        '/mood': {
            post: {
                tags: ['Mood & Journal'],
                summary: 'Create a new journal entry',
                description: `Submits a new journal entry. The backend will:
- Run AI mood analysis (label, score, comment).
- Extract actionable todos from the entry.
- Calculate streak & award XP (+10 base, +50 bonus at every 7-day streak milestone).
- Return gamification data in \`streakData\`.`,
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string', description: 'The journal entry text' },
                                    imgUrl: { type: 'string', description: 'Optional image attachment URL' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Entry created with gamification data',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        mood: { type: 'string' },
                                        comment: { type: 'string' },
                                        score: { type: 'number' },
                                        todo: { type: 'array', items: { type: 'object' } },
                                        streakData: { $ref: '#/components/schemas/StreakData' }
                                    }
                                },
                            },
                        },
                    },
                    '401': { description: 'Unauthorized' },
                    '500': { description: 'AI processing or server error' },
                },
            },
        },
        '/mood-tracker': {
            get: {
                tags: ['Mood & Journal'],
                summary: 'Get mood tracking data & check badge progress',
                description: 'Returns mood history for charts. Also checks badge eligibility based on total entries and sends a badge-earned email if a new badge is unlocked.\n\n**Badge milestones:**\n- 7 entries → Pen Whisperer\n- 30 entries → Mindful Scribe\n- 45 entries → Thought Architect\n- 60 entries → Guardian of Inked Wisdom',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of mood data points',
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
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        // ─── ENTRY MANAGEMENT ──────────────────────────────────────────────────────
        '/entries': {
            get: {
                tags: ['Entry Management'],
                summary: 'Get all journal entries',
                description: 'Returns decrypted entries for the authenticated user. Supports text search.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'search',
                        in: 'query',
                        schema: { type: 'string' },
                        description: 'Filter by content or mood keyword'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Array of entries',
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
                summary: 'Get a single entry',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    '200': {
                        description: 'Entry details',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/MoodEntry' } } }
                    },
                    '404': { description: 'Entry not found' }
                }
            },
            patch: {
                tags: ['Entry Management'],
                summary: 'Update a journal entry',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
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
            },
            delete: {
                tags: ['Entry Management'],
                summary: 'Delete a journal entry',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    '200': { description: 'Entry deleted' },
                    '404': { description: 'Entry not found' }
                }
            },
        },

        // ─── TODOS ─────────────────────────────────────────────────────────────────
        '/todo': {
            get: {
                tags: ['Todos'],
                summary: 'List all todos',
                description: 'Returns AI-extracted tasks from all journal entries for the authenticated user, sorted newest first.',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of todos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        todos: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Todo' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/todo/{id}': {
            patch: {
                tags: ['Todos'],
                summary: 'Update a todo',
                description: 'Update a todo\'s text or status.',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Todo ID' }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    oldTask: { type: 'string', description: 'Existing task text (used as a filter for safety)' },
                                    newTask: { type: 'string', description: 'New task text' },
                                    status: { type: 'string', enum: ['pending', 'in progress', 'completed'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Todo updated',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        todo: { $ref: '#/components/schemas/Todo' }
                                    }
                                }
                            }
                        }
                    },
                    '404': { description: 'Todo not found' }
                }
            },
            delete: {
                tags: ['Todos'],
                summary: 'Delete a todo',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Todo ID' }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['task'],
                                properties: {
                                    task: { type: 'string', description: 'Task text (required for confirmation)' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Todo deleted' },
                    '404': { description: 'Todo not found or already deleted' }
                }
            }
        },

        // ─── CHAT ──────────────────────────────────────────────────────────────────
        '/chat': {
            post: {
                tags: ['Chat'],
                summary: 'Send a message to Echo AI',
                description: 'Continues or starts an AI conversation thread. Pass `chatId` to continue an existing thread.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['message'],
                                properties: {
                                    message: { type: 'string' },
                                    chatId: { type: 'string', description: 'Existing chat ID (omit to start a new thread)' }
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
                tags: ['Chat'],
                summary: 'Get all chat threads',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of chat threads',
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

        // ─── SPACE ─────────────────────────────────────────────────────────────────
        '/space/message': {
            post: {
                tags: ['Space'],
                summary: 'Post an anonymous message to Space',
                description: 'Shares an anonymous message with the community. Requires at least 5 characters. Users must have earned a draw from `/space/draw` first.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['content'],
                                properties: {
                                    content: { type: 'string', minLength: 5 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Message posted',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        data: { $ref: '#/components/schemas/SpaceMessage' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Space'],
                summary: 'Get a random Space message',
                description: 'Returns a random community message from another user (never your own).',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'A random message',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/SpaceMessage' }
                                    }
                                }
                            }
                        }
                    },
                    '404': { description: 'No messages available from other users yet' }
                }
            }
        },
        '/space/draw': {
            get: {
                tags: ['Space'],
                summary: 'Check Space drawing status',
                description: 'Returns whether the user is allowed to post to Space based on their activity.',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Drawing status',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        drawCount: { type: 'number' },
                                        canDraw: { type: 'boolean' },
                                        requiresMessage: { type: 'boolean', description: 'True if the user must post a message before drawing again' },
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
                summary: 'Record a Space draw',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Draw recorded' }
                }
            }
        },
        '/space/leaderboard': {
            get: {
                tags: ['Space'],
                summary: 'Get Space leaderboard',
                description: 'Returns the top 10 community contributors, ranked by number of Space messages posted.',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Top contributors',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    _id: { type: 'string' },
                                                    count: { type: 'number', description: 'Number of messages posted' },
                                                    name: { type: 'string' },
                                                    image: { type: 'string' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        // ─── POSTS (Blog) ──────────────────────────────────────────────────────────
        '/posts': {
            get: {
                tags: ['Blog Posts'],
                summary: 'Get published posts',
                description: 'Returns all published posts by default. Pass `?all=true` (admin only) to include unpublished drafts.',
                security: [],
                parameters: [
                    {
                        name: 'all',
                        in: 'query',
                        schema: { type: 'string', enum: ['true', 'false'] },
                        description: 'Pass `true` to include unpublished posts (admin only)'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Array of posts',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Post' }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Blog Posts'],
                summary: 'Create a new post (Admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title', 'content', 'slug'],
                                properties: {
                                    title: { type: 'string' },
                                    content: { type: 'string' },
                                    slug: { type: 'string', description: 'URL-safe identifier, must be unique' },
                                    published: { type: 'boolean', default: false }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Post created' },
                    '400': { description: 'Missing fields or duplicate slug' },
                    '401': { description: 'Admin access required' }
                }
            }
        },

        // ─── CRON JOBS ─────────────────────────────────────────────────────────────
        '/cron/reports': {
            get: {
                tags: ['Cron Jobs'],
                summary: 'Send weekly mood reports (Cron)',
                description: 'Triggered by a weekly scheduler. Sends a mood summary email to all users who have `wantsWeeklyReport: true`.',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Weekly reports sent successfully' },
                    '500': { description: 'Error sending reports' }
                }
            }
        },
        // ─── INSIGHTS ──────────────────────────────────────────────────────────────
        '/insights': {
            get: {
                tags: ['Insights'],
                summary: 'Get personalised journaling analytics',
                description: `Returns a rich analytics payload for the authenticated user. All date groupings respect the user's stored **timezone**.

**Range options:**
- \`week\` — last 7 days
- \`month\` — last 30 days
- \`year\` — last 365 days

**AI Insights** are generated by GPT-4o-mini and cached once per day per user to avoid excess LLM calls.

**Topic classification buckets:** Work, Family, Health, Goals, Gratitude.

**Writing trend comparison** compares entry count in the current period vs the equivalent previous period (e.g. last 7 days vs the 7 days before).`,
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'range',
                        in: 'query',
                        required: false,
                        schema: { type: 'string', enum: ['week', 'month', 'year'], default: 'week' },
                        description: 'Time range for analytics'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Insights payload',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        stats: {
                                            type: 'object',
                                            properties: {
                                                totalEntries: { type: 'integer' },
                                                currentStreak: { type: 'integer' },
                                                bestStreak: { type: 'integer' },
                                                avgWordCount: { type: 'integer' }
                                            }
                                        },
                                        moodTimeline: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    day: { type: 'string', example: 'Mon' },
                                                    date: { type: 'string', example: '2026-03-01' },
                                                    mood: { type: 'string' },
                                                    score: { type: 'number' }
                                                }
                                            }
                                        },
                                        writingTrend: {
                                            type: 'array',
                                            description: 'Daily entry counts across the range',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    label: { type: 'string', example: 'Mar 1' },
                                                    count: { type: 'integer' }
                                                }
                                            }
                                        },
                                        weeklyEntries: {
                                            type: 'array',
                                            description: 'Entries grouped by week',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    label: { type: 'string', example: 'W1' },
                                                    count: { type: 'integer' }
                                                }
                                            }
                                        },
                                        topTopics: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    topic: { type: 'string', enum: ['Work', 'Family', 'Health', 'Goals', 'Gratitude'] },
                                                    count: { type: 'integer' }
                                                }
                                            }
                                        },
                                        commonWords: {
                                            type: 'array',
                                            description: 'Top 10 words after stop-word filtering',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    word: { type: 'string' },
                                                    frequency: { type: 'integer' }
                                                }
                                            }
                                        },
                                        activityCalendar: {
                                            type: 'array',
                                            description: 'One object per day in the range',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    date: { type: 'string', example: '2026-03-01' },
                                                    hasEntry: { type: 'boolean' }
                                                }
                                            }
                                        },
                                        aiInsights: {
                                            type: 'array',
                                            description: '2 LLM-generated motivational bullets, cached once per day per user',
                                            items: { type: 'string' },
                                            example: ['📈 You\'ve been more consistent this week!', '💡 Your best entries are written before noon.']
                                        },
                                        writingTrendComparison: {
                                            type: 'string',
                                            description: 'Entry count change vs previous equal-length period',
                                            example: '+23%'
                                        },
                                        badgeProgress: {
                                            type: 'object',
                                            properties: {
                                                earned: { type: 'array', items: { type: 'string' } },
                                                nextBadge: { type: 'string', nullable: true },
                                                nextBadgeAt: { type: 'integer', nullable: true },
                                                entriesUntilNext: { type: 'integer' },
                                                milestones: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            name: { type: 'string' },
                                                            threshold: { type: 'integer' },
                                                            earned: { type: 'boolean' }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        xpStatus: {
                                            type: 'object',
                                            properties: {
                                                totalXp: { type: 'integer' },
                                                currentStreak: { type: 'integer' },
                                                maxStreak: { type: 'integer' },
                                                subscription: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': { description: 'Invalid range parameter' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'User not found' }
                }
            }
        },

        '/cron/reminders': {
            get: {
                tags: ['Cron Jobs'],
                summary: 'Send streak reminders (Cron)',
                description: `Triggered **hourly** by a scheduler. For each user with a Push Token:
- Calculates the user's current local hour using their saved \`timezone\`.
- If it is **8:00 PM (20:00) local time** and they have **not journaled today**, sends an Expo push notification: *"Don't lose your streak! Journal now!"*

**Vercel Cron setup** — add to \`vercel.json\`:
\`\`\`json
{ "crons": [{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }] }
\`\`\``,
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Cron job completed',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Processed 42 users, sent 5 reminders.' }
                                    }
                                }
                            }
                        }
                    },
                    '500': { description: 'Internal server error' }
                }
            }
        }
    },
};
