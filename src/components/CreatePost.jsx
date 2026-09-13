import { useState } from "react";
import API_BASE_URL from "../config";
import "./CreatePost.css";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!content.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onPostCreated(data.post);
        setContent("");
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
