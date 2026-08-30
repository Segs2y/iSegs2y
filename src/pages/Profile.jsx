import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = 2;

    if (!token) {
      navigate("/login");
      return;
    }

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

    fetch(`http://localhost:5000/api/users/${userId}/followers`, {
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

    fetch(`http://localhost:5000/api/users/${userId}/following`, {
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
  }, [navigate]);

  return (
    <div>
      <h1>My Profile</h1>

      {user ? (
        <div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <div>
            <p>
              Posts: {posts.filter((post) => post.userId === user.id).length}
            </p>
            <p>Followers: {followers.length}</p>
            <p>Following: {following.length}</p>
          </div>

          <h3>
            My Posts ({posts.filter((post) => post.userId === user.id).length})
          </h3>

          {posts.length === 0 ? (
            <p>You haven't created any posts yet.</p>
          ) : (
            posts
              .filter((post) => post.userId === user.id)
              .map((post) => (
                <div key={post.id}>
                  <p>{post.content}</p>
                  <p>❤️ {post._count.likes} Likes</p>
                </div>
              ))
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
