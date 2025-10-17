# 🚀 CRWD Platform - Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Node.js**: Ensure you have Node.js 18+ installed
4. **Vercel CLI**: Install globally with `npm i -g vercel`

## 🔧 Pre-Deployment Setup

### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or manually:
cd api && npm install
cd ../frontend && npm install
```

### 2. Test Build Locally
```bash
# Test frontend build
cd frontend && npm run build

# Test that the build works
npx serve -s build
```

## 🌐 Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Login to Vercel**
```bash
vercel login
```

2. **Deploy from project root**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the following settings:

**Framework Preset**: Other
**Root Directory**: `/` (leave empty)
**Build Command**: `cd frontend && npm run vercel-build`
**Output Directory**: `frontend/build`
**Install Command**: `npm run install:all`

## ⚙️ Environment Variables Setup

In your Vercel dashboard, add these environment variables:

### Required Variables:
- `JWT_SECRET`: Your secure JWT secret (generate a strong random string)
- `NODE_ENV`: `production`

### Optional Variables:
- `REACT_APP_API_URL`: Will be auto-set to your Vercel domain

### Example Environment Variables:
```
JWT_SECRET=your-super-secure-jwt-secret-key-here-2024
NODE_ENV=production
```

## 📁 Project Structure for Vercel

```
CRWD/
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
├── api/
│   ├── index.js         # Serverless function entry
│   ├── package.json     # API dependencies
│   └── backend/         # Original backend code
│       ├── server.js
│       ├── routes/
│       ├── models/
│       └── mockData.js
└── frontend/
    ├── package.json     # Frontend dependencies
    ├── src/
    │   ├── config/
    │   │   └── api.js   # API configuration
    │   └── components/
    └── build/           # Built frontend (auto-generated)
```

## 🔄 API Endpoints After Deployment

Your deployed API will be available at:
- Base URL: `https://your-project.vercel.app/api`
- Auth: `https://your-project.vercel.app/api/auth/login`
- Payouts: `https://your-project.vercel.app/api/payouts/pending`
- Operations: `https://your-project.vercel.app/api/ops/dashboard`

## 🛠️ Configuration Files

### vercel.json
- Configures build settings and routing
- Maps API routes to serverless functions
- Sets up static file serving

### .env.production
- Production environment variables for React
- Sets API URL to your deployed domain

## 🔐 Test Credentials (Production)

After deployment, test with these credentials:
- **Regular User**: `user1` / `password123`
- **Regular User**: `user2` / `password123`  
- **Admin User**: `admin` / `password123`

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check that all dependencies are installed
   - Ensure Node.js version is 18+
   - Run `npm run build` locally first

2. **API Doesn't Work**
   - Verify environment variables are set
   - Check function logs in Vercel dashboard
   - Ensure API routes are properly mapped

3. **CORS Issues**
   - Update CORS origins in `/api/index.js`
   - Add your Vercel domain to allowed origins

### Debug Commands:
```bash
# Check build locally
cd frontend && npm run build

# Test API locally
cd api && node index.js

# Check Vercel function logs
vercel logs
```

## 📊 Performance Optimization

- ✅ Static build for frontend
- ✅ Serverless functions for API
- ✅ Optimized CORS configuration
- ✅ Production environment variables
- ✅ Source maps disabled for production

## 🔄 Updates and Redeployment

To update your deployment:

1. **Push changes to Git**
2. **Automatic deployment** (if connected to Git)
3. **Manual deployment**: `vercel --prod`

## 📈 Monitoring

Monitor your deployment:
- **Vercel Dashboard**: View function logs and analytics
- **Performance**: Monitor build times and function execution
- **Errors**: Check function logs for any issues

---

## 🎉 You're Ready to Deploy!

Your CRWD platform is now configured for Vercel deployment. Run `vercel --prod` to deploy to production!