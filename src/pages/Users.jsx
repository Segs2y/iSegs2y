import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config";
import "./Users.css";

function Users() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);

  const navigate = useNavigate();

  // Get the logged-in user and all users
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Get the currently logged-in user
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
        console.error("Error fetching current user:", error);
      });

    // Get all users
    fetch(`${API_BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [navigate]);

  // Get the users that the logged-in user follows
  useEffect(() => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/users/${user.id}/following`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowing(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching following:", error);
      });
  }, [user]);

  // Follow a user
  const handleFollow = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("User followed successfully");

        setFollowing((currentFollowing) => [
          ...currentFollowing,
          {
            following: {
              id: userId,
            },
          },
        ]);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Unfollow a user
  const handleUnfollow = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}/follow`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("User unfollowed successfully");

        setFollowing((currentFollowing) =>
          currentFollowing.filter((follow) => follow.following.id !== userId),
        );
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="users-page">
      <h1>Discover People</h1>
      {users.map((person) => {
        const isFollowing = following.some(
          (follow) => follow.following.id === person.id,
        );

        return (
          <div className="user-card" key={person.id}>
            <div className="user-info">
              <h3>
                <Link to={`/users/${person.id}`}>{person.username}</Link>
              </h3>

              <p>{person.email}</p>
            </div>
            {user && user.id !== person.id && (
              <button
                className="follow-button"
                onClick={() =>
                  isFollowing
                    ? handleUnfollow(person.id)
                    : handleFollow(person.id)
                }
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Users;
