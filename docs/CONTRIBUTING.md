# Contributing to Echo

Welcome to Echo! We're excited that you're interested in contributing to making journaling more accessible and intelligent for everyone. This guide will help you get started.

## 🌟 Ways to Contribute

### Code Contributions
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 🚀 Performance optimizations
- 📱 Mobile and responsive improvements
- 🔒 Security enhancements

### Non-Code Contributions
- 📝 Documentation improvements
- 🎨 Design and UI/UX suggestions
- 🧪 Testing and quality assurance
- 🌍 Translations and accessibility
- 💡 Feature ideas and feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Git
- MongoDB (local or cloud)
- An OpenRouter API key, or any OpenAI-compatible endpoint (local inference works)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/your-username/echo-next.git
   cd echo-next
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   # Copy the environment template
   cp ENVIRONMENT_SETUP.md .env.local
   # Edit .env.local with your actual API keys
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   - Navigate to `http://localhost:3000`
   - Create a test account
   - Write a journal entry to test AI integration

## 📋 Development Guidelines

### Code Style

#### JavaScript/TypeScript
```javascript
// Use descriptive variable names
const userMoodData = await fetchMoodData(userId);

// Prefer async/await over promises
const result = await apiCall();

// Use proper error handling
try {
  const data = await riskyOperation();
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('User-friendly error message');
}
```

#### React Components
```jsx
// Use functional components with hooks
function MoodCard({ mood, score, comment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mood-card">
      {/* Component JSX */}
    </div>
  );
}

// Prop validation (when using TypeScript)
interface MoodCardProps {
  mood: string;
  score: number;
  comment: string;
}
```

#### CSS/Tailwind
```css
/* Follow the design system */
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded;
}

/* Use consistent spacing */
.card {
  @apply p-6 bg-white rounded-lg shadow-md;
}

/* Mobile-first responsive design */
.grid-layout {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}
```

### File Organization

```
src/
├── app/
│   ├── api/          # API routes
│   ├── components/   # Reusable UI components
│   ├── lib/         # Utility functions
│   ├── models/      # Database models
│   └── [pages]/     # Page components
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

### API Development

#### Endpoint Structure
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "auth";
import { connect } from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Connect to database
    await connect();

    // 3. Process request
    const data = await processRequest();

    // 4. Return response
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```

#### Database Operations
```typescript
// Use proper error handling and validation
export async function createMoodEntry(userId: string, moodData: MoodInput) {
  try {
    // Validate input
    if (!userId || !moodData.content) {
      throw new Error("Missing required fields");
    }

    // Encrypt sensitive data
    const encryptedContent = encrypt(moodData.content);

    // Create entry
    const mood = new Mood({
      userId,
      content: encryptedContent,
      ...moodData
    });

    return await mood.save();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}
```

### Component Development

#### Reusable Components
```jsx
// Create flexible, reusable components
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
```javascript
// API endpoint tests
describe('/api/mood', () => {
  it('should create a mood entry', async () => {
    const response = await request(app)
      .post('/api/mood')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        content: 'Test journal entry'
      });

    expect(response.status).toBe(200);
    expect(response.body.mood).toBeDefined();
  });
});

// Component tests
describe('MoodCard', () => {
  it('should render mood information', () => {
    render(<MoodCard mood="happy" score={8} comment="Great day!" />);
    
    expect(screen.getByText('happy')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });
});
```

## 📝 Pull Request Process

### Before Submitting

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Your Changes**
   - Follow the coding guidelines
   - Write tests for new features
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm test
   npm run build
   npm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add mood sharing feature"
   # or
   git commit -m "fix: resolve authentication bug"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(api): add mood sharing endpoint"
git commit -m "fix(auth): resolve token expiration bug"
git commit -m "docs: update API documentation"
git commit -m "style: format component files"
```

### Pull Request Template

When you create a pull request, please include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
Add screenshots to show the changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🐛 Reporting Bugs

### Before Reporting
1. Check if the bug has already been reported
2. Try to reproduce the bug consistently
3. Gather relevant information (browser, OS, etc.)

### Bug Report Template
```markdown
**Describe the Bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS, Windows, macOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone6, Desktop]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Before Requesting
1. Check if the feature has already been requested
2. Consider if it aligns with Echo's mission
3. Think about the implementation complexity

### Feature Request Template
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation Ideas**
If you have ideas about how this could be implemented, please share them.
```

## 🏆 Recognition

Contributors are recognized in:
- GitHub contributors list
- README.md acknowledgments
- Release notes for significant contributions
- Special badges for sustained contributions

## 📚 Resources

### Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Design Guide](./DESIGN_GUIDE.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [jose (JWT) Documentation](https://github.com/panva/jose)

### Community
- GitHub Discussions for questions and ideas
- GitHub Issues for bugs and feature requests
- Code reviews for learning and improvement

## 🤝 Code of Conduct

### Our Commitment
We are committed to providing a welcoming and inspiring community for all. By participating in this project, you agree to abide by our code of conduct.

### Expected Behavior
- Be respectful and inclusive
- Exercise empathy and kindness
- Focus on what is best for the community
- Gracefully accept constructive criticism
- Show courtesy and respect towards other community members

### Unacceptable Behavior
- Harassment, trolling, or discriminatory language
- Personal attacks or political discussions
- Publishing private information without consent
- Any conduct inappropriate for a professional setting

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers. All reports will be reviewed and investigated promptly and fairly.

## 📞 Getting Help

### Questions?
- Check existing GitHub Issues and Discussions
- Read the documentation thoroughly
- Reach out to maintainers if needed

### Stuck on Something?
- Open a GitHub Discussion
- Include relevant code and error messages
- Be specific about what you're trying to achieve

---

Thank you for contributing to Echo! Together, we're making mental wellness more accessible through technology. 🌟

*"Every contribution is a step towards better mental health for everyone."*
