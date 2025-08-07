# 📦 AccessKit NPM Deployment Guide

## 🎯 Overview

AccessKit is now ready for npm deployment with two main packages:

- **`@accesskit/auth`** - Core authentication SDK for any JavaScript/TypeScript project
- **`@accesskit/react`** - React-specific hooks and components

### 🔗 Live API Endpoint
- **Backend API**: [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
- **Status**: ✅ Live and operational

## 🚀 Pre-Deployment Checklist

### ✅ What's Ready:
- [x] Backend deployed to Vercel and working
- [x] CommonJS conversion completed 
- [x] bcryptjs issues resolved with custom crypto wrapper
- [x] Package.json files configured for npm publishing
- [x] TypeScript configurations set up
- [x] Rollup build configurations created
- [x] Comprehensive README files written
- [x] MIT License added
- [x] Publishing scripts created

### 📋 Before Publishing:

1. **npm Account Setup**
   ```bash
   npm login
   # Enter your npm credentials
   ```

2. **Build Packages**
   ```bash
   # From project root
   npm run build:all
   ```

3. **Test Packages Locally**
   ```bash
   # Test core SDK
   cd auth-system/sdk
   npm run test
   
   # Test React SDK  
   cd ../sdk-react
   npm run test
   ```

## 📤 Publishing to NPM

### Option 1: Automated Publishing Script
```bash
# From project root
npm run publish:packages
```

### Option 2: Manual Publishing

#### Publish Core SDK
```bash
cd auth-system/sdk
npm install
npm run build
npm publish
```

#### Publish React SDK
```bash
cd auth-system/sdk-react
npm install
npm run build
npm publish
```

## 📚 Package Documentation

### @accesskit/auth - Core SDK

```typescript
// Installation
npm install @accesskit/auth

// Usage
import { AuthClient } from '@accesskit/auth';

const auth = new AuthClient({
  apiKey: 'your-project-api-key',
  projectId: 'your-project-id'
});

// Register user
await auth.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

// Login
await auth.login({
  email: 'user@example.com', 
  password: 'password123'
});
```

### @accesskit/react - React SDK

```tsx
// Installation
npm install @accesskit/react @accesskit/auth

// Setup
import { AuthProvider } from '@accesskit/react';

function App() {
  return (
    <AuthProvider apiKey="your-key" projectId="your-id">
      <YourApp />
    </AuthProvider>
  );
}

// Usage
import { useAuth } from '@accesskit/react';

function LoginForm() {
  const { login, user, loading } = useAuth();
  
  if (user) return <div>Welcome, {user.firstName}!</div>;
  
  return (
    <button onClick={() => login({ email, password })}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

## 🌐 Integration Examples

### Vanilla JavaScript
```html
<script type="module">
  import { AuthClient } from 'https://unpkg.com/@accesskit/auth';
  
  const auth = new AuthClient({
    apiKey: 'your-key',
    projectId: 'your-id'
  });
  
  // Use auth methods
</script>
```

### Vue.js
```javascript
// Install: npm install @accesskit/auth

import { AuthClient } from '@accesskit/auth';

export default {
  data() {
    return {
      auth: new AuthClient({ apiKey: 'your-key', projectId: 'your-id' }),
      user: null
    };
  },
  async mounted() {
    if (this.auth.isAuthenticated()) {
      this.user = await this.auth.getProfile();
    }
  }
};
```

### Angular
```typescript
// Install: npm install @accesskit/auth

import { Injectable } from '@angular/core';
import { AuthClient } from '@accesskit/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = new AuthClient({
    apiKey: 'your-key',
    projectId: 'your-id'
  });

  async login(email: string, password: string) {
    return this.auth.login({ email, password });
  }
}
```

### Next.js
```tsx
// Install: npm install @accesskit/react @accesskit/auth

