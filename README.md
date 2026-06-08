# 🧵 Threadora

A modern, full-stack web application built with cutting-edge technologies for seamless product management and secure authentication.

---

## 🎯 Overview

Threadora is a production-ready full-stack application demonstrating professional software engineering practices, including:
- **Secure Authentication** with JWT and Google OAuth integration
- **RESTful API** with comprehensive validation and error handling
- **Modern Frontend** with responsive UI and state management
- **MongoDB** integration with Mongoose ORM
- **Cloud Image Storage** using ImageKit
- **Professional Code Architecture** with middleware pattern and service layer

---

## 🛠️ Tech Stack

### Backend
```
Node.js + Express 5.2.1
├── Authentication
│   ├── JWT (jsonwebtoken)
│   ├── Passport.js with Google OAuth 2.0
│   └── Password hashing (bcryptjs)
├── Database
│   └── MongoDB + Mongoose 9.6.3
├── File Management
│   ├── Multer for uploads
│   └── ImageKit for cloud storage
├── Validation & Security
│   ├── express-validator
│   ├── CORS enabled
│   └── Cookie Parser
└── Logging
    └── Morgan HTTP logger
```

### Frontend
```
React 19.0 + Vite
├── State Management
│   └── Redux Toolkit
├── Routing
│   └── React Router v7
├── Styling
│   └── Tailwind CSS v4
├── HTTP Client
│   └── Axios
└── UI/UX
    ├── React Toastify (notifications)
    └── Responsive Design
```

---

## 📁 Project Structure

```
Threadora/
├── Backend/
│   ├── src/
│   │   ├── app.js              # Express app configuration
│   │   ├── config/             # Database & environment config
│   │   ├── controllers/        # Business logic handlers
│   │   ├── middlewares/        # Auth, validation, error handling
│   │   ├── models/             # MongoDB schemas (User, Product)
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # Business logic services
│   │   ├── validators/         # Request validation rules
│   │   └── utils/              # Async handler utilities
│   ├── server.js               # Entry point
│   └── package.json            # Dependencies
│
└── Frontend/
    ├── src/
    │   ├── app/                # App configuration
    │   │   ├── App.jsx         # Root component
    │   │   ├── app.routes.jsx  # Route definitions
    │   │   └── app.store.js    # Redux store
    │   └── features/           # Feature modules
    │       ├── auth/           # Authentication feature
    │       │   ├── components/ # Login, Signup, Protected routes
    │       │   ├── hooks/      # useAuth hook
    │       │   ├── pages/      # Auth pages
    │       │   ├── services/   # Auth API calls
    │       │   └── states/     # Redux slices
    │       └── shared/         # Shared components
    └── vite.config.js          # Build configuration
```

---

## ✨ Key Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Google OAuth 2.0 integration
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes with middleware
- ✅ Cookie-based session management

### Product Management
- ✅ CRUD operations for products
- ✅ Image upload with cloud storage
- ✅ Comprehensive input validation
- ✅ Error handling and logging

### Backend Architecture
- ✅ Separation of concerns (Controllers, Services, Models)
- ✅ Middleware pattern for request processing
- ✅ Global error handling
- ✅ Request validation layer
- ✅ Async/await error wrapper utilities

### Frontend Features
- ✅ Modern React with Hooks
- ✅ Redux state management
- ✅ Client-side routing
- ✅ Responsive Tailwind CSS design
- ✅ Toast notifications for user feedback
- ✅ Protected routes and role-based access

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB local instance or MongoDB Atlas connection
- Google OAuth credentials

### Backend Setup

```bash
cd Backend
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
# GOOGLE_CLIENT_ID=your_client_id
# GOOGLE_CLIENT_SECRET=your_client_secret
# IMAGEKIT_PUBLIC_KEY=your_imagekit_key
# IMAGEKIT_PRIVATE_KEY=your_private_key
# IMAGEKIT_URL_ENDPOINT=your_url_endpoint

# Development
npm run dev

# Production
npm run start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Visit `http://localhost:5173` (or your configured Vite port)

---

## 📝 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth

### Product Routes
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (authenticated)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

---

## 🔒 Security Features

- **JWT Authentication** - Stateless, secure token-based auth
- **CORS Protection** - Configured for trusted origins
- **Request Validation** - express-validator middleware
- **Password Security** - Bcryptjs hashing with salt rounds
- **Error Handling** - No sensitive information leakage
- **HTTP Only Cookies** - Secure cookie configuration
- **Environment Variables** - Sensitive data protection

---

## 📦 Dependencies Highlights

### Backend
- **Express 5.2.1** - Latest web framework
- **Mongoose 9.6.3** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **express-validator** - Request validation
- **bcryptjs** - Secure password hashing
- **ImageKit** - Cloud image management

### Frontend
- **React 19.0** - Latest React version
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS
- **Axios** - Promise-based HTTP client
- **Vite** - Next-gen build tool

---

## 🎓 Learning & Best Practices

This project demonstrates:
- ✅ Clean code architecture with separation of concerns
- ✅ Middleware pattern for cross-cutting concerns
- ✅ Service layer for business logic
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization
- ✅ RESTful API design principles
- ✅ Component-based UI architecture
- ✅ State management with Redux
- ✅ Environment-based configuration
- ✅ Responsive design patterns

---

## 📚 Documentation

- [Backend Documentation](Backend/README.md) *(if available)*
- [Frontend Documentation](Frontend/README.md) *(if available)*
- [Design System](Frontend/DESIGN.md)

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run start    # Start production server
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## 🤝 Contributing

Feel free to fork this repository and submit pull requests to help improve Threadora.

---

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

---

## 👨‍💻 About

Threadora is built with a focus on modern development practices, scalability, and maintainability. It serves as a comprehensive example of full-stack JavaScript development with industry best practices.

**Created with ❤️ using Node.js, React, and MongoDB**
