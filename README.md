# 📸 Instagram Clone

A full-stack social media application inspired by Instagram, built with modern web technologies to demonstrate complete CRUD operations, authentication, and real-time interactions.

## ✨ Features

- 🔐 **User Authentication**: Secure login/register with JWT tokens
- 👤 **User Profiles**: View and manage user profiles with profile pictures
- 📝 **Posts**: Create, view, and delete posts
- ❤️ **Likes**: Like and unlike posts with real-time counter updates
- 💬 **Comments**: Add and delete comments on posts
- 👥 **Follow System**: Follow/unfollow users and view follower/following lists
- 🏠 **Home Feed**: See posts from users you follow and your own posts
- 🔎 **User Discovery**: Browse and discover other users
- 🖼️ **Profile Images**: Upload and manage profile pictures
- 🔒 **Protected Routes**: Secure API endpoints with authentication

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

```bash
# 1. Setup Backend
cd server
npm install

# Create .env file from template
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate deploy

# Start backend server
node server.js

# 2. In a new terminal, setup Frontend
npm install

# Start frontend development server
npm run dev
```

Visit `http://localhost:5173` in your browser and sign up to get started!

**📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## 📋 API Endpoints

### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user
```

### Users

```
GET    /api/users                - Get all users
GET    /api/users/:id            - Get user profile with stats
POST   /api/users/:id/follow     - Follow user
DELETE /api/users/:id/follow     - Unfollow user
GET    /api/users/:id/followers  - Get user followers
GET    /api/users/:id/following  - Get user following
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
GET    /api/posts/:id/comments   - Get comments
DELETE /api/comments/:id         - Delete comment
```

### Profile

```
POST   /api/users/profile-image  - Upload profile picture
DELETE /api/users/profile-image  - Remove profile picture
```

## 🗂️ Project Structure

```
instagram-clone/
├── server/                    # Backend (Node.js + Express)
│   ├── server.js             # Main server file with all routes
│   ├── middleware/           # Auth middleware
│   │   └── authMiddleware.js # JWT verification
│   ├── prisma/               # Database
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Migration history
│   ├── uploads/              # Profile image storage
│   ├── package.json
│   ├── .env.example          # Environment template
│   └── .env                  # Environment variables (create from .env.example)
│
├── src/                       # Frontend (React + Vite)
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── PostCard.jsx     # Post display component
│   │   └── CreatePost.jsx   # Post creation form
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home feed
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Profile.jsx      # Current user's profile
│   │   ├── Users.jsx        # Discover users
│   │   ├── UserProfile.jsx  # Other users' profiles
│   │   ├── Followers.jsx    # Followers list
│   │   └── Following.jsx    # Following list
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── package.json             # Frontend dependencies
├── vite.config.js          # Vite configuration
├── SETUP_GUIDE.md          # Detailed setup instructions
├── DEVELOPMENT_SUMMARY.md  # Changes and improvements made
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool
- **React Router v7** - Client-side routing
- **CSS3** - Styling

### Backend

- **Node.js** - Runtime
- **Express.js v5** - Web framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **multer** - File uploads
- **CORS** - Cross-origin requests

## 🔐 Authentication Flow

1. User registers with username, email, and password
2. Password is hashed using bcrypt (10 salt rounds)
3. User data is stored in PostgreSQL
4. User logs in with email and password
5. Password is verified against hashed version
6. JWT token is issued with 7-day expiration
7. Token is stored in localStorage on client
8. Token is sent with every API request in Authorization header
9. Backend verifies token with authMiddleware
10. Protected routes require valid token

## 📊 Database Schema

### User

- id, username, email, password, profileImage, createdAt
- Relations: posts, likes, comments, followers, following

### Post

- id, content, userId, createdAt
- Relations: user, likes, comments

### Like

- id, userId, postId, createdAt
- Unique constraint: userId + postId

### Comment

- id, content, userId, postId, createdAt
- Relations: user, post

### Follow