// pages/_app.tsx
import { AuthProvider } from '@accesskit/react';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider apiKey="your-key" projectId="your-id">
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// pages/dashboard.tsx
import { useAuth } from '@accesskit/react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <div>Welcome to dashboard, {user.firstName}!</div>;
}
```

## 🎛️ API Configuration

### Live Endpoint
The packages are pre-configured to use the live API:
- **Base URL**: `https://access-kit-server.vercel.app/api/project-users`
- **Health Check**: `https://access-kit-server.vercel.app/health`

### Custom Endpoint (Optional)
```typescript
const auth = new AuthClient({
  apiKey: 'your-key',
  projectId: 'your-id',
  baseUrl: 'https://your-custom-api.com/api/project-users' // Custom endpoint
});
```

## 🔑 Getting API Keys

### From Your Backend Dashboard
1. Deploy the backend to your preferred platform
2. Access the frontend dashboard
3. Create a new project
4. Copy the generated API key and project ID

### For Testing
Use the live instance at [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app):
1. Register an account
2. Create a project
3. Get your API credentials

## 📈 Version Management

### Current Versions
- **@accesskit/auth**: v1.0.0
- **@accesskit/react**: v1.0.0

### Publishing New Versions
```bash
# Update version in package.json
cd auth-system/sdk
npm version patch  # or minor/major

# Rebuild and publish
npm run build
npm publish

# Same for React SDK
cd ../sdk-react
npm version patch
npm run build  
npm publish
```

## 🧪 Testing Packages

### Local Testing (Before Publishing)
```bash
# Link packages locally
cd auth-system/sdk
npm link

cd ../sdk-react  
npm link @accesskit/auth
npm link

# Test in a sample project
cd /path/to/test-project
npm link @accesskit/auth
npm link @accesskit/react
```

### Production Testing (After Publishing)
```bash
# Create test project
mkdir accesskit-test && cd accesskit-test
npm init -y
npm install @accesskit/auth @accesskit/react

# Test basic functionality
echo "
import { AuthClient } from '@accesskit/auth';
const auth = new AuthClient({ apiKey: 'test', projectId: 'test' });
console.log('SDK loaded successfully!');
" > test.mjs

node test.mjs
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Module Not Found
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript Errors
```bash
# Ensure TypeScript is installed
npm install -g typescript

# Check tsconfig.json is present
# Verify target/module compatibility
```

#### 3. Build Fails
```bash
# Check Rollup dependencies
npm install --save-dev @rollup/plugin-node-resolve @rollup/plugin-typescript rollup-plugin-dts

# Clean and rebuild
npm run clean
npm run build
```

#### 4. Authentication Errors
```bash
# Verify API endpoint is accessible
curl https://access-kit-server.vercel.app/health

# Check API key format
# Ensure project ID is correct
```

## 📊 Usage Analytics

After publishing, monitor usage with:

### NPM Stats
- Package downloads: `npm info @accesskit/auth`
- Version history: `npm view @accesskit/auth versions --json`

### GitHub Analytics
- Star/fork activity
- Issue reports
- Pull requests

## 🎯 Next Steps

### After Publishing:

1. **Update Documentation**
   - Add npm badges to README
   - Update installation instructions
   - Create usage examples

2. **Community**
   - Share on developer communities
   - Write blog posts/tutorials
   - Create video guides

3. **Maintenance**
   - Monitor issues and feedback
   - Regular security updates
   - Feature enhancements

4. **Integration Guides**
   - Framework-specific tutorials
   - Best practices documentation
   - Migration guides

## 🏆 Success Metrics

### Package Adoption
- [ ] 100+ weekly downloads
- [ ] Multiple GitHub stars
- [ ] Community contributions
- [ ] Integration examples

### Developer Experience
- [ ] Clear documentation
- [ ] TypeScript support
- [ ] Framework integrations
- [ ] Active maintenance

---

## 🚀 Ready to Launch!

Your AccessKit packages are ready for npm publication. The live backend at [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app) is operational and the SDKs are pre-configured to work with it.

Run the publishing script when ready:
```bash
npm run publish:packages
```

**Happy coding! 🎉** 