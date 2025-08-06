# Vercel Deployment Guide

## 🚀 Quick Setup

### 1. Environment Variables
Add these to your Vercel project settings:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/authsystem

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-minimum-32-characters

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Environment
NODE_ENV=production

# Frontend URL (update with your actual frontend domain)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2. Deploy Commands

```bash
# 1. Make sure you're in the backend directory
cd auth-system/backend

# 2. Deploy to Vercel
vercel --prod

# Or if first time:
vercel
```

### 3. Vercel Project Settings

In your Vercel dashboard:
- **Build Command**: (leave empty - automatic)
- **Output Directory**: (leave empty - automatic)  
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## 🔧 Configuration Files

### vercel.json
```json
{
    "version": 2,
    "builds": [
        {
            "src": "api/index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/api/index.js",
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        }
    ],
    "functions": {
        "api/index.js": {
            "maxDuration": 30
        }
    }
}
```

### Entry Point: api/index.js
- Optimized for serverless functions
- Proper MongoDB connection handling
- No `app.listen()` calls
- Better error handling for serverless environment

## 🐛 Common Issues & Solutions

### 1. Function Invocation Failed
**Cause**: Usually due to:
- Missing environment variables
- Database connection issues  
- Import/export syntax problems

**Solution**: 
- Check Vercel logs: `vercel logs`
- Verify all environment variables are set
- Test MongoDB connection

### 2. 500 Internal Server Error
**Cause**: Runtime errors in your code

**Solution**:
```bash
# Check logs
vercel logs --follow

# Test locally first
npm run dev
```

### 3. CORS Issues
**Cause**: Frontend domain not in CORS whitelist

**Solution**: Update `FRONTEND_URL` environment variable

### 4. MongoDB Connection Timeout
**Cause**: MongoDB Atlas IP whitelist or connection string

**Solution**:
- MongoDB Atlas: Add `0.0.0.0/0` to IP whitelist
- Check connection string format
- Verify username/password

## 📊 Testing Your Deployment

1. **Health Check**:
   ```
   GET https://your-api.vercel.app/health
   ```

2. **API Endpoint**:
   ```
   GET https://your-api.vercel.app/api
   ```

3. **Test Authentication**:
   ```
   POST https://your-api.vercel.app/api/auth/signup
   ```

## 🔍 Debugging

### View Logs
```bash
vercel logs --follow
```

### Local Testing
```bash
npm run dev
```

### Environment Check
```bash
vercel env ls
```

## 🎯 Performance Tips

1. **MongoDB Connection**: Uses connection pooling for serverless
2. **Rate Limiting**: Increased limits for production usage
3. **Error Handling**: Comprehensive error logging
4. **CORS**: Optimized for production domains

## 📱 Frontend Integration

Update your frontend API base URL to:
```javascript
const API_BASE_URL = 'https://your-api.vercel.app';
```

## 🚨 Security Checklist

- ✅ Strong JWT secrets (32+ characters)
- ✅ MongoDB connection string secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Environment variables not in code
- ✅ Gmail app password (not regular password)

---

## Need Help?

If you're still getting errors:

1. Check Vercel logs: `vercel logs`
2. Verify environment variables in Vercel dashboard
3. Test MongoDB connection from your local machine
4. Ensure all dependencies are in `package.json` 