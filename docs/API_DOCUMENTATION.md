# Echo API Documentation

## Overview

Echo is an AI-powered journaling companion that helps users track their mood, create journal entries, and receive personalized insights. This document provides comprehensive API documentation for the Echo platform.

**Base URL:** `https://my-echo.space/api`

## Authentication

Echo uses custom JWT (JSON Web Tokens) for authentication. All protected endpoints require a Bearer token in the Authorization header or a session cookie.

### Authentication Header Format
```
Authorization: Bearer <jwt_token>
```

### Getting Access Token
Access tokens are obtained through login and are included in the session object.

---

## API Endpoints

### 🔐 Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:** `multipart/form-data`
```typescript
{
  name: string;           // Required: User's full name
  email: string;          // Required: Valid email address
  password: string;       // Required: Minimum 6 characters
  image?: File;          // Optional: Profile image file
}
```

**Response:** `200 OK`
```json
{
  "message": "User registered successfully. Please check your email for welcome message."
}
```

**Errors:**
- `400`: Missing required fields, password too short, or user already exists
- `500`: Server error

#### POST `/auth/login`
Authenticate user and get JWT token.

**Request Body:** `application/json`
```typescript
{
  email: string;          // Required: User email
  password: string;       // Required: User password
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt_token_string",
  "message": "Login successful."
}
```

**Errors:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Server error

#### POST `/auth/forgot-password`
Send password reset code to user's email.

**Request Body:** `application/json`
```typescript
{
  email: string;          // Required: User email
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset code sent to your email."
}
```

#### POST `/auth/reset-password`
Reset user password using reset code.

**Request Body:** `application/json`
```typescript
{
  email: string;          // Required: User email
  code: string;          // Required: Reset code from email
  newPassword: string;   // Required: New password (min 6 chars)
}
```

---

### 📝 Mood & Journal Endpoints

#### POST `/mood`
Create a new mood entry with AI analysis.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `application/json`
```typescript
{
  content: string;        // Required: Journal entry text
  imgUrl?: string;       // Optional: Image URL for entry
}
```

