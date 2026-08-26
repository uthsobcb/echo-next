# Echo Quick Reference

A developer's cheat sheet for the Echo project.

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
npm test              # Run tests

# Database
mongod                 # Start local MongoDB
mongo echo            # Connect to echo database

# Git
git checkout -b feature/name  # Create feature branch
git commit -m "feat: description"  # Conventional commit
```

## 🔗 Quick Links

- **Live App:** https://echojournal.life
- **API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Design Guide:** [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
src/app/
├── api/                 # API routes
│   ├── auth/           # Authentication
│   ├── mood/           # Mood analysis
│   ├── chat/           # AI chat
│   └── entries/        # Journal entries
├── components/         # Reusable components
├── lib/               # Utilities
├── models/            # Database schemas
└── [pages]/           # App pages
```

## 🔑 Key Environment Variables

```env
MONGODB_URI=            # Database connection
JWT_SECRET=             # Signs session cookies
LEGACY_JWT_SECRET=      # Previous JWT_SECRET, during rotation only
ENCRYPTION_SECRET_KEY=  # Encrypts entries at rest — back this up
CRON_SECRET=            # Authorizes /api/cron/* endpoints
OPENROUTER_API_KEY=     # AI (or AI_BASE_URL / AI_MODEL for local inference)
AI_DAILY_LIMIT=         # Per-user daily AI cap; 0 disables (optional)
RESEND_API_KEY=         # Email service
GOOGLE_CLIENT_ID=       # OAuth (optional)
```

## 📊 Data Models

### User
```typescript
{
  name: string;
  email: string;
  subscription: 'free' | 'plus' | 'admin';
  badge: string[];
  wantsWeeklyReport: boolean;
}
```

### Mood Entry
```typescript
{
  userId: ObjectId;
  mood: string;          // AI-analyzed
  score: number;         // 1-10 scale
  content: string;       // Encrypted
  comment: string;       // AI comment
  todo?: string[];       // AI suggestions
}
```

### Chat
```typescript
{
  userId: string;
  messages: Array<{
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
  }>;
  threadSummary?: string;
}
```

## 🎨 Common CSS Classes

```css
/* Buttons */
.btn-primary           /* Main action buttons */
.btn-secondary         /* Secondary actions */
.btn-icon             /* Icon buttons */

/* Cards */
.card                 /* Basic card */
.entry-card           /* Journal entry cards */
.feature-card         /* Landing page features */

/* Layout */
.container            /* Responsive container */
.grid-responsive      /* Responsive grid */
.nav-container        /* Navigation wrapper */
```

## 🔌 API Endpoints Quick Reference

### Authentication
```
POST /api/auth/register    # Register user
POST /api/auth/login       # Login user  
POST /api/auth/forgot-password  # Reset password
```

### Mood & Entries
```
POST /api/mood            # Create mood entry
GET  /api/entries         # Get user entries
GET  /api/entries/:id     # Get specific entry
DELETE /api/entries/:id   # Delete entry
```

### Chat
```
POST /api/chat           # Send message to AI
GET  /api/chat           # Get chat history
GET  /api/chat/:id       # Get specific chat
```

### User Profile
```
GET  /api/profile        # Get user profile
PUT  /api/profile        # Update profile
```

### Analytics
```
GET /api/mood-tracker    # Get mood data + badges
```

## 🧠 AI Integration

### Mood Analysis
```typescript
const response = await fetch('/api/mood', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: journalText })
});
```

### Chat with Echo
```typescript
const response = await fetch('/api/chat', {
  method: 'POST', 
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ 
    message: userMessage,
    chatId: existingChatId 
  })
});
```

## 🔒 Security Patterns

### API Route Protection
```typescript
export async function POST(req: NextRequest) {
  // 1. Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // 2. Process request
  // 3. Return response
}
```

