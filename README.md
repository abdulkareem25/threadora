# 🧵 Threadora

A full-stack e-commerce marketplace built on a modern JavaScript stack - multi-role authentication, a product catalog with rich client-side filtering, and a clean feature-sliced frontend architecture.

---

## 🎯 Overview

Threadora is a production-oriented full-stack application with a clear separation between **Buyer** and **Seller** roles. Sellers can list products with cloud-hosted images; Buyers browse a polished catalog with real-time filtering, color-swatch selection, and wishlist interactions - all gated behind JWT-authenticated, role-enforced API endpoints.

Key engineering highlights:
- **Role-based access control** - `authSeller` middleware gates every seller-only route
- **Multi-strategy auth** - email/phone + password *and* Google OAuth 2.0 (Passport.js, stateless/session-less)
- **Feature-sliced frontend** - each domain (auth, products, shared) is a self-contained module with its own pages, hooks, services, states, and styles
- **Redux Toolkit** auth state - `setUser / setLoading / setError` pattern with a `useAuth` custom hook as the single integration surface
- **ImageKit** cloud storage - products support an `images[]` array backed by CDN delivery
- **Global error pipeline** - `notFoundHandler` + `errorHandler` middleware with no sensitive data leakage

---

## 🛠️ Tech Stack

### Backend
```
Node.js + Express 5.2.1
├── Authentication
│   ├── JWT (jsonwebtoken) - stateless, HTTP-only cookies
│   ├── Passport.js - Google OAuth 2.0 (session: false)
│   └── bcryptjs - pre-save hook hashing with 10 salt rounds
├── Database
│   └── MongoDB + Mongoose 9.6.3
├── File Management
│   ├── Multer - multipart/form-data parsing
│   └── ImageKit - CDN-backed cloud image storage
├── Validation & Security
│   ├── express-validator - schema-level request validation
│   ├── CORS - configured for trusted origins
│   └── cookie-parser - HTTP-only cookie support
└── Observability
    └── Morgan - HTTP request logging (dev format)
```

### Frontend
```
React 19.0 + Vite
├── State Management
│   └── Redux Toolkit - authSlice (user, loading, error)
├── Routing
│   └── React Router v7 - createBrowserRouter
├── Styling
│   └── Tailwind CSS v4 + scoped feature CSS
├── HTTP Client
│   └── Axios - centralised auth API service
└── UI/UX
    ├── React Toastify - toast notifications
    ├── Inline SVG icon system - zero external icon dependency
    └── Color swatch selector, wishlist toggle, filter chips
```

---

## 📁 Project Structure

```
Threadora/
├── Backend/
│   ├── server.js                     # Entry point — starts HTTP server
│   ├── src/
│   │   ├── app.js                    # Express app — middleware, routes, Passport bootstrap
│   │   ├── config/                   # Centralised env config (config.js)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # signup, login, google, getUser, logout
│   │   │   └── product.controller.js # createProduct, getProducts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    # authMiddleware (JWT) + authSeller (role guard)
│   │   │   ├── validate.middleware.js # express-validator error formatter
│   │   │   ├── error.middleware.js   # Global error handler
│   │   │   └── notFound.middleware.js # 404 catch-all
│   │   ├── models/
│   │   │   ├── user.model.js         # User schema — roles: buyer | seller, optional googleId
│   │   │   └── product.model.js      # Product schema — images[], price{amount,currency}, stock
│   │   ├── routes/
│   │   │   ├── auth.route.js         # /api/auth — signup, login, google, me, logout
│   │   │   └── product.route.js      # /api/products — seller-gated CRUD
│   │   ├── services/                 # Business logic decoupled from controllers
│   │   ├── validators/
│   │   │   ├── auth.validator.js     # signupValidator, loginValidator
│   │   │   └── product.validator.js  # createProductValidator
│   │   └── utils/                    # asyncHandler wrapper
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── main.jsx                  # React DOM entry — Redux Provider + RouterProvider
    │   ├── app/
    │   │   ├── App.jsx               # Root — RouterProvider wrapper
    │   │   ├── app.routes.jsx        # Route definitions: /, /login, /signup
    │   │   ├── app.store.js          # Redux store
    │   │   └── index.css             # Global resets + design tokens
    │   └── features/
    │       ├── auth/                 # Auth feature module
    │       │   ├── components/
    │       │   │   ├── GoogleButton.jsx    # OAuth trigger button
    │       │   │   └── Protected.jsx       # Route guard component
    │       │   ├── hooks/
    │       │   │   └── useAuth.js          # loginUser, signupUser, logoutUser
    │       │   ├── pages/
    │       │   │   ├── Login.jsx           # Email/phone + password form
    │       │   │   └── Signup.jsx          # Multi-step signup with role selection
    │       │   ├── services/
    │       │   │   └── auth.api.js         # Axios auth endpoints
    │       │   ├── states/
    │       │   │   └── auth.slice.js       # Redux slice — user, loading, error
    │       │   └── styles/
    │       │       └── auth.css            # Scoped auth UI styles
    │       ├── products/             # Products feature module
    │       │   ├── pages/
    │       │   │   └── Home.jsx            # Product catalog — filtering, swatches, wishlist
    │       │   └── styles/
    │       │       └── products.css        # Scoped product UI styles
    │       └── shared/               # Cross-feature components
    │           ├── components/
    │           │   ├── Header.jsx          # Top nav — logo, links, mobile menu
    │           │   └── Footer.jsx          # Site footer
    │           └── styles/
    └── vite.config.js
```

