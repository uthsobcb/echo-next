# Echo - Your AI-Powered Journaling Companion

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://my-echo.space)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-blue)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-orange)](https://ai.google.dev/)

> **"Duolingo for your mind"** - Making mental wellness and self-reflection accessible, engaging, and habit-forming through intelligent journaling.

## 🌟 Overview

Echo is an empathetic AI companion that transforms journaling into an intelligent, supportive experience. With advanced mood analysis, personalized insights, and end-to-end encryption, Echo helps users develop consistent self-reflection habits while maintaining complete privacy.

**Live Demo:** [https://my-echo.space](https://my-echo.space)

## ✨ Key Features

### 🧠 AI-Powered Analysis
- **Smart Mood Detection**: Automatic mood analysis using Google Gemini AI
- **Personalized Insights**: AI-generated comments and suggestions based on your entries
- **Conversational AI**: Chat with Echo about your thoughts and feelings
- **Mood Scoring**: 1-10 scale mood tracking with trend analysis

### 📊 Analytics & Tracking
- **Mood Heatmap**: GitHub-style activity visualization
- **Progress Charts**: Track mood patterns over time
- **Weekly Reports**: Automated email summaries of your journey
- **Badge System**: 5-tier achievement system to encourage consistency

### 🔒 Privacy & Security
- **End-to-End Encryption**: AES-256 encryption for all journal entries
- **Secure Authentication**: NextAuth.js with JWT tokens
- **Data Privacy**: Your thoughts remain completely private
- **GDPR Compliant**: Full control over your personal data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google Gemini API key
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/echo-next.git
   cd echo-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables (see [Environment Setup](./docs/ENVIRONMENT_SETUP.md) for details):
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # AI Services
   GEMINI_API=your_gemini_api_key
   OPENAI_API_KEY=your_openai_key
   OPENROUTER_API_KEY=your_openrouter_key
   
   # Email Service
   RESEND_API_KEY=your_resend_api_key
   
   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_oauth_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_secret
   
   # App URLs
   NEXT_PUBLIC_BASEURL=http://localhost:3000
   BASEURL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete API reference with all endpoints
- **[Design Guide](./docs/DESIGN_GUIDE.md)** - UI/UX design system and guidelines
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Lucide React Icons
- **Animations**: Framer Motion
- **Charts**: Recharts, MUI Charts
- **PWA**: next-pwa

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v5
- **File Upload**: Built-in Next.js handling
- **Email**: Resend

### AI & Services
- **Primary AI**: Google Gemini 2.0 Flash
- **Fallback AI**: OpenAI GPT, OpenRouter
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel Platform

### Security
- **Encryption**: Node.js crypto module (AES-256)
- **Password Hashing**: bcryptjs
- **JWT**: jose library
- **Environment**: Secure environment variables

## 🎯 Core Features Deep Dive

### Mood Analysis Pipeline
1. User writes journal entry
2. Content encrypted and stored
3. AI analyzes mood using Gemini
4. Mood score and supportive comment generated
5. Optional todo suggestions created
6. Badge progress updated

### Chat System
- Context-aware conversations with Echo
- Maintains conversation history
- Empathetic responses focused on mental wellness
- No clinical diagnosis, only supportive guidance

### Badge Achievement System
- **Echo Sunshine**: Default badge (Welcome!)
- **Pen Whisperer**: 7+ journal entries
- **Mindful Scribe**: 30+ entries
- **Thought Architect**: 45+ entries  
- **Guardian of Inked Wisdom**: 60+ entries

### Email Automation
- Welcome emails for new users
- Weekly mood reports (optional)
- Badge achievement notifications
- Password reset functionality

## 🛡️ Security Features

### Data Protection
```typescript
// All journal content is encrypted before storage
const encryptedContent = encrypt(journalEntry);
await Mood.create({
  content: encryptedContent,
  // other fields...
});

// Automatic decryption on retrieval
const decryptedContent = decrypt(entry.content);
```

### Authentication Flow
- JWT tokens with 30-day expiration
- Secure password hashing with salt rounds
- Google OAuth integration
- Session management via NextAuth.js

## 📱 API Usage Examples

### Create a Journal Entry
```javascript
const response = await fetch('/api/mood', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: "Today was a great day! I felt really productive and happy.",
    imgUrl: "optional-image-url"
  })
});

const result = await response.json();
// Returns: mood analysis, score, AI comment, and suggestions
```

### Get User's Entries
```javascript
const entries = await fetch('/api/entries', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await entries.json();
// Returns: Array of user's journal entries (decrypted)
```

### Chat with Echo
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "I'm feeling anxious about work today",
    chatId: "optional-existing-chat-id"
  })
});

const { message, chatId } = await response.json();
// Returns: AI response and chat session ID
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Configure domains** (optional)
   - Add custom domain in Vercel settings
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASEURL`

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure responsive design for all devices
- See [Contributing Guide](./docs/CONTRIBUTING.md) for detailed guidelines

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: All green scores
- **Bundle Size**: Optimized with Next.js automatic splitting
- **Database**: Indexed queries for fast data retrieval
- **CDN**: Assets served via Vercel Edge Network

## 🔮 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Voice journaling with speech-to-text
- [ ] Collaborative journaling for couples/families
- [ ] Integration with fitness trackers
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Meditation timer integration

### Completed Features
- [x] Progressive Web App (PWA) support
- [x] Weekly email reports
- [x] Badge achievement system
- [x] Advanced mood analytics
- [x] End-to-end encryption
- [x] AI chat companion

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Vercel** for seamless deployment platform
- **MongoDB** for reliable data storage
- **NextAuth.js** for robust authentication
- **Tailwind CSS** for beautiful styling
- **Our users** for their feedback and support

## 📞 Support

- **Documentation**: [API Docs](./docs/API_DOCUMENTATION.md) | [Design Guide](./docs/DESIGN_GUIDE.md) | [Quick Reference](./docs/QUICK_REFERENCE.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/echo-next/issues)
- **Email**: support@my-echo.space
- **Website**: [https://my-echo.space](https://my-echo.space)

---

**Made with ❤️ by the Echo Team**

*"Every mood is a step in your journey"* ✨
