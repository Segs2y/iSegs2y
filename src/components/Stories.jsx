import "./Stories.css";

function Stories() {
    const users = ["Segs2y", "John", "Sarah", "Naruto", "Toshiro", "Zenitsu"];


  return (
    <section className="stories">
      {users.map((user) => (
        <div className="story" Key={user}>
            <div className="story-circle">
            {user.charAt(0)}
        </div>

        <p>{user}</p>
        </div>
      ))}
    </section>
  );
}

export default Stories;