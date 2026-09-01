import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Get logged-in user
    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });

    // Get posts
    fetch("http://localhost:5000/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [navigate]);

  // Load followers and following after we know the logged-in user
  useEffect(() => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem("token");

    // Get followers
    fetch(`http://localhost:5000/api/users/${user.id}/followers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data);
      })
      .catch((error) => {
        console.error("Error fetching followers:", error);
      });

    // Get following
    fetch(`http://localhost:5000/api/users/${user.id}/following`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowing(data);
      })
      .catch((error) => {
        console.error("Error fetching following:", error);
      });
  }, [user]);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const myPosts = posts.filter((post) => post.userId === user.id);

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {/* Profile picture */}
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={`${user.username}'s profile`}
          className="profile-image"
        />
      ) : (
        <div className="profile-placeholder">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}

      {/* User information */}
      <button type="button" onClick={() => fileInputRef.current.click()}>
        Change Profile Photo
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];

          if (!file) {
            return;
          }

          const token = localStorage.getItem("token");

          const formData = new FormData();

          formData.append("profileImage", file);

          try {
            const response = await fetch(
              "http://localhost:5000/api/users/profile-image",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              },
            );

            const data = await response.json();

            if (response.ok) {
              console.log("Profile image uploaded successfully");

              setUser(data.user);
            } else {
              console.error(data.error);
            }
          } catch (error) {
            console.error("Error uploading profile image:", error);
          }
        }}
      />
      <h2>{user.username}</h2>
      <p>{user.email}</p>

      {/* Profile statistics */}
      <div className="profile-stats">
        <p>
          <strong>{myPosts.length}</strong> Posts
        </p>

        <p>
          <strong>{followers.length}</strong> Followers
        </p>

        <p>
          <strong>{following.length}</strong> Following
        </p>
      </div>

      {/* My posts */}
      <h3>My Posts</h3>

      {myPosts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        myPosts.map((post) => (
          <div className="profile-post" key={post.id}>
            <p>{post.content}</p>
            <p>❤️ {post._count.likes} Likes</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;