---

## ✨ Key Features

### Authentication & Authorization
- ✅ JWT issued on login/signup, stored in HTTP-only cookies
- ✅ Google OAuth 2.0 - Passport strategy, session-less (`session: false`)
- ✅ bcryptjs pre-save hook — passwords hashed before hitting the DB
- ✅ `authMiddleware` — validates JWT, attaches `req.user` to the request
- ✅ `authSeller` — role guard; rejects non-seller requests with 403
- ✅ `GET /api/auth/me` — hydrates the Redux store on app load
- ✅ `POST /api/auth/logout` — clears the JWT cookie server-side

### User Roles
- ✅ **Buyer** (default) — browse catalog, wishlist items
- ✅ **Seller** — create and manage product listings
- ✅ Role selection at signup via an accessible card-picker UI
- ✅ `phone` and `password` fields conditionally required — skipped for OAuth users

### Product Catalog — Home Page
- ✅ Product grid with full-bleed imagery
- ✅ Badge overlays — *Just In*, *Member Exclusive*, *Sale*, *Coming Soon*
- ✅ Color swatch selector (up to 5 visible, overflow count shown)
- ✅ Sale price with percentage-off badge calculated dynamically
- ✅ Wishlist toggle (heart icon) per card
- ✅ Filter chips — *All / New & Featured / Apparel / Accessories / Sale*
- ✅ Responsive navigation with mobile hamburger menu and slide-in drawer
- ✅ Inline SVG icon system — no external icon library

### Product Management (Seller API)
- ✅ `POST /api/products` — create product (seller only); supports `images[]`, multi-currency `price`
- ✅ `GET /api/products` — fetch authenticated seller's own listings
- ✅ `name`, `description`, `category`, `stock`, `price.amount` — all validated server-side
- ✅ ImageKit integration for cloud-hosted product images

### Frontend Architecture
- ✅ Feature-sliced directory structure — auth, products, shared are fully independent modules
- ✅ `useAuth` hook — single integration point for all auth mutations
- ✅ `useSelector` / Redux Toolkit — `loading` and `error` states drive UI feedback
- ✅ Client-side field validation on Login and Signup before hitting the API
- ✅ `Protected.jsx` — declarative route guard for authenticated-only pages

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google OAuth 2.0 credentials
- ImageKit account

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

```bash
npm run dev     # Development with hot-reload (nodemon)
npm start   # Production server
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 📝 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/signup` | Public | Register with `fullName`, `email`, `phone`, `password`, `role` |
| `POST` | `/login` | Public | Login with `credential` (email or phone) + `password` |
| `GET`  | `/google` | Public | Initiate Google OAuth flow |
| `GET`  | `/google/callback` | Public | OAuth callback — issues JWT cookie and redirects |
| `GET`  | `/me` | Private | Returns the authenticated user from JWT cookie |
| `POST` | `/logout` | Private | Clears the JWT cookie server-side |

### Products — `/api/products`

> All product routes require a valid JWT **and** `role: seller`.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Seller | Create a product listing |
| `GET`  | `/` | Seller | Fetch the authenticated seller's products |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Returns `{ status: 'OK' }` — liveness probe |

---

## 🔒 Security

| Concern | Approach |
|---------|----------|
| Auth tokens | HTTP-only cookies — inaccessible to JS |
| Password storage | bcryptjs — 10 salt rounds, hashed in Mongoose pre-save hook |
| Input validation | `express-validator` on every mutating route |
| Role enforcement | `authSeller` middleware — 403 on role mismatch |
| OAuth | Passport.js session-less — no server-side session store required |
| Error responses | Global `errorHandler` — never exposes stack traces in production |
| Secrets | All credentials via `.env` — never committed |

---

## 📦 Key Dependencies

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 5.2.1 | Web framework |
| `mongoose` | 9.6.3 | MongoDB ODM |
| `passport-google-oauth20` | — | Google OAuth strategy |
| `jsonwebtoken` | — | JWT sign / verify |
| `bcryptjs` | — | Password hashing |
| `express-validator` | — | Request validation |
| `imagekit` | — | Cloud image upload |
| `morgan` | — | HTTP request logging |
| `cookie-parser` | — | Cookie parsing |

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.0 | UI library |
| `react-router-dom` | v7 | Client-side routing |
| `@reduxjs/toolkit` | — | State management |
| `axios` | — | HTTP client |
| `react-toastify` | — | Toast notifications |
| `vite` | — | Build tooling |

---

## 🔧 Scripts

### Backend
```bash
npm run dev     # Development with hot-reload (nodemon)
npm run start   # Production server
```

### Frontend
```bash
npm run dev     # Vite dev server
npm run build   # Production bundle
npm run lint    # ESLint
npm run preview # Preview production build locally
```

---

## 🗺️ Roadmap

- [ ] Buyer-facing product browsing connected to live API data
- [ ] Seller dashboard — full CRUD UI for product management
- [ ] Product detail page with image gallery
- [ ] Cart and checkout flow
- [ ] Pagination / infinite scroll on the product catalog
- [ ] Image upload UI wired to ImageKit
- [ ] Admin role — platform-wide oversight

---

## 🤝 Contributing

1. Fork the repo and create a feature branch (`git checkout -b feat/your-feature`)
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
3. Open a pull request with a clear description of the change

---

## 📄 License

ISC License — see the LICENSE file for details.

---

**Built with Node.js · React · MongoDB · ImageKit**
