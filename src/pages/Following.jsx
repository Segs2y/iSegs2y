import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function Following() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/users/${id}/following`, {
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
  }, [id, navigate]);

  return (
    <div>
      <h1>Following</h1>

      {following.length === 0 ? (
        <p>This user is not following anyone yet.</p>
      ) : (
        following.map((follow) => (
          <div key={follow.id}>
            <Link to={`/users/${follow.following.id}`}>
              <h3>{follow.following.username}</h3>
            </Link>

            <p>{follow.following.email}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Following;