- id, followerId, followingId, createdAt
- Unique constraint: followerId + followingId

## 🎯 Key Features Explained

### User Feed

- Shows posts from users you follow and your own posts
- Posts are sorted by newest first
- Real-time like and comment counts
- Delete button appears only on your own posts

### Follow System

- Can follow/unfollow any user
- Cannot follow yourself
- Prevents duplicate follows
- Followers/following lists show all connections

### Comments

- Add comments to any post
- See all comments for each post
- Delete your own comments
- Comments show username and timestamp

### Profile Management

- Upload custom profile picture
- View account stats (posts, followers, following)
- See all your posts on your profile
- Visit other users' profiles

## 🚀 Deployment

### Frontend Deployment

- Build: `npm run build`
- Deploy built files to Vercel, Netlify, or GitHub Pages

### Backend Deployment

- Deploy to Railway, Render, Heroku, or DigitalOcean
- Set environment variables on hosting platform
- Use managed PostgreSQL database (AWS RDS, Supabase, etc.)

## 📝 Environment Variables

Create a `.env` file in the `server/` folder:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/instagram_clone"
JWT_SECRET="your_super_secret_key_change_this"
SERVER_PORT=5000
```

## 🐛 Troubleshooting

| Issue                             | Solution                                            |
| --------------------------------- | --------------------------------------------------- |
| Backend won't connect to database | Check DATABASE_URL and ensure PostgreSQL is running |
| Frontend can't reach backend      | Verify backend is running on port 5000              |
| VITE port already in use          | Use `npm run dev -- --port 5174`                    |
| Profile images not showing        | Ensure uploads folder exists in server directory    |

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more detailed troubleshooting.

## 🎓 Learning Outcomes

This project demonstrates:

- Full-stack development with React and Node.js
- REST API design and implementation
- Database design with Prisma ORM
- User authentication and authorization
- File upload handling
- Protected routes and middleware
- State management in React
- Async/await and Promise handling
- Error handling and validation
- Database migrations

## 📄 Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup and deployment guide
- [DEVELOPMENT_SUMMARY.md](DEVELOPMENT_SUMMARY.md) - Detailed list of features and improvements

## 🤝 Contributing

Feel free to fork, modify, and enhance this project!

## 📧 Support

For issues or questions, please check the troubleshooting section in [SETUP_GUIDE.md](SETUP_GUIDE.md).

## 📄 License

This project is open source and available for personal and educational use.

---

**Built with ❤️ using React + Express + PostgreSQL**

**[Start Now →](SETUP_GUIDE.md)**

```text
instagram-clone/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── server/
│   ├── middleware/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── server.js
│
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Segs2y/instagram-clone.git
```

### 2. Move into the project

```bash
cd instagram-clone
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Configure environment variables

Create a `.env` file inside the `server` directory and add the required database and authentication environment variables.

**Do not commit your `.env` file to GitHub.**

### 6. Start the application

Start the backend server from the `server` directory:

```bash
npm run dev
```

Then start the frontend from the project root:

```bash
npm run dev
```

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM for database management.

The project includes Prisma migrations for features including:

- Users
- Posts
- Likes
- Comments
- Follows
- Profile images

## 📚 What I Learned

Building this project helped me gain practical experience with:

- Building React applications from scratch
- Creating reusable React components
- Managing frontend state
- Connecting a React frontend to a REST API
- Building backend APIs with Express
- Implementing authentication with JWT
- Password hashing with bcrypt
- Designing database relationships with Prisma
- Working with PostgreSQL
- Implementing likes, comments and follows
- Using Git and GitHub for version control

## 🔮 Future Improvements

- Real-time notifications
- Image upload and cloud storage
- Direct messaging
- Search functionality
- Improved responsive design
- Deployment of the full application

## 👨‍💻 Author

**Segs2y**

GitHub: [@Segs2y](https://github.com/Segs2y)

---

⭐ If you find this project interesting, feel free to explore the code and follow my development journey.