### Data Encryption
```typescript
import { encrypt, decrypt } from '@/app/lib/encryption';

// Encrypt before storing
const encrypted = encrypt(sensitiveData);
await Model.create({ content: encrypted });

// Decrypt when retrieving
const decrypted = decrypt(entry.content);
```

## 🎯 Badge System

```typescript
const badges = [
  { name: "Echo Sunshine", entries: 0 },      // Default
  { name: "Pen Whisperer", entries: 7 },      // Week streak
  { name: "Mindful Scribe", entries: 30 },    // Month milestone  
  { name: "Thought Architect", entries: 45 }, // Advanced user
  { name: "Guardian of Inked Wisdom", entries: 60 } // Master
];
```

## 📧 Email Templates

### Welcome Email
```typescript
await resend.emails.send({
  from: "Echo☁️ <echo@uthsob.ninja>",
  to: user.email,
  subject: "Welcome to Echo!",
  html: welcomeTemplate
});
```

### Weekly Report
```typescript
const emailHtml = `
  <div style="background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%);">
    <!-- Mood insights and progress -->
  </div>
`;
```

## 🚨 Error Handling

```typescript
try {
  const result = await riskyOperation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  return NextResponse.json(
    { error: "Something went wrong" }, 
    { status: 500 }
  );
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
/* xs: 0-475px */
/* sm: 476-640px */  
/* md: 641-768px */
/* lg: 769-1024px */
/* xl: 1025-1280px */
/* 2xl: 1281px+ */

@media (max-width: 640px) {
  .mobile-hidden { display: none; }
  .mobile-full { width: 100% !important; }
}
```

## 🔧 Debugging Tips

### Development Tools
```bash
# Enable MongoDB debug logs
DEBUG=mongodb:* npm run dev

# Check API responses
console.log('API Response:', await response.json());

# Test database connection
await mongoose.connection.db.admin().ping();
```

### Common Fixes
```bash
# Clear Next.js cache
rm -rf .next

# Reset node_modules
rm -rf node_modules && npm install

# Check environment variables
console.log(process.env.OPENROUTER_API_KEY);
```

## 🧪 Testing Patterns

### API Testing
```typescript
describe('/api/mood', () => {
  it('creates mood entry', async () => {
    const res = await request(app)
      .post('/api/mood')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Test entry' });
    
    expect(res.status).toBe(200);
    expect(res.body.mood).toBeDefined();
  });
});
```

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';

test('renders mood card', () => {
  render(<MoodCard mood="happy" score={8} />);
  expect(screen.getByText('happy')).toBeInTheDocument();
});
```

## 🌟 Performance Tips

### Image Optimization
```jsx
import Image from 'next/image';

<Image 
  src="/assets/logo.png"
  alt="Echo Logo"
  width={46} 
  height={46}
  priority={true}  // For above-the-fold images
/>
```

### Database Optimization
```typescript
// Use indexes
await User.createIndex({ email: 1 });
await Mood.createIndex({ userId: 1, createdAt: -1 });

// Limit query results
const entries = await Mood.find({ userId }).limit(20).sort({ createdAt: -1 });
```

## 📦 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected and seeded
- [ ] AI API keys working
- [ ] Email service configured
- [ ] Domain/SSL setup
- [ ] Health checks passing
- [ ] Error tracking enabled

## 🆘 Emergency Fixes

### App Won't Start
```bash
# Check port conflicts
lsof -ti:3000 | xargs kill -9

# Verify environment
node -e "console.log(process.env.MONGODB_URI)"
```

### Database Issues
```bash
# Test connection
mongosh "mongodb://your-connection-string"

# Reset collections (DEV ONLY)
db.moods.deleteMany({})
db.users.deleteMany({})
```

### Build Failures
```bash
# Type check
npx tsc --noEmit

# Lint check  
npm run lint -- --fix
```

---

**Quick Help:** For detailed information, check the full documentation files in this repository.

**Need Support?** Open a GitHub issue or check existing discussions.
