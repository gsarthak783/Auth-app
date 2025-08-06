# Render Deployment Guide

## 🚀 Quick Setup

### 1. Render Dashboard Configuration

When creating a new Web Service on Render:

```
Service Type: Web Service
Repository: Connect your GitHub repository
Branch: main (or your main branch)
Root Directory: auth-system/backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free (or your preferred plan)
```

### 2. Environment Variables

Add these in the Render dashboard under "Environment":

```bash
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/authsystem
JWT_SECRET=your-32-character-secret-key
JWT_REFRESH_SECRET=your-32-character-refresh-key

# Optional (for email functionality)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL (update with your actual frontend domain)
FRONTEND_URL=https://your-frontend-domain.onrender.com
```

### 3. Health Check

Set health check path to: `/health`

## 🔧 Render Configuration File (render.yaml)

If you prefer using a config file, place this in your repository root:

```yaml
services:
  - type: web
    name: auth-system-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

## 🐛 Common Issues & Solutions

### 1. Build Failed - npm command issue
**Error**: `npm` called without arguments
**Solution**: 
- Ensure "Build Command" is set to `npm install`
- Check that you're in the correct directory (`auth-system/backend`)
- Verify `package.json` exists in the build directory

### 2. MongoDB Connection Issues
**Error**: Connection timeout or authentication failed
**Solution**:
- MongoDB Atlas: Add `0.0.0.0/0` to IP whitelist
- Verify connection string format
- Test connection locally first

### 3. Missing Environment Variables
**Error**: JWT errors, undefined variables
**Solution**:
- Double-check all environment variables in Render dashboard
- Ensure no spaces in variable names
- Use strong secrets (32+ characters)

### 4. Port Issues
**Error**: Service not responding
**Solution**:
- Render automatically sets `PORT` environment variable
- Your app should use `process.env.PORT || 5000`
- Don't hardcode port numbers

## 📊 Testing Your Deployment

1. **Health Check**:
   ```
   GET https://your-service.onrender.com/health
   ```

2. **API Endpoint**:
   ```
   GET https://your-service.onrender.com/api
   ```

3. **Test Authentication**:
   ```
   POST https://your-service.onrender.com/api/auth/signup
   ```

## 🔍 Debugging

### View Logs
- Go to your service dashboard on Render
- Click "Logs" tab
- Monitor real-time logs during deployment

### Manual Deploy
- Click "Manual Deploy" → "Deploy latest commit"
- Watch the build process in real-time

### Environment Check
- In service dashboard, check "Environment" tab
- Verify all required variables are set

## 🎯 Deployment Checklist

- ✅ Repository connected to Render
- ✅ Build command: `npm install`
- ✅ Start command: `npm start`
- ✅ Root directory: `auth-system/backend`
- ✅ All environment variables set
- ✅ MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- ✅ Health check path: `/health`

## 🔄 Auto-Deploy

Render automatically deploys when you push to your connected branch. To disable:
- Go to service settings
- Turn off "Auto-Deploy"

## 📱 Frontend Integration

Update your frontend API base URL to:
```javascript
const API_BASE_URL = 'https://your-service.onrender.com';
```

## 🚨 Free Plan Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free tier limit

---

## Need Help?

1. Check Render logs for specific error messages
2. Verify environment variables
3. Test MongoDB connection
4. Ensure all dependencies are in `package.json` 