# 📸 Instagram Clone

A full-stack social media application inspired by Instagram, built to practice and demonstrate modern frontend and backend web development.

## 🚀 About the Project

This project is a functional Instagram-style social media application where users can create accounts, authenticate, create posts, interact with posts, follow other users, and manage their profiles.

The project was built from scratch as a learning project, with both the frontend and backend developed and connected to a PostgreSQL database.

## ✨ Features

- 🔐 User registration and login
- 🔑 JWT-based authentication
- 👤 User profiles
- 📝 Create posts
- ❤️ Like posts
- 💬 Comment on posts
- 👥 Follow and unfollow users
- 📊 Followers and following pages
- 🏠 Home feed
- 🔎 Browse users
- 🖼️ Profile image support
- 🔒 Protected backend routes

## 🛠️ Technologies Used

### Frontend

- React
- JavaScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

### Development Tools

- Git
- GitHub
- VS Code

## 📁 Project Structure

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
