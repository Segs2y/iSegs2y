import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import API_BASE_URL from "../config";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Post deleted successfully");

        setPosts((currentPosts) =>
          currentPosts.filter((post) => post.id !== postId),
        );
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikePost = async (postId, likedByMe) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: likedByMe ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);

        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: !likedByMe,
                  _count: {
                    ...post._count,
                    likes: likedByMe
                      ? post._count.likes - 1
                      : post._count.likes + 1,
                  },
                }
              : post,
          ),
        );
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleCreateComment = async (postId) => {
    const token = localStorage.getItem("token");
    const text = commentText[postId];

    if (!text || text.trim() === "") {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: text,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Comment created successfully");

        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [...(post.comments || []), data.comment],
                }
              : post,
          ),
        );

        setCommentText((currentComments) => ({
          ...currentComments,
          [postId]: "",
        }));
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Comment deleted successfully");

        setPosts((currentPosts) =>
          currentPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment.id !== commentId,
                  ),
                }
              : post,
          ),
        );
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    fetch(`${API_BASE_URL}/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (!Array.isArray(data)) {
          throw new Error(data.error || "Could not fetch posts");
        }

        const postsWithComments = await Promise.all(
          data.map(async (post) => {
            const commentsResponse = await fetch(
              `${API_BASE_URL}/api/posts/${post.id}/comments`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            const commentsData = await commentsResponse.json();

            return {
              ...post,
              comments: Array.isArray(commentsData) ? commentsData : [],
            };
          }),
        );

        setPosts(postsWithComments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-container">
        {user && (
          <div className="welcome-section">
            <h1>Welcome, {user.username}! 👋</h1>
            <p>Share your moments with the world</p>
          </div>
        )}

        <CreatePost
          onPostCreated={(newPost) => {
            setPosts((currentPosts) => [newPost, ...currentPosts]);
          }}
        />

        <div className="posts-feed">
          {loading ? (
            <div className="empty-feed">
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <p>No posts yet. Follow users to see their posts! 📝</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                commentText={commentText}
                setCommentText={setCommentText}
                handleLikePost={handleLikePost}
                handleDeletePost={handleDeletePost}
                handleCreateComment={handleCreateComment}
                handleDeleteComment={handleDeleteComment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
