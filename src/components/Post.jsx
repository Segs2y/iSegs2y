import { useState } from "react";
import "./Post.css";

function Post({ username, caption }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  return (
    <article className="post">
      <div className="post-header">
        <div className="post-avatar">{username.charAt(0)}</div>

        <strong>{username}</strong>
      </div>

      <div className="post-image">
        <p>Instagram Photo</p>
      </div>

      <div className="post-actions">
        <span
          onClick={() => {
            setLiked(!liked);
            setLikes(liked ? likes - 1 : likes + 1);
          }}
          style={{ cursor: "pointer" }}
        >
          {liked ? "❤️" : "♡"}
        </span>

        <span>💬</span>
        <span>↗️</span>
        <span className="save">🔖</span>
      </div>

      <p className="like-count">
        {likes} {likes === 1 ? "like" : "likes"}
      </p>

      <div className="comment-box">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={() => {
            if (comment.trim() !== "") {
              setComments([...comments, comment]);
              setComment("");
            }
          }}
        >
          Post
        </button>
      </div>

      <div className="comments">
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>Segs2y</strong> {comment}
          </p>
        ))}
      </div>
      <div className="post-content">
        <strong>{username}</strong>
        <p>{caption}</p>
      </div>
    </article>
  );
}

export default Post;
