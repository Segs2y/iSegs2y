import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

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

    fetch(`http://localhost:5000/api/users/${id}/followers`, {
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
  }, [id, navigate]);

  return (
    <div>
      <h1>Followers</h1>

      {followers.length === 0 ? (
        <p>This user has no followers yet.</p>
      ) : (
        followers.map((follow) => (
          <div key={follow.id}>
            <Link to={`/users/${follow.follower.id}`}>
              <h3>{follow.follower.username}</h3>
            </Link>

            <p>{follow.follower.email}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Followers;
