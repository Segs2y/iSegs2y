# Instagram Clone - Complete Setup & Running Guide

## Project Overview

This is a full-stack Instagram clone built with:

- **Frontend**: React 19 + Vite + React Router
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT tokens + bcrypt password hashing

---

## Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional but recommended)

---

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database

```bash
# Open PostgreSQL CLI (psql) or use pgAdmin
createdb instagram_clone
```

### 1.2 Configure Environment Variables

Navigate to `server/` folder and create a `.env` file:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/instagram_clone"
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
SERVER_PORT=5000
```

### 1.3 Run Database Migrations

```bash
# Install dependencies first
npm install

# Run Prisma migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

---

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd server
npm install
```

### 2.2 Start Backend Server

```bash
node server.js
```

Expected output:

```
Server running on http://localhost:5000
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
# From the root directory
npm install
```

### 3.2 Start Frontend Dev Server

```bash
npm run dev
```

Expected output:

```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## Step 4: Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. You'll be redirected to the login page
3. Click "Create New Account" to register a new user
4. Fill in username, email, and password
5. Click "Sign Up" and you'll be redirected to login
6. Log in with your new credentials
7. Start using Instagram Clone! 🎉

---

## Complete Feature List

### ✅ Authentication

- [x] User Registration
- [x] User Login
- [x] JWT Token-based Auth
- [x] Protected Routes
- [x] Logout

### ✅ Posts

- [x] Create Posts
- [x] View Posts (from users you follow)
- [x] Delete Posts (only your own)
- [x] Post Likes
- [x] Post Comments

### ✅ Social Features

- [x] Follow/Unfollow Users
- [x] View Followers
- [x] View Following
- [x] Discover Users

### ✅ User Profile

- [x] View Own Profile
- [x] Upload Profile Picture
- [x] View Other Users' Profiles
- [x] View User Stats (posts, followers, following)

---

## Backend API Endpoints

### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
```

### Users

```
GET    /api/users                - Get all users
GET    /api/users/:id            - Get specific user profile
POST   /api/users/:id/follow     - Follow user
DELETE /api/users/:id/follow     - Unfollow user
GET    /api/users/:id/followers  - Get user's followers
GET    /api/users/:id/following  - Get user's following
POST   /api/users/profile-image  - Upload profile picture
DELETE /api/users/profile-image  - Delete profile picture
```

### Posts

```
POST   /api/posts                - Create post
GET    /api/posts                - Get posts feed
DELETE /api/posts/:id            - Delete post
POST   /api/posts/:id/like       - Like post
DELETE /api/posts/:id/like       - Unlike post
```

### Comments

```
POST   /api/posts/:id/comments   - Create comment
GET    /api/posts/:id/comments   - Get comments on post
DELETE /api/comments/:id         - Delete comment
```

---

## Frontend Pages & Routes

| Route                  | Description            |
| ---------------------- | ---------------------- |
| `/login`               | User login page        |
| `/register`            | User registration page |
| `/`                    | Home feed (main page)  |
| `/profile`             | Current user's profile |
| `/users`               | Discover users page    |
| `/users/:id`           | Other user's profile   |
| `/users/:id/followers` | User's followers list  |
| `/users/:id/following` | User's following list  |

---

## Troubleshooting

### Backend won't start

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**: Ensure PostgreSQL is running

```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\[version]\data" start

# macOS (Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Database connection error

**Problem**: `PrismaClientInitializationError`

**Solution**: Check your `.env` file in the `server/` folder

- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check username and password

### Frontend can't connect to backend

**Problem**: `Failed to fetch from http://localhost:5000`

**Solution**:

1. Ensure backend server is running on port 5000
2. Check that CORS is enabled in `server.js` ✅ (already enabled)
3. Verify the API URL in frontend (should be `http://localhost:5000`)

### VITE port already in use

**Problem**: `Port 5173 is already in use`

**Solution**: Kill the process or use a different port

```bash
# Use a different port
npm run dev -- --port 5174
```

---

## Production Deployment

### Before Deploying:

1. Set strong `JWT_SECRET` in `.env`
2. Set `NODE_ENV=production`
3. Build frontend: `npm run build`
4. Use a proper database (RDS, Managed PostgreSQL)
5. Set up environment variables on your hosting platform

### Deployment Platforms:

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Database**: AWS RDS, Digital Ocean, Supabase

---

## Development Tips

### Enable TypeScript (Optional)

Frontend already has TypeScript setup available:

```bash
# Rename files from .jsx to .tsx and add types
```

### Add Testing

```bash
# Install testing libraries
npm install --save-dev vitest @testing-library/react @testing-library/user-event

# Create test files (e.g., components/__tests__/Button.test.jsx)
npm run test
```

### Add Styling Framework

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## File Structure

```
instagram-clone/
├── server/                 # Backend (Express)
│   ├── server.js          # Main server file
│   ├── middleware/        # Auth middleware
│   ├── prisma/            # Database schema & migrations
│   ├── uploads/           # Profile images storage
│   ├── package.json
│   ├── .env               # Environment variables
│   └── .env.example       # Example env file
├── src/                   # Frontend (React)
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
└── README.md            # Project documentation
```

---

## Common Use Cases

### Test the Follow Feature

1. Create 2 user accounts
2. Login with user 1
3. Go to `/users`
4. Find user 2 and click "Follow"
5. Go back and check your profile → Following
6. Login with user 2 and check Followers

### Test Comments

1. Create a post
2. Comment on the post
3. See comments appear instantly
4. Delete a comment (only your own)

### Test Profile Picture

1. Go to your profile
2. Click "Change Profile Photo"
3. Select an image file
4. See it appear in your profile

---

## Next Steps to Enhance

1. **Add Image Upload for Posts** (similar to profile pictures)
2. **Add Real-time Notifications** (WebSockets)
3. **Add Direct Messages** (Chat system)
4. **Add Hashtags & Search**
5. **Add Like Notifications**
6. **Add Post Editing** (update post content)
7. **Add User Search** (advanced search)
8. **Add Dark Mode**
9. **Add Mobile Responsiveness**
10. **Add Email Verification**

---

## Need Help?

- Check backend logs in terminal
- Open browser DevTools (F12) to see frontend errors
- Use `npx prisma studio` to inspect database
- Check that all ports (5000, 5173) are available

---

**Happy Coding! 🚀**
