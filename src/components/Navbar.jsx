import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">Instagram</Link>
      </h1>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <div className="search-results">
          {filteredUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            filteredUsers.map((user) => (
              <Link
                key={user.id}
                to={`/users/${user.id}`}
                onClick={() => setSearch("")}
              >
                {user.username}
              </Link>
            ))
          )}
        </div>
      )}
      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/users">Discover</Link>

        <Link to="/profile">Profile</Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
