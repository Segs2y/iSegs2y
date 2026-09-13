import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { authMiddleware } from "./middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "iSegs API is running 🚀",
  });
});


// ========================================
// AUTH - LOGIN
// ========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});


// ========================================
// AUTH - REGISTER
// ========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});


// ========================================
// AUTH - CURRENT USER
// ========================================

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
  id: true,
  username: true,
  email: true,
  profileImage: true,
},
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);

    res.status(500).json({
      error: "Could not fetch user",
    });
  }
});

app.post(
  "/api/users/profile-image",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No image uploaded",
        });
      }

      const imageUrl = `${PUBLIC_URL}/uploads/${req.file.filename}`;

      const user = await prisma.user.update({
        where: {
          id: req.user.userId,
        },
        data: {
          profileImage: imageUrl,
        },
        select: {
          id: true,
          username: true,
          email: true,
          profileImage: true,
        },
      });

      res.json({
        message: "Profile image uploaded successfully",
        user,
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);

      res.status(500).json({
        error: "Could not upload profile image",
      });
    }
  },
);

app.delete(
  "/api/users/profile-image",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.user.userId,
        },
        data: {
          profileImage: null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          profileImage: true,
        },
      });

      res.json({
        message: "Profile image removed successfully",
        user,
      });
    } catch (error) {
      console.error("Error removing profile image:", error);

      res.status(500).json({
        error: "Could not remove profile image",
      });
    }
  },
);


// ========================================
// USERS
// ========================================

app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        profileImage: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      error: "Could not fetch users",
    });
  }
});

app.get("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const currentUserId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check if current user follows this user
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    res.json({
      ...user,
      isFollowing: !!isFollowing,
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    res.status(500).json({
      error: "Could not fetch user",
    });
  }
});


// ========================================
// POSTS - CREATE
// ========================================

app.post("/api/posts", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        error: "Post content is required",
      });
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        userId: req.user.userId,
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);

    res.status(500).json({
      error: "Could not create post",
    });
  }
});


// ========================================
// POSTS - GET ALL
// ========================================

app.get("/api/posts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find everyone the current user follows
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    // Create a list containing the current user
    // and everyone they follow
    const userIds = [
      userId,
      ...following.map((follow) => follow.followingId),
    ];

    // Get posts from those users
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      likedByMe: post.likes.length > 0,
      likes: undefined,
    }));

    res.json(postsWithLikeStatus);
  } catch (error) {
    console.error("Error fetching posts:", error);

    res.status(500).json({
      error: "Could not fetch posts",
    });
  }
});

// ========================================
// POSTS - DELETE
// ========================================

app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({
        error: "You can only delete your own posts",
      });
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);

    res.status(500).json({
      error: "Could not delete post",
    });
  }
});


// ========================================
// LIKES - LIKE POST
// ========================================

app.post("/api/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.userId;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({
        error: "You already liked this post",
      });
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    res.status(201).json({
      message: "Post liked successfully",
      like,
    });
  } catch (error) {
    console.error("Error liking post:", error);

    res.status(500).json({
      error: "Could not like post",
    });
  }
});


// ========================================
// LIKES - UNLIKE POST
// ========================================

app.delete("/api/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.userId;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLike) {
      return res.status(400).json({
        error: "You have not liked this post",
      });
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    res.json({
      message: "Post unliked successfully",
    });
  } catch (error) {
    console.error("Error unliking post:", error);

    res.status(500).json({
      error: "Could not unlike post",
    });
  }
});


// ========================================
// COMMENTS - CREATE
// ========================================

app.post("/api/posts/:id/comments", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.userId;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        error: "Comment cannot be empty",
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);

    res.status(500).json({
      error: "Could not create comment",
    });
  }
});


// ========================================
// COMMENTS - GET
// ========================================

app.get("/api/posts/:id/comments", authMiddleware, async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);

    res.status(500).json({
      error: "Could not fetch comments",
    });
  }
});


// ========================================
// COMMENTS - DELETE
// ========================================

app.delete("/api/comments/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user.userId;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        error: "You can only delete your own comments",
      });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);

    res.status(500).json({
      error: "Could not delete comment",
    });
  }
});


// ========================================
// FOLLOW - FOLLOW USER
// ========================================

app.post("/api/users/:id/follow", authMiddleware, async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.userId;

    if (followerId === followingId) {
      return res.status(400).json({
        error: "You cannot follow yourself",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({
        error: "You already follow this user",
      });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(201).json({
      message: "User followed successfully",
      follow,
    });
  } catch (error) {
    console.error("Error following user:", error);

    res.status(500).json({
      error: "Could not follow user",
    });
  }
});


// ========================================
// FOLLOW - UNFOLLOW USER
// ========================================

app.delete("/api/users/:id/follow", authMiddleware, async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.userId;

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      return res.status(400).json({
        error: "You are not following this user",
      });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.json({
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);

    res.status(500).json({
      error: "Could not unfollow user",
    });
  }
});


// ========================================
// FOLLOW - GET FOLLOWERS
// ========================================

app.get("/api/users/:id/followers", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.json(followers);
  } catch (error) {
    console.error("Error fetching followers:", error);

    res.status(500).json({
      error: "Could not fetch followers",
    });
  }
});


// ========================================
// FOLLOW - GET FOLLOWING
// ========================================

app.get("/api/users/:id/following", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.json(following);
  } catch (error) {
    console.error("Error fetching following:", error);

    res.status(500).json({
      error: "Could not fetch following",
    });
  }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`Server running on ${PUBLIC_URL}`);
});