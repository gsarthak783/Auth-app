# AccessKit API Usage Guide

Complete guide for integrating with the AccessKit Authentication API and SDKs.

## 🌐 Live API Endpoint

**Base URL**: `https://access-kit-server.vercel.app`

- **Platform API**: `https://access-kit-server.vercel.app/api`
- **Project Users API**: `https://access-kit-server.vercel.app/api/project-users`
- **Dashboard**: `https://access-kit-server.vercel.app`

## 📦 SDK Packages

### Core JavaScript/TypeScript SDK
```bash
npm install @gsarthak783/accesskit-auth
```

### React SDK
```bash
npm install @gsarthak783/accesskit-react
```

## 🚀 Quick Start

### Option 1: Using SDK (Recommended)

```javascript
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

// Register user
const user = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe'
});
```

### Option 2: Direct API Calls

```javascript
// Register a project user
const response = await fetch('https://access-kit-server.vercel.app/api/project-users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key',
    'X-Project-ID': 'your-project-id'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const result = await response.json();
```

## 🔑 Getting API Keys

1. Visit [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
2. Create an account or sign in
3. Create a new project
4. Copy your **Project ID** and **API Key** from the project settings

## 📋 API Reference

### Authentication Headers

All project user API calls require these headers:

```http
X-API-Key: your-project-api-key
X-Project-ID: your-project-id
Content-Type: application/json
```

### Project User Endpoints

#### Register User
```http
POST /api/project-users/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe", // optional
  "customFields": {} // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": true,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

#### Login User
```http
POST /api/project-users/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get User Profile
```http
GET /api/project-users/profile
Authorization: Bearer {access_token}
```

#### Update User Profile
```http
PUT /api/project-users/profile
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "customFields": {
    "role": "admin"
  }
}
```

#### Request Password Reset
```http
POST /api/project-users/request-password-reset
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/project-users/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newpassword"
}
```

#### Verify Email
```http
POST /api/project-users/verify-email
```

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

### Admin Endpoints (Require API Key)

#### Get All Users
```http
GET /api/project-users?page=1&limit=50&search=john&status=active
X-API-Key: your-api-key
X-Project-ID: your-project-id
```

#### Get User Statistics
```http
GET /api/project-users/stats
X-API-Key: your-api-key
X-Project-ID: your-project-id
```

#### Delete User
```http
DELETE /api/project-users/{userId}
X-API-Key: your-api-key
X-Project-ID: your-project-id
```

#### Update User Status
```http
PATCH /api/project-users/{userId}/status
X-API-Key: your-api-key
X-Project-ID: your-project-id
```

**Request Body:**
```json
{
  "status": "suspended" // or "active", "pending"
}
```

## 🔒 Security

### Rate Limiting
- **Registration**: 5 requests per minute per IP
- **Login**: 10 requests per minute per IP
- **Password Reset**: 3 requests per hour per IP
- **General API**: 100 requests per minute per API key

### CORS Configuration
Add your domains to allowed origins in your project settings:
- `http://localhost:3000` (for development)
- `https://yourapp.com` (for production)
- `https://yourapp.vercel.app` (for Vercel deployments)

### API Key Security
- **Never expose API keys in frontend code**
- Use environment variables in your backend
- Rotate API keys regularly in production

## 💡 Integration Examples

### React Integration
```jsx
import { AuthProvider, useAuth } from '@gsarthak783/accesskit-react';

function App() {
  return (
    <AuthProvider config={{ projectId: 'xxx', apiKey: 'xxx' }}>
      <MyApp />
    </AuthProvider>
  );
}

function MyApp() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => login('user@example.com', 'password')}>Login</button>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Node.js Backend
```javascript
const express = require('express');
const { AuthClient } = require('@gsarthak783/accesskit-auth');

const app = express();
const auth = new AuthClient({
  projectId: process.env.AUTH_PROJECT_ID,
  apiKey: process.env.AUTH_API_KEY
});

app.post('/api/register', async (req, res) => {
  try {
    const user = await auth.register(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

### Next.js API Route
```javascript
// pages/api/auth/register.js
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: process.env.AUTH_PROJECT_ID,
  apiKey: process.env.AUTH_API_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const user = await auth.register(req.body);
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### Vue.js Integration
```javascript
// main.js
import { createApp } from 'vue';
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

const app = createApp(App);
app.config.globalProperties.$auth = auth;
app.mount('#app');

// In component
export default {
  async mounted() {
    if (this.$auth.isAuthenticated()) {
      this.user = await this.$auth.getProfile();
    }
  }
}
```

### Angular Service
```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthClient } from '@gsarthak783/accesskit-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = new AuthClient({
    projectId: 'your-project-id',
    apiKey: 'your-api-key'
  });

  async login(email: string, password: string) {
    return this.auth.login({ email, password });
  }

  async register(userData: any) {
    return this.auth.register(userData);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}
```

## 🚨 Error Handling

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user/resource not found)
- `409` - Conflict (email already exists)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### SDK Error Handling
```javascript
try {
  await auth.register(userData);
} catch (error) {
  if (error.response?.status === 409) {
    console.log('Email already exists');
  } else if (error.response?.status === 400) {
    console.log('Validation error:', error.response.data.errors);
  } else {
    console.log('Registration failed:', error.message);
  }
}
```

## 🧪 Testing

### Testing with curl
```bash
# Register user
curl -X POST https://access-kit-server.vercel.app/api/project-users/register \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -H "X-Project-ID: your-project-id" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login user
curl -X POST https://access-kit-server.vercel.app/api/project-users/login \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -H "X-Project-ID: your-project-id" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Postman Collection
Import this collection to test the API:

```json
{
  "info": {
    "name": "AccessKit API",
    "description": "AccessKit Authentication API endpoints"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://access-kit-server.vercel.app"
    },
    {
      "key": "apiKey",
      "value": "your-api-key"
    },
    {
      "key": "projectId",
      "value": "your-project-id"
    }
  ]
}
```

## 📞 Support

- **Dashboard**: [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
- **GitHub Issues**: [https://github.com/gsarthak783/Auth-app/issues](https://github.com/gsarthak783/Auth-app/issues)
- **Core SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)
- **React SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)

## 🔄 Changelog

### v1.0.0 (Latest)
- Initial release
- Complete authentication system
- JavaScript/TypeScript SDK
- React SDK
- Live API deployment
- Full documentation

---

Built with ❤️ by the AccessKit Team 