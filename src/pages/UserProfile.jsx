import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config";
import "./UserProfile.css";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 1. Get the currently logged-in user
        const currentUserResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentUser = await currentUserResponse.json();

        setCurrentUserId(currentUser.id);

        // 2. Get the profile we are viewing
        const userResponse = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await userResponse.json();

        setUser(userData);

        // 3. Get all posts
        const postsResponse = await fetch(`${API_BASE_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postsData = await postsResponse.json();

        const userPosts = postsData.filter(
          (post) => post.userId === Number(id),
        );

        setPosts(userPosts);

        // 4. Get this user's followers
        const followersResponse = await fetch(
          `${API_BASE_URL}/api/users/${id}/followers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const followersData = await followersResponse.json();

        setFollowers(followersData);

        // 5. Get this user's following
        const followingResponse = await fetch(
          `${API_BASE_URL}/api/users/${id}/following`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const followingData = await followingResponse.json();

        setFollowing(followingData);

        // 6. Check whether I already follow this user
        if (currentUser.id !== Number(id)) {
          const myFollowingResponse = await fetch(
            `${API_BASE_URL}/api/users/${currentUser.id}/following`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const myFollowingData = await myFollowingResponse.json();

          const alreadyFollowing = myFollowingData.some(
            (follow) => follow.following.id === Number(id),
          );

          setIsFollowing(alreadyFollowing);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [id, navigate]);

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.error);
        return;
      }

      if (isFollowing) {
        setIsFollowing(false);

        setFollowers((currentFollowers) =>
          currentFollowers.filter(
            (follow) => follow.follower?.id !== currentUserId,
          ),
        );
      } else {
        setIsFollowing(true);

        setFollowers((currentFollowers) => [
          ...currentFollowers,
          {
            follower: {
              id: currentUserId,
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating follow:", error);
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>{user.username}</h1>

        <p>{user.email}</p>

        <div className="profile-stats">
          <p>
            <strong>{posts.length}</strong>
            <span>Posts</span>
          </p>

          <p>
            <Link to={`/users/${id}/followers`}>
              <strong>{followers.length}</strong>
              <span>Followers</span>
            </Link>
          </p>

          <p>
            <Link to={`/users/${id}/following`}>
              <strong>{following.length}</strong>
              <span>Following</span>
            </Link>
          </p>
        </div>

        {currentUserId !== Number(id) && (
          <button className="follow-button" onClick={handleFollowToggle}>
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>

        {posts.length === 0 ? (
          <p>This user has no posts yet.</p>
        ) : (
          posts.map((post) => (
            <div className="profile-post" key={post.id}>
              <p>{post.content}</p>

              <p>❤️ {post._count.likes} Likes</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;
