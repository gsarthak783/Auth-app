# AuthSystem - Firebase-like Authentication Platform

A comprehensive authentication system similar to Firebase, built with modern web technologies. Manage users and authentication for multiple projects with a clean, intuitive interface.

## 🌟 Features

### Authentication & User Management
- **User Registration & Login** - Complete signup/signin flow with validation
- **Email Verification** - Configurable email verification system  
- **Password Reset** - Secure password reset via email
- **Session Management** - JWT-based authentication with refresh tokens
- **Account Security** - Account lockout, login attempt tracking
- **Profile Management** - User profile updates and account deletion

### Multi-Project Support
- **Project Creation** - Create multiple authentication projects
- **API Key Management** - Unique API keys for each project
- **User Isolation** - Users are isolated per project
- **Team Management** - Add team members with different roles
- **Project Settings** - Configurable authentication settings per project

### Admin Dashboard
- **User Analytics** - Track registrations, logins, and activity
- **Project Statistics** - Monitor project performance
- **User Management** - View, edit, and manage users
- **Real-time Monitoring** - Live statistics and user activity

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Express Rate Limit** - API rate limiting
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (recommended) or local MongoDB
- Email service (Gmail, SendGrid, etc.) for production

## 🏃‍♂️ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auth-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure MongoDB Atlas

**Important**: This project is configured to use MongoDB Atlas. Follow the detailed setup guide:

📋 **[MongoDB Atlas Setup Guide](./MONGODB_ATLAS_SETUP.md)**

Quick steps:
1. Create a MongoDB Atlas account at [cloud.mongodb.com](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or allow all for development: 0.0.0.0/0)
5. Get your connection string and update `.env`

### 4. Environment Configuration

Update `backend/.env` with your MongoDB Atlas connection string:
```env
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-system?retryWrites=true&w=majority

# Other configurations are already set with secure defaults
PORT=5000
NODE_ENV=development
JWT_SECRET=super-secret-jwt-key-for-access-tokens-2024-auth-system-v1
JWT_REFRESH_SECRET=super-secret-refresh-key-for-refresh-tokens-2024-auth-system-v1
# ... (see full .env file for all options)
```

### 5. Initialize Demo Data
```bash
# Create demo project and admin user
npm run seed
```

This creates:
- 📧 Demo admin: `admin@demo.com` / `admin123`
- 🔑 Demo API key: `ak_demo12345`

### 6. Start Backend Server
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

### 7. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🎯 Demo Credentials

Once you've run the seed script, you can use these credentials to test:

### Admin Login
- **Email**: `admin@demo.com`
- **Password**: `admin123`
- **API Key**: `ak_demo12345`

### Test Registration
You can register new users using the API key `ak_demo12345` on the signup page.

## 📁 Project Structure

```
auth-system/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── utils/             # Helper functions
│   └── server.js          # Main server file
│
├── frontend/               # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── MONGODB_ATLAS_SETUP.md  # Detailed MongoDB Atlas guide
└── README.md
```

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server
npm run start    # Start production server
npm run seed     # Initialize demo data
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify/:token` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### User Management
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `DELETE /api/auth/delete-account` - Delete user account

#### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/users` - List project users
- `POST /api/projects/:id/users` - Add user to project

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **JWT Tokens** - Secure access and refresh tokens
- **Rate Limiting** - Prevent brute force attacks
- **CORS Protection** - Configurable origin restrictions
- **Input Validation** - Comprehensive request validation
- **Account Lockout** - Automatic lockout after failed attempts
- **Secure Headers** - Helmet.js security headers

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB Atlas is properly configured
3. Configure email service for production
4. Deploy using platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Netlify, Vercel, or any static hosting service
3. Update `VITE_API_URL` to point to your backend

## 🛠️ Configuration

### MongoDB Atlas Connection
See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for detailed instructions.

### Email Service
Update the email configuration in `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### CORS Configuration
Update allowed origins in `backend/.env`:
```env
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. **MongoDB Atlas Connection**: Check the [setup guide](./MONGODB_ATLAS_SETUP.md)
2. **Authentication Issues**: Verify API keys and JWT secrets
3. **CORS Errors**: Check frontend URL configuration
4. **Email Issues**: Verify SMTP settings

For additional help, please create an issue in the repository.

---

**Made with ❤️ for developers who need Firebase-like authentication without the vendor lock-in.**