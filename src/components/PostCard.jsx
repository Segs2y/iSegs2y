import { Link } from "react-router-dom";
import "./PostCard.css";

function PostCard({
  post,
  user,
  commentText,
  setCommentText,
  handleLikePost,
  handleDeletePost,
  handleCreateComment,
  handleDeleteComment,
}) {
  return (
    <div className="post-card">
      <h3>
        <Link to={`/users/${post.user.id}`}>{post.user.username}</Link>
      </h3>
      <p className="post-author-email">{post.user.email}</p>
      <p className="post-content">{post.content}</p>
      <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
      <p>❤️ {post._count.likes} Likes</p>
      <p>💬 {post.comments?.length || 0} Comments</p>
      <div className="post-actions">
        <button onClick={() => handleLikePost(post.id, post.likedByMe)}>
          {post.likedByMe ? "❤️ Liked" : "🤍 Like"}
        </button>
      </div>
      <div className="comments">
        {post.comments?.map((comment) => (
          <div className="comment" key={comment.id}>
            <p>
              <strong>{comment.user.username}</strong>: {comment.content}
            </p>

            {comment.userId === user?.id && (
              <button onClick={() => handleDeleteComment(comment.id, post.id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText[post.id] || ""}
          onChange={(e) =>
            setCommentText((currentComments) => ({
              ...currentComments,
              [post.id]: e.target.value,
            }))
          }
        />
        <button onClick={() => handleCreateComment(post.id)}>Comment</button>
      </div>

      {post.userId === user?.id && (
        <button onClick={() => handleDeletePost(post.id)}>Delete</button>
      )}
    </div>
  );
}

export default PostCard;
