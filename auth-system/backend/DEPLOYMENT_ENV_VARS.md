# Deployment Environment Variables

## Required Environment Variables for Production

When deploying the backend to Vercel, Render, or any other platform, make sure to set these environment variables:

### Critical Variables

1. **FRONTEND_URL** ⚠️ IMPORTANT
   - **Production**: `https://access-kit.vercel.app`
   - **Local**: `http://localhost:5173`
   - This URL is used in:
     - Password reset emails
     - Email verification links
     - CORS configuration

2. **MONGODB_URI**
   - Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

3. **JWT Secrets**
   - `JWT_SECRET`: Strong secret for access tokens
   - `JWT_REFRESH_SECRET`: Different strong secret for refresh tokens
   - Generate with: `openssl rand -base64 32`

4. **Email Configuration**
   - `EMAIL_HOST`: SMTP server (e.g., `smtp.gmail.com`)
   - `EMAIL_PORT`: SMTP port (e.g., `587`)
   - `EMAIL_USER`: SMTP username
   - `EMAIL_PASS`: SMTP password/app password
   - `EMAIL_FROM`: From email address

### Vercel Deployment

To set environment variables in Vercel:

1. Go to your project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add each variable with its production value
4. **Make sure FRONTEND_URL is set to `https://access-kit.vercel.app`**

### Render Deployment

To set environment variables in Render:

1. Go to your service dashboard
2. Navigate to "Environment" tab
3. Add each variable
4. **Make sure FRONTEND_URL is set to `https://access-kit.vercel.app`**

## Common Issues

### Password Reset Email Not Working

If users don't receive password reset emails:

1. Check that `FRONTEND_URL` is correctly set to your frontend deployment URL
2. Verify email configuration (SMTP settings)
3. Check server logs for email sending errors
4. Ensure the email service allows "less secure apps" or use app-specific passwords

### CORS Errors

If you get CORS errors:

1. Ensure `FRONTEND_URL` matches exactly (including `https://` prefix)
2. Check that the backend is using the environment variable correctly
3. Verify no trailing slash in the URL 