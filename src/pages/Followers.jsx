import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";
import "./Followers.css";

function Followers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/users/${id}/followers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFollowers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching followers:", error);
      });
  }, [id, navigate]);

  return (
    <>
      <Navbar />
      <div className="followers-page">
        <h1>Followers</h1>

        {followers.length === 0 ? (
          <p className="empty-message">This user has no followers yet.</p>
        ) : (
          <div className="followers-list">
            {followers.map((follow) => (
              <div className="follower-card" key={follow.id}>
                <div className="follower-info">
                  <Link to={`/users/${follow.follower.id}`}>
                    <h3>{follow.follower.username}</h3>
                  </Link>
                  <p>{follow.follower.email}</p>
                </div>
                <Link to={`/users/${follow.follower.id}`} className="view-btn">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Followers;
