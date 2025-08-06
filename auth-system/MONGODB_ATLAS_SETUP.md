# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account or log in to your existing account
3. Create a new project (or use an existing one)

## Step 2: Create a Cluster

1. Click "Create" or "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Give your cluster a name (e.g., "auth-system-cluster")
5. Click "Create Cluster"

## Step 3: Create Database User

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter a username and secure password
5. Set database user privileges to "Read and write to any database"
6. Click "Add User"

**Important:** Remember your username and password!

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development, you can:
   - Click "Add Current IP Address" (for your current location)
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) - **Less secure but easier for development**
4. Click "Confirm"

## Step 5: Get Connection String

1. In the left sidebar, click "Database"
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "5.5 or later"
5. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update Your .env File

1. Open `/workspace/auth-system/backend/.env`
2. Replace the `MONGODB_URI` line with your connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/auth-system?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_USERNAME` with your database username
- `YOUR_PASSWORD` with your database password  
- `YOUR_CLUSTER` with your cluster name/URL
- Add `/auth-system` before the `?` to specify the database name

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/auth-system?retryWrites=true&w=majority
```

## Step 7: Test the Connection

After updating your `.env` file:

1. Stop the current backend server (if running)
2. Run the seed script to test the connection:
   ```bash
   cd /workspace/auth-system/backend
   npm run seed
   ```
3. If successful, start the servers:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Check username and password are correct
   - Ensure the user has proper permissions

2. **Network Timeout**
   - Check if your IP address is whitelisted
   - Try allowing access from anywhere (0.0.0.0/0) for testing

3. **Connection String Format**
   - Make sure you're using the full connection string
   - Don't forget to add the database name (`/auth-system`)
   - Ensure special characters in password are URL-encoded

### URL Encoding for Passwords

If your password contains special characters, you need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`

## Security Best Practices

1. **Use Strong Passwords**: Create complex passwords for database users
2. **Limit IP Access**: Only whitelist necessary IP addresses in production
3. **Rotate Credentials**: Regularly update database user passwords
4. **Monitor Access**: Review database access logs regularly

## Next Steps

Once your MongoDB Atlas is configured:

1. Run the seed script to create demo data
2. Test user registration and login
3. Explore the dashboard and project management features
4. Configure email settings for production use

## Support

If you encounter issues:
1. Check the MongoDB Atlas documentation
2. Review the error messages in the console
3. Ensure your cluster is running and accessible
4. Verify all connection string components are correct