# Firebase-like Authentication System

A comprehensive user management and authentication system built with Node.js/Express backend and React frontend, designed to provide Firebase-like authentication capabilities for multiple projects.

## Features

### 🔐 Authentication & Security
- User registration and login
- Email verification
- Password reset functionality
- JWT token-based authentication with refresh tokens
- Account lockout after failed login attempts
- Session management
- Role-based access control
- Multi-project authentication isolation

### 👥 User Management
- Comprehensive user profiles with customizable fields
- User roles and permissions
- Account status management (active, suspended, verified)
- User activity tracking
- Bulk user operations

### 🏢 Multi-Project Support
- Create and manage multiple authentication projects
- Isolated user bases per project
- Project-specific settings and configurations
- API key-based project authentication
- Team collaboration with role-based access

### 🛡️ Enterprise Security
- Rate limiting and DDoS protection
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- Audit logging
- Account lockout mechanisms

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS and DaisyUI
- Dark/light theme support
- Intuitive user interface
- Mobile-friendly responsive design
- Real-time notifications

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email functionality
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **JS Cookie** - Cookie management

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- SMTP email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auth-system
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env .env.local
   ```
   
   Required environment variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/auth-system
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
       FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api

## API Documentation

### Authentication Endpoints

#### User Authentication
```
POST /api/auth/signup          - User registration
POST /api/auth/login           - User login
POST /api/auth/logout          - User logout
POST /api/auth/refresh-token   - Refresh access token
GET  /api/auth/profile         - Get user profile
PUT  /api/auth/profile         - Update user profile
```

#### Password Management
```
POST /api/auth/request-password-reset  - Request password reset
POST /api/auth/reset-password          - Reset password
POST /api/auth/change-password         - Change password (authenticated)
```

#### Email Verification
```
GET /api/auth/verify-email    - Verify email address
```

### Project Management Endpoints

```
POST   /api/projects           - Create new project
GET    /api/projects           - Get user's projects
GET    /api/projects/:id       - Get project details
PUT    /api/projects/:id       - Update project
DELETE /api/projects/:id       - Delete project
GET    /api/projects/:id/stats - Get project statistics
```

### Project Users Management

```
GET    /api/projects/:id/users         - Get project users
POST   /api/projects/:id/users         - Add user to project
DELETE /api/projects/:id/users/:userId - Remove user from project
PUT    /api/projects/:id/users/:userId/role - Update user role
```

### Request Headers

All authenticated requests require:
```
Authorization: Bearer <access_token>
x-api-key: <project_api_key>  // For project-specific endpoints
```

## Usage Examples

### Creating a New Project

1. **Sign up/Login** to the auth system
2. **Navigate to Projects** and click "Create Project"
3. **Configure project settings**:
   - Project name and description
   - Authentication settings (signup enabled, email verification, etc.)
   - Password requirements
   - Session timeout settings
4. **Get your API keys** from the project dashboard
5. **Configure your application** to use the auth system

### Integrating with Your Application

```javascript
// Example: User signup in your app
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-project-api-key'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'username',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const data = await response.json();
```

### User Schema Fields

The user model includes comprehensive fields:

- **Basic Info**: email, username, password, firstName, lastName, displayName
- **Contact**: phoneNumber, dateOfBirth, gender
- **Profile**: avatar, bio
- **Status**: isVerified, isActive, isSuspended, role
- **Security**: twoFactorEnabled, lastLogin, loginAttempts
- **Preferences**: language, timezone, notifications, privacy settings
- **Project Access**: role-based access to multiple projects
- **Metadata**: createdAt, updatedAt, deletedAt

## Development

### Backend Development

```bash
cd backend
npm run dev  # Start with nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Building for Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secrets
4. Configure production email service
5. Deploy to your preferred platform (Heroku, Railway, DigitalOcean, etc.)

### Frontend Deployment

1. Update `VITE_API_URL` to production backend URL
2. Build the application: `npm run build`
3. Deploy to static hosting (Vercel, Netlify, CloudFlare Pages, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@yourapp.com or create an issue in the GitHub repository.

---

## Roadmap

### Upcoming Features
- [ ] Two-factor authentication (2FA)
- [ ] OAuth provider integration (Google, GitHub, Facebook)
- [ ] Advanced audit logging
- [ ] User analytics and insights
- [ ] API rate limiting per project
- [ ] Webhook support for user events
- [ ] Mobile SDKs (React Native, Flutter)
- [ ] Advanced user segmentation
- [ ] SAML SSO integration
- [ ] Custom email templates editor

Built with ❤️ for developers who need reliable authentication.