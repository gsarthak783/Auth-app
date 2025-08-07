# AccessKit Authentication System

A complete, production-ready authentication system with JavaScript/TypeScript and React SDKs. Deploy authentication for your projects in minutes with our live API and npm packages.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-access--kit--server.vercel.app-blue)](https://access-kit-server.vercel.app)
[![Core SDK](https://img.shields.io/npm/v/@gsarthak783/accesskit-auth)](https://npmjs.com/package/@gsarthak783/accesskit-auth)
[![React SDK](https://img.shields.io/npm/v/@gsarthak783/accesskit-react)](https://npmjs.com/package/@gsarthak783/accesskit-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Option 1: Use Our Live API & SDKs (Recommended)

#### JavaScript/TypeScript SDK
```bash
npm install @gsarthak783/accesskit-auth
```

```javascript
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

// Register and login users
const user = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe'
});
```

#### React SDK
```bash
npm install @gsarthak783/accesskit-react
```

```jsx
import { AuthProvider, useAuth } from '@gsarthak783/accesskit-react';

function App() {
  return (
    <AuthProvider config={{ projectId: 'your-project-id', apiKey: 'your-api-key' }}>
      <MyComponent />
    </AuthProvider>
  );
}

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => login('email@example.com', 'password')}>Login</button>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Option 2: Self-Host the Complete System

Clone this repository to deploy your own authentication service:

```bash
git clone https://github.com/gsarthak783/Auth-app.git
cd Auth-app/auth-system
```

## 🌐 Live Services

- **API Base URL**: `https://access-kit-server.vercel.app`
- **Dashboard**: [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
- **Documentation**: Complete guides available in the dashboard

## 📦 Available Packages

| Package | Description | Install |
|---------|-------------|---------|
| **[@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)** | Core JavaScript/TypeScript SDK | `npm install @gsarthak783/accesskit-auth` |
| **[@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)** | React hooks and components | `npm install @gsarthak783/accesskit-react` |

## ✨ Features

### 🔐 Complete Authentication
- **User Registration & Login** - Email/password with optional username
- **Password Management** - Reset, change, and validation
- **Email Verification** - Optional email verification flow
- **Session Management** - JWT tokens with refresh capability
- **User Profiles** - Customizable user data and metadata

### 🎯 Developer Experience
- **Multiple SDKs** - JavaScript/TypeScript and React
- **TypeScript Support** - Full type definitions included
- **Framework Agnostic** - Works with React, Vue, Angular, Node.js
- **Comprehensive Docs** - Complete API reference and guides
- **Live API** - No setup required, start building immediately

### 🛡️ Security & Compliance
- **Enterprise Security** - bcrypt hashing, JWT tokens, rate limiting
- **CORS Protection** - Configurable origins and methods
- **Environment Isolation** - Project-based user separation
- **Admin Controls** - User management and analytics
- **Audit Logging** - Comprehensive request logging

### 🚀 Production Ready
- **Deployed & Scalable** - Live on Vercel with auto-scaling
- **Rate Limiting** - Configurable limits per endpoint
- **Error Handling** - Comprehensive error responses
- **Monitoring** - Built-in analytics and logging
- **High Availability** - 99.9% uptime SLA

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your App      │    │   AccessKit      │    │   Database      │
│                 │────│   Live API       │────│   MongoDB       │
│ + SDK           │    │   Vercel         │    │   Atlas         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

- **Authentication API** - RESTful API for all auth operations
- **Project Management** - Multi-tenant project isolation
- **User Management** - Complete user lifecycle management
- **Admin Dashboard** - Web interface for project management
- **SDK Libraries** - Client libraries for easy integration

## 📖 Documentation

### Quick Links
- **[Live Demo](https://access-kit-server.vercel.app)** - Try the system
- **[Quick Start Guide](auth-system/API_USAGE_GUIDE.md)** - Get started in 5 minutes
- **[SDK Documentation](auth-system/SDK_DOCUMENTATION.md)** - Complete SDK guide
- **[API Reference](auth-system/API_USAGE_GUIDE.md)** - Full API documentation

### Integration Guides
- **JavaScript/TypeScript** - Universal SDK for any framework
- **React Applications** - Hooks, context, and components
- **Node.js Backend** - Server-side integration
- **Vue.js Applications** - Vue integration examples
- **Angular Applications** - Angular service integration

## 🔑 Getting Started

### 1. Get API Keys
1. Visit [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
2. Create an account
3. Create a new project
4. Copy your **Project ID** and **API Key**

### 2. Install SDK
```bash
# For any JavaScript/TypeScript project
npm install @gsarthak783/accesskit-auth

# For React projects (includes core SDK)
npm install @gsarthak783/accesskit-react
```

### 3. Initialize & Use
```javascript
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

// Start authenticating users!
```

## 🔧 Self-Hosting Setup

If you prefer to host your own instance:

### Prerequisites
- Node.js 18+
- MongoDB database
- SMTP service for emails

### Backend Setup
```bash
cd auth-system/backend
npm install
cp env-template.txt .env
# Configure your .env file
npm start
```

### Frontend Setup
```bash
cd auth-system/frontend
npm install
npm run dev
```

### Environment Variables
```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.your-provider.com
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-email-password

# Frontend (.env)
VITE_API_URL=https://your-api-domain.com/api
```

## 🌍 Framework Support

AccessKit works with any JavaScript framework:

| Framework | Support | Integration |
|-----------|---------|-------------|
| **React** | ✅ Full | Dedicated SDK with hooks |
| **Vue.js** | ✅ Full | Core SDK + examples |
| **Angular** | ✅ Full | Core SDK + service examples |
| **Node.js** | ✅ Full | Core SDK for backend |
| **Next.js** | ✅ Full | Both SDKs + SSR support |
| **Vanilla JS** | ✅ Full | Core SDK |

## 🧪 Examples & Templates

### Example Projects
- **[React Todo App](examples/react-todo)** - Complete React integration
- **[Vue Dashboard](examples/vue-dashboard)** - Vue.js implementation
- **[Express API](examples/express-api)** - Backend integration
- **[Next.js App](examples/nextjs-app)** - Full-stack Next.js

### Code Examples
```javascript
// Register user
const user = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe',
  customFields: { role: 'user' }
});

// Login user
const loginResponse = await auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});

// Update profile
const updatedUser = await auth.updateProfile({
  firstName: 'Jane',
  customFields: { role: 'admin' }
});

// Password reset flow
await auth.requestPasswordReset('user@example.com');
await auth.resetPassword('reset-token', 'newpassword');
```

## 🔒 Security

### Security Features
- **Password Hashing** - bcrypt with configurable rounds
- **JWT Tokens** - Secure access and refresh tokens
- **Rate Limiting** - Configurable limits per endpoint
- **CORS Protection** - Configurable allowed origins
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - MongoDB with parameterized queries

### Security Best Practices
- Store API keys securely in environment variables
- Use HTTPS in production
- Implement proper CORS settings
- Regular security audits and updates
- Monitor for suspicious activity

## 🎯 Use Cases

### Perfect For
- **SaaS Applications** - Multi-tenant user management
- **Mobile Apps** - Cross-platform authentication
- **Web Applications** - Complete user lifecycle
- **API Services** - Secure API access control
- **E-commerce** - Customer account management
- **Corporate Apps** - Employee authentication

### Industries
- Technology & Software
- E-commerce & Retail
- Healthcare & Medical
- Education & E-learning
- Finance & Fintech
- Media & Entertainment

## 📊 Pricing

### Live API Service
- **Free Tier** - 1,000 monthly active users
- **Starter** - $9/month - 10,000 MAU
- **Growth** - $29/month - 100,000 MAU
- **Enterprise** - Custom pricing

### Self-Hosted
- **Open Source** - Free forever
- **Commercial License** - Available for enterprise
- **Support Plans** - Professional support available

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes** - Follow our coding standards
4. **Add tests** - Ensure your changes are tested
5. **Commit changes** - `git commit -m 'Add amazing feature'`
6. **Push to branch** - `git push origin feature/amazing-feature`
7. **Open a Pull Request** - We'll review and merge

### Development Setup
```bash
git clone https://github.com/gsarthak783/Auth-app.git
cd Auth-app
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MongoDB** - Database platform
- **Vercel** - Hosting and deployment
- **Node.js Community** - Amazing ecosystem
- **React Team** - Excellent frontend framework
- **Contributors** - Thank you for your contributions!

## 📞 Support

### Get Help
- **📖 Documentation** - [Complete guides](https://access-kit-server.vercel.app)
- **💻 GitHub Issues** - [Report bugs or request features](https://github.com/gsarthak783/Auth-app/issues)
- **📧 Email Support** - support@accesskit.dev
- **💬 Community** - Join our Discord server

### Links
- **🌐 Live Demo** - [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
- **📦 Core SDK** - [npmjs.com/package/@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)
- **⚛️ React SDK** - [npmjs.com/package/@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)
- **🐙 GitHub** - [github.com/gsarthak783/Auth-app](https://github.com/gsarthak783/Auth-app)

---

**Built with ❤️ by the AccessKit Team**

*Making authentication simple, secure, and scalable for developers worldwide.*