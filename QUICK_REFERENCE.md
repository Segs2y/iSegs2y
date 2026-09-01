# 🚀 Instagram Clone - Quick Reference Card

## Essential Commands

### Backend Setup & Run

```bash
cd server
npm install
npx prisma migrate deploy
node server.js
# Server runs on http://localhost:5000
```

### Frontend Setup & Run

```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Database Management

```bash
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create new migration
npx prisma db push        # Push schema changes
npx prisma generate       # Generate Prisma client
```

---

## Testing the API with cURL or Postman

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Response includes "token" - copy this for next requests
```

### 3. Get Current User (use token from login)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Post

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Hello Instagram! 👋"
  }'
```

### 5. Get Posts Feed

```bash
curl -X GET http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Like a Post (postId = 1)

```bash
curl -X POST http://localhost:5000/api/posts/1/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Unlike a Post

```bash
curl -X DELETE http://localhost:5000/api/posts/1/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Add Comment to Post

```bash
curl -X POST http://localhost:5000/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Great post! 🙌"
  }'
```

### 9. Follow User (userId = 2)

```bash
curl -X POST http://localhost:5000/api/users/2/follow \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 10. Get User Profile (userId = 2)

```bash
curl -X GET http://localhost:5000/api/users/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 11. Get All Users

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 12. Get User Followers (userId = 2)

```bash
curl -X GET http://localhost:5000/api/users/2/followers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## File Locations & Purposes

| File                                  | Purpose                        |
| ------------------------------------- | ------------------------------ |
| `server/server.js`                    | All backend API endpoints      |
| `server/middleware/authMiddleware.js` | JWT token verification         |
| `server/prisma/schema.prisma`         | Database schema definition     |
| `server/.env`                         | Database credentials & secrets |
| `src/App.jsx`                         | Frontend routing setup         |
| `src/pages/Home.jsx`                  | Main feed page                 |
| `src/pages/Login.jsx`                 | Login page                     |
| `src/pages/Profile.jsx`               | User's own profile             |

---

## Frontend Routes

| Route                  | Component       | Description                 |
| ---------------------- | --------------- | --------------------------- |
| `/login`               | Login.jsx       | User login page             |
| `/register`            | Register.jsx    | User registration page      |
| `/`                    | Home.jsx        | Main feed with posts        |
| `/profile`             | Profile.jsx     | Current user's profile      |
| `/users`               | Users.jsx       | Discover & browse users     |
| `/users/:id`           | UserProfile.jsx | View another user's profile |
| `/users/:id/followers` | Followers.jsx   | View user's followers       |
| `/users/:id/following` | Following.jsx   | View user's following list  |

---

## Backend API Summary

### 18 Endpoints

| Method | Endpoint                   | Protected | Description          |
| ------ | -------------------------- | --------- | -------------------- |
| POST   | `/api/auth/register`       | ❌        | Register new user    |
| POST   | `/api/auth/login`          | ❌        | Login user           |
| GET    | `/api/auth/me`             | ✅        | Get current user     |
| GET    | `/api/users`               | ✅        | Get all users        |
| GET    | `/api/users/:id`           | ✅        | Get user profile     |
| POST   | `/api/users/:id/follow`    | ✅        | Follow user          |
| DELETE | `/api/users/:id/follow`    | ✅        | Unfollow user        |
| GET    | `/api/users/:id/followers` | ✅        | Get followers list   |
| GET    | `/api/users/:id/following` | ✅        | Get following list   |
| POST   | `/api/users/profile-image` | ✅        | Upload profile image |
| DELETE | `/api/users/profile-image` | ✅        | Delete profile image |
| POST   | `/api/posts`               | ✅        | Create post          |
| GET    | `/api/posts`               | ✅        | Get posts feed       |
| DELETE | `/api/posts/:id`           | ✅        | Delete post          |
| POST   | `/api/posts/:id/like`      | ✅        | Like post            |
| DELETE | `/api/posts/:id/like`      | ✅        | Unlike post          |
| POST   | `/api/posts/:id/comments`  | ✅        | Create comment       |
| GET    | `/api/posts/:id/comments`  | ✅        | Get comments         |
| DELETE | `/api/comments/:id`        | ✅        | Delete comment       |

---

## Common Debugging Tips

### Check Backend Logs

```bash
# Terminal where backend is running should show:
- Login attempts
- Post creations
- Errors with full stack trace
```

### Check Frontend Console

```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages or API responses
4. Network tab shows all API calls
```

### Test Database Connection

```bash
npx prisma studio
# Opens GUI at http://localhost:5555
# Can see all database records
```

### Clear Browser Cache & Storage

```javascript
// In browser console:
localStorage.clear();
location.reload();
```

---

## Useful npm Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
node server.js       # Start server
npm install          # Install dependencies
```

---

## Authentication Token Format

Your JWT token looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiam9obiIsImlhdCI6MTYxNjIzOTAyMn0.abc123...
```

It contains:

- User ID
- Username
- Issue timestamp (iat)
- Expiration timestamp (exp) - 7 days from login

---

## Error Codes Reference

| Code | Meaning      | Common Cause              |
| ---- | ------------ | ------------------------- |
| 400  | Bad Request  | Missing required fields   |
| 401  | Unauthorized | Invalid/missing token     |
| 403  | Forbidden    | Can only delete own posts |
| 404  | Not Found    | User/post doesn't exist   |
| 500  | Server Error | Database connection issue |

---

## Performance Tips

1. **Database**: Use `npx prisma studio` to check if data exists
2. **API**: Add console.log in requests to verify data
3. **Frontend**: Use React DevTools extension for debugging
4. **Network**: Use browser Network tab to inspect API responses

---

## Quick Test Scenario

```
1. Register user: john@example.com / password123
2. Login and copy token
3. Create post: "Hello World!"
4. Like own post
5. Comment: "Love this!"
6. Go to users page
7. Follow another user
8. Check home feed - should see their posts now
9. Go to their profile
10. View their followers list
```

---

## File Upload (Profile Pictures)

Image requirements:

- Format: JPG, PNG, GIF, WebP
- Max size: 5MB
- Location: `server/uploads/`
- API: `POST /api/users/profile-image` with form-data

Example using FormData:

```javascript
const formData = new FormData();
formData.append("profileImage", fileInput.files[0]);

fetch("http://localhost:5000/api/users/profile-image", {
  method: "POST",
  headers: { Authorization: "Bearer " + token },
  body: formData,
});
```

---

## Environment Variables Checklist

- [ ] DATABASE_URL set in `server/.env`
- [ ] JWT_SECRET set in `server/.env`
- [ ] PostgreSQL running locally
- [ ] Backend port 5000 available
- [ ] Frontend port 5173 available

---

## Need Help?

1. Check SETUP_GUIDE.md for detailed instructions
2. Review DEVELOPMENT_SUMMARY.md for feature overview
3. Check browser console (F12) for errors
4. Check backend terminal for error messages
5. Use `npx prisma studio` to verify database state

---

**Happy Coding! 🚀**