**Response:** `200 OK`
```json
{
  "_id": "entry_id",
  "userId": "user_id",
  "mood": "happy",
  "score": 8,
  "comment": "It sounds like you're having a wonderful day!",
  "content": "encrypted_content",
  "imgUrl": "image_url",
  "todo": ["suggestion1", "suggestion2"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Features:**
- AI mood analysis using Google Gemini
- Automatic mood scoring (1-10 scale)
- Supportive AI comments
- Todo suggestions based on mood
- End-to-end encryption of content

#### GET `/mood-tracker`
Get user's mood tracking data and badge progress.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "mood": "happy",
    "score": 8,
    "_id": "mood_id",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Features:**
- Badge system with 5 achievement levels
- Email notifications for new badges
- Mood pattern analysis

---

### 📖 Entry Management

#### GET `/entries`
Retrieve user's journal entries with search functionality.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```typescript
search?: string;        // Optional: Search in content and mood
```

**Response:** `200 OK`
```json
[
  {
    "_id": "entry_id",
    "userId": "user_id",
    "mood": "happy",
    "score": 8,
    "comment": "AI supportive comment",
    "content": "decrypted_content",
    "imgUrl": "image_url",
    "todo": ["todo_item"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Features:**
- Automatic content decryption
- Search across mood and content
- Sorted by creation date (newest first)

#### GET `/entries/:id`
Get a specific journal entry by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "entry_id",
  "userId": "user_id",
  "mood": "happy",
  "score": 8,
  "comment": "AI supportive comment",
  "content": "decrypted_content",
  "imgUrl": "image_url",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE `/entries/:id`
Delete a specific journal entry.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Entry deleted successfully"
}
```

#### PATCH `/entries/:id`
Update a specific journal entry.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `application/json`
```typescript
{
  mood?: string;
  score?: number;
  comment?: string;
  content?: string;
  imgUrl?: string;
}
```

---

### 💬 Chat System

#### POST `/chat`
Send a message to Echo AI companion.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `application/json`
```typescript
{
  message: string;        // Required: User message
  chatId?: string;       // Optional: Existing chat ID
}
```

**Response:** `200 OK`
```json
{
  "message": "AI response text",
  "chatId": "chat_session_id"
}
```

**Features:**
- Context-aware conversations
- Empathetic AI responses
- Chat session management
- Previous conversation summaries

#### GET `/chat`
Get user's chat history.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "chat_id",
    "userId": "user_id",
    "messages": [
      {
        "role": "user",
        "text": "Hello",
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      {
        "role": "ai",
        "text": "Hi there! How are you feeling today?",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "threadSummary": "User greeting conversation",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/chat/:id`
Get a specific chat session.

**Headers:** `Authorization: Bearer <token>`

---

### 👤 User Profile

#### GET `/profile`
Get user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "image": "profile_image_url",
    "subscription": "free",
    "badge": ["Echo Sunshine", "Pen Whisperer"],
    "wantsWeeklyReport": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/profile`
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `application/json`
```typescript
{
  name?: string;
  image?: string;
  currentPassword?: string;    // Required if changing password
  newPassword?: string;        // Requires currentPassword
  wantsWeeklyReport?: boolean;
}
```

---

### ✅ Todo Management

#### GET `/todo`
Get user's todo items.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "todos": [
    {
      "_id": "todo_id",
      "userId": "user_id",
      "todo": "Take a walk",
      "type": "mood_suggestion",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PATCH `/todo/:moodId`
Update todo item status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `application/json`
```typescript
{
  status: "completed" | "pending" | "cancelled";
}
```

#### DELETE `/todo/:moodId`
Delete a todo item.

**Headers:** `Authorization: Bearer <token>`

---

### 📝 Blog (Posts) Endpoints

#### GET `/posts`
Retrieve published blog posts.

**Query Parameters:**
```typescript
all?: string;           // Optional: If "true", returns all posts (Admin only)
```

**Response:** `200 OK`
```json
[
  {
    "_id": "post_id",
    "title": "Post Title",
    "slug": "post-slug",
    "content": "Post content...",
    "excerpt": "Short summary",
    "coverImage": "image_url",
    "author": "Admin",
    "tags": ["tag1", "tag2"],
    "published": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST `/posts`
Create a new blog post.

**Headers:** `Authorization: Bearer <token>`
**Required:** Admin subscription level

**Request Body:** `application/json`
```typescript
{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
}
```

#### GET `/posts/:id`
Get a specific blog post by ID or slug.

**Response:** `200 OK`

#### PATCH `/posts/:id`
Update a blog post.

**Headers:** `Authorization: Bearer <token>`
**Required:** Admin subscription level

#### DELETE `/posts/:id`
Delete a blog post.

**Headers:** `Authorization: Bearer <token>`
**Required:** Admin subscription level

---

### 🌌 Space (Ethereal Sanctuary) Endpoints

#### GET `/space/draw`
Check drawing status and rate limits for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "drawCount": 1,
  "canDraw": true,
  "requiresMessage": true,
  "nextAvailableAt": "2024-01-01T00:05:00.000Z"
}
```

#### POST `/space/draw`
Record a drawing activity in the sanctuary.

**Headers:** `Authorization: Bearer <token>`

**Features:**
- Rate limited to 2 draws every 5 minutes.
- Second draw requires posting a positive message first.

#### GET `/space/message`
Retrieve a random positive message from another user.

**Headers:** `Authorization: Bearer <token>`

#### POST `/space/message`
Post a new positive message to the sanctuary.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `application/json`
```typescript
{
  content: string;        // Required: Message text (min 5 chars)
}
```

#### GET `/space/leaderboard`
Get the top contributors to the Ethereal Sanctuary.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "_id": "user_id",
      "count": 15,
      "name": "User Name",
      "image": "profile_image_url"
    }
  ]
}
```

---

### 🔒 Admin Endpoints

#### GET `/admin/stats`
Get admin dashboard statistics.

**Headers:** `Authorization: Bearer <token>`
**Required:** Admin subscription level

**Response:** `200 OK`
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "subscription": "free",
      "entryCount": 25,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "entries": 1250,
  "mood": [
    {
      "mood": "happy",
      "_id": "mood_id"
    }
  ]
}
```

#### PATCH `/admin/user`
Update user information (admin only).

#### DELETE `/admin/user`
Delete user account (admin only).

---

### 🕐 Cron Jobs

#### GET `/cron/reports`
Send weekly mood reports to users.

**Features:**
- Sends personalized HTML email reports
- Includes mood statistics and insights
- Respects user preferences (`wantsWeeklyReport`)
- Rate-limited for email service

#### GET `/cron/daily-notification`
Send daily journaling reminders.

---

## Data Models

### User Schema
```typescript
interface IUser {
  name: string;
  email: string;                    // Unique
  password: string;                 // Hashed with bcrypt
  image: string;                    // Profile image URL
  subscription: 'free' | 'plus' | 'admin';
  badge: string[];                  // Achievement badges
  resetPasswordCode?: string;
  resetPasswordExpires?: Date;
  wantsWeeklyReport?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Mood/Entry Schema
```typescript
interface IMood {
  userId: ObjectId;                 // References User
  mood: string;                     // AI-analyzed mood
  score: number;                    // Mood score (1-10)
  comment: string;                  // AI supportive comment
  content: string;                  // Encrypted journal entry
  imgUrl?: string;                  // Optional image
  todo?: string[];                  // AI suggestions
  createdAt: Date;
}
```

### Chat Schema
```typescript
interface IChat {
  userId: string;
  messages: IMessage[];
  threadSummary?: string;           // AI-generated summary
  createdAt: Date;
  updatedAt: Date;
}

interface IMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
```

### Todo Schema
```typescript
interface ITodo {
  userId: ObjectId;
  todo: string;
  type: 'mood_suggestion' | 'manual';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}
```

### Blog Post Schema
```typescript
interface IPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Space Message Schema
```typescript
interface ISpaceMessage {
  content: string;
  author: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Space Draw Schema
```typescript
interface ISpaceDraw {
  user: ObjectId;
  timestamp: Date;
  contributionId?: ObjectId; // Link to message that unlocked draw
}
```

## Badge System

Echo features a progressive badge system to encourage consistent journaling:

1. **Echo Sunshine** - Default badge (0+ entries)
2. **Pen Whisperer** - 7+ entries
3. **Mindful Scribe** - 30+ entries  
4. **Thought Architect** - 45+ entries
5. **Guardian of Inked Wisdom** - 60+ entries

## Security Features

### Encryption
- End-to-end encryption for journal content using AES-256
- Encrypted data stored in MongoDB
- Automatic decryption on retrieval

### Authentication
- JWT tokens with 30-day expiration
- Secure password hashing with bcrypt
- Session management via NextAuth.js

### Authorization
- Route-level authentication checks
- User-specific data isolation
- Admin-only endpoint protection

## Rate Limiting

- Email services respect provider limits (Resend: 2 req/sec)
- Batch processing for bulk operations
- Graceful error handling for rate limits

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Integration Services

### AI Services
- **Google Gemini 2.0 Flash** - Primary AI for mood analysis and chat
- **OpenAI GPT** - Fallback AI service
- **OpenRouter** - Alternative AI routing

### Email Services  
- **Resend** - Email delivery for reports and notifications

### External APIs
- **UI Avatars** - Default profile image generation
- **Google OAuth** - Social authentication

## Development Notes

### Environment Variables Required
```env
NEXTAUTH_SECRET=your_nextauth_secret
GEMINI_API=your_gemini_api_key
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
MONGODB_URI=your_mongodb_connection
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
```

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Custom JWT with `jose`
- **AI:** Google Generative AI (Gemini 2.0 Flash), OpenAI
- **Email:** Resend
- **Encryption:** Node.js crypto module (AES-256-CBC)
- **Deployment:** Vercel

This API documentation provides a complete reference for integrating with the Echo platform's backend services.
