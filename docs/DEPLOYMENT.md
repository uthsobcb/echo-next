# Echo Deployment Guide

This guide covers deploying Echo to various platforms and environments. Choose the deployment method that best fits your needs.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/echo-next)

### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/echo-next)

---

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] MongoDB database (Atlas recommended)
- [ ] An OpenRouter API key, or another OpenAI-compatible endpoint
- [ ] Resend account for emails
- [ ] Domain name (optional)
- [ ] SSL certificate (handled by most platforms)

### Environment Variables
- [ ] All required variables from [Environment Setup](./ENVIRONMENT_SETUP.md)
- [ ] Production URLs updated
- [ ] Secure secrets generated
- [ ] OAuth redirect URIs configured

### Code Preparation
- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] No console errors or warnings
- [ ] Database migrations completed
- [ ] Static assets optimized

---

## 🟢 Vercel Deployment (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`
   - Use different values for production

4. **Deploy**
   - Vercel automatically deploys on every push to main
   - First deployment takes 2-3 minutes
   - Subsequent deployments are faster

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add JWT_SECRET
   vercel env add ENCRYPTION_SECRET_KEY
   vercel env add CRON_SECRET
   vercel env add MONGODB_URI
   vercel env add OPENROUTER_API_KEY
   # Add all other required variables
   ```

### Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.com"
        }
      ]
    }
  ]
}
```

---

## 🔷 Railway Deployment

Railway offers a simple deployment platform with built-in databases.

### Setup

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   ```bash
   # Install Railway CLI (optional)
   npm install -g @railway/cli
   railway login
   railway link
   railway up
   ```

3. **Add MongoDB**
   - Go to your Railway project
   - Click "New" → "Database" → "MongoDB"
   - Copy the connection string to `MONGODB_URI`

4. **Environment Variables**
   - Go to project → Variables
   - Add all required environment variables
   - Railway automatically restarts on variable changes

### Railway Configuration

Create `railway.toml`:

```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "always"

[[services]]
name = "echo-web"
source = "."

[services.echo-web]
buildCommand = "npm run build"
startCommand = "npm start"

[services.echo-web.env]
PORT = "3000"
NODE_ENV = "production"
```

---

## 🟠 AWS Deployment

Deploy Echo on AWS using various services.

### Option 1: AWS Amplify

1. **Connect Repository**
   - Open AWS Amplify Console
   - Connect your GitHub repository
   - Choose main branch

2. **Build Settings**
   ```yaml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: .next
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
   ```

3. **Environment Variables**
   - Add variables in Amplify console
   - Use AWS Secrets Manager for sensitive data

### Option 2: EC2 + Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   
   COPY --from=builder /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Deploy to EC2**
   ```bash
   # Build and push to ECR
   docker build -t echo-app .
   docker tag echo-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/echo-app:latest
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/echo-app:latest
   
   # Run on EC2
   docker pull 123456789012.dkr.ecr.us-east-1.amazonaws.com/echo-app:latest
   docker run -d -p 3000:3000 --env-file .env echo-app:latest
   ```

---

## 🐳 Docker Deployment

### Production Dockerfile

```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/echo
    env_file:
      - .env.production
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

volumes:
  mongo_data:
```

### Deploy with Docker

```bash
# Build the image
docker build -t echo-app .

# Run with Docker Compose
docker-compose up -d

# Or run standalone
docker run -d \
  --name echo-app \
  -p 3000:3000 \
  --env-file .env.production \
  echo-app
```

---

## ☁️ Google Cloud Platform

### Cloud Run Deployment

1. **Prepare for Cloud Run**
   ```bash
   # Install gcloud CLI
   gcloud auth login
   gcloud config set project your-project-id
   ```

2. **Build and Deploy**
   ```bash
   # Build container image
   gcloud builds submit --tag gcr.io/your-project-id/echo-app
   
   # Deploy to Cloud Run
   gcloud run deploy echo-app \
     --image gcr.io/your-project-id/echo-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production
   ```

3. **Set Environment Variables**
   ```bash
   gcloud run services update echo-app \
     --set-env-vars JWT_SECRET=your-secret \
     --set-env-vars MONGODB_URI=your-mongodb-uri
   ```

---

## 🔧 Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (Free tier available)
   - Choose closest region to your deployment

2. **Configure Access**
   - Create database user
   - Add IP addresses to whitelist (0.0.0.0/0 for cloud platforms)
   - Get connection string

3. **Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/echo?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

```bash
# Using Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6

# Connection string
mongodb://admin:password@localhost:27017/echo?authSource=admin
```

---

## 📧 Email Service Setup

### Resend (Recommended)

1. **Create Account**
   - Sign up at [resend.com](https://resend.com)
   - Verify your domain (optional but recommended)

2. **Get API Key**
   - Go to API Keys section
   - Create new API key
   - Copy to `RESEND_API_KEY` environment variable

3. **Configure Domain (Optional)**
   - Add your domain in Resend dashboard
   - Add DNS records as instructed
   - Verify domain ownership

### Alternative Email Services

**SendGrid:**
```env
# Use SendGrid instead of Resend
SENDGRID_API_KEY=your-sendgrid-api-key
```

**AWS SES:**
```env
# Use AWS SES
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

---

## 🔐 Security Configuration

### SSL/TLS Certificates
- Most platforms (Vercel, Netlify, Railway) provide automatic SSL
- For custom deployments, use Let's Encrypt or CloudFlare

### Environment Security
```bash
# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET, ENCRYPTION_SECRET_KEY, CRON_SECRET
openssl rand -hex 16     # For JWT_SECRET
```

### CORS Configuration
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://your-domain.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          }
        ]
      }
    ];
  }
};
```

---

## 📊 Monitoring & Analytics

### Health Checks
Create `/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { connect } from "@/app/lib/mongodb";

export async function GET() {
  try {
    await connect();
    return NextResponse.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: error.message }, 
      { status: 500 }
    );
  }
}
```

### Logging
```typescript
// Add to your API routes
console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
```

### Performance Monitoring
- Use Vercel Analytics for Vercel deployments
- Add New Relic or DataDog for advanced monitoring
- Monitor database performance in MongoDB Atlas

---

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Environment Variables Not Loading:**
- Check variable names match exactly
- Restart deployment after adding variables
- Use platform-specific variable syntax

**Database Connection Issues:**
- Verify connection string format
- Check IP whitelist settings
- Test connection locally first

**API Timeout Errors:**
- Increase function timeout limits
- Optimize database queries
- Add proper error handling

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Or specific modules
DEBUG=mongodb:* npm run dev
```

---

## 📈 Scaling Considerations

### Performance Optimization
- Enable Next.js image optimization
- Use CDN for static assets
- Implement Redis for session storage
- Add database indexing

### Load Balancing
```bash
# Using PM2 for multiple processes
npm install -g pm2
pm2 start ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'echo-app',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 Support

### Deployment Help
- Check platform-specific documentation
- Review logs for error details
- Test locally before deploying
- Use health check endpoints

### Performance Issues
- Monitor database query performance
- Check function execution times
- Review memory usage
- Analyze Core Web Vitals

---

**Happy Deploying!** 🚀

Your Echo deployment will help users worldwide on their mental wellness journey.
