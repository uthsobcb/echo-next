# Echo Environment Variables Template
# Copy this file to .env.local and fill in your actual values

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
MONGODB_URI=mongodb://localhost:27017/echo
# Production: mongodb+srv://username:password@cluster.mongodb.net/echo

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000
# Production: https://your-domain.com

# JWT Secret for custom API authentication
JWT_SECRET=another-secret-key-for-jwt-tokens

# =============================================================================
# AI SERVICES
# =============================================================================

# Google Gemini AI (Primary)
GEMINI_API=your-google-gemini-api-key

# OpenAI (Fallback)
OPENAI_API_KEY=sk-your-openai-api-key

# OpenRouter (Alternative AI routing)
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key

# =============================================================================
# EMAIL SERVICE
# =============================================================================
RESEND_API_KEY=re_your-resend-api-key

# =============================================================================
# OAUTH PROVIDERS
# =============================================================================

# Google OAuth
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# =============================================================================
# APPLICATION URLS
# =============================================================================
NEXT_PUBLIC_BASEURL=http://localhost:3000
BASEURL=http://localhost:3000
# Production: https://your-domain.com

# =============================================================================
# PUSH NOTIFICATIONS (Optional)
# =============================================================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
NEXT_PUBLIC_MAILADDRESS=your-email@example.com

# =============================================================================
# OPTIONAL CONFIGURATIONS
# =============================================================================

# Node Environment
NODE_ENV=development
# Production: production

# Encryption key (generated automatically if not provided)
# ENCRYPTION_KEY=your-32-character-encryption-key

# =============================================================================
# HOW TO GET API KEYS
# =============================================================================

# MONGODB_URI:
# 1. Create account at https://cloud.mongodb.com/
# 2. Create a new cluster
# 3. Get connection string from "Connect" button

# GEMINI_API:
# 1. Go to https://makersuite.google.com/app/apikey
# 2. Create new API key
# 3. Copy the generated key

# RESEND_API_KEY:
# 1. Sign up at https://resend.com/
# 2. Go to API Keys section
# 3. Create new API key

# GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET:
# 1. Go to https://console.developers.google.com/
# 2. Create new project or select existing
# 3. Enable Google+ API
# 4. Create OAuth 2.0 credentials
# 5. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google (development)
#    - https://your-domain.com/api/auth/callback/google (production)

# OPENAI_API_KEY (Optional):
# 1. Sign up at https://platform.openai.com/
# 2. Go to API Keys section
# 3. Create new secret key

# =============================================================================
# SECURITY NOTES
# =============================================================================

# 🔒 IMPORTANT SECURITY REMINDERS:
# - Never commit .env.local to version control
# - Use strong, unique secrets for production
# - Rotate API keys regularly
# - Use environment-specific configurations
# - Keep production secrets secure and backed up

# 🚀 PRODUCTION CHECKLIST:
# - Set NODE_ENV=production
# - Use production database URL
# - Update NEXTAUTH_URL to production domain
# - Configure secure CORS settings
# - Enable rate limiting
# - Set up monitoring and logging
