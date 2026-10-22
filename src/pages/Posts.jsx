
import React, { useCallback, useEffect, useState } from "react";
import postsApi from "../services/postsApi";
import { useAuth } from "../context/AuthContext";
import "./Posts.css";

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [comments, setComments] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [busyPost, setBusyPost] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setError("");
      const response = await postsApi.get("/");
      setPosts(response.data.posts || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Posts load nahi ho payi. Backend check karein."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function createPost(event) {
    event.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    setError("");

    try {
      const response = await postsApi.post("/", {
        content: content.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 10),
      });

      setPosts((current) => [response.data.post, ...current]);
      setContent("");
      setTags("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Post publish nahi hui. Kya aap logged in hain?"
      );
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(postId) {
    setBusyPost(postId);
    setError("");

    try {
      await postsApi.post(`/${postId}/like`);
      await loadPosts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Like karne ke liye login karein."
      );
    } finally {
      setBusyPost("");
    }
  }

  async function addComment(event, postId) {
    event.preventDefault();
    const text = (comments[postId] || "").trim();
    if (!text) return;

    setBusyPost(postId);
    setError("");

    try {
      await postsApi.post(`/${postId}/comments`, { text });
      setComments((current) => ({ ...current, [postId]: "" }));
      await loadPosts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Comment karne ke liye login karein."
      );
    } finally {
      setBusyPost("");
    }
  }

  return (
    <main className="posts-page">
      <header className="posts-heading">
        <span className="posts-eyebrow">TECHORBIT COMMUNITY</span>
        <h1>Developer Feed<span>.</span></h1>
        <p>Share your ideas, projects and coding journey.</p>
      </header>

      {error && <p className="posts-error" role="alert">{error}</p>}

      {user && (
        <form className="post-composer" onSubmit={createPost}>
          <h2>Create a post</h2>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What are you building today?"
            maxLength={2000}
            required
          />
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Tags separated by commas (React, JavaScript)"
          />
          <button disabled={posting || !content.trim()}>
            {posting ? "Publishing..." : "Publish post"}
          </button>
        </form>
      )}

      <section className="posts-list">
        {loading ? (
          <p>Loading developer posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post) => (
            <article className="post-card" key={post._id}>
              <div className="post-author">
                <div className="post-avatar">
                  {(post.author?.name || "D").charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{post.author?.name || "Developer"}</strong>
                  <small>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : ""}
                  </small>
                </div>
              </div>

              <p className="post-content">{post.content}</p>

              {!!post.tags?.length && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={`${tag}-${index}`}>#{tag}</span>
                  ))}
                </div>
              )}

              <div className="post-actions">
                <button
                  type="button"
                  onClick={() => toggleLike(post._id)}
                  disabled={busyPost === post._id}
                >
                  ❤️ Like ({post.likes?.length || 0})
                </button>
                <span>💬 {post.comments?.length || 0} comments</span>
              </div>

              <div className="post-comments">
                {post.comments?.map((comment) => (
                  <div className="post-comment" key={comment._id}>
                    <strong>{comment.author?.name || "Developer"}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}

                {user && (
                  <form onSubmit={(event) => addComment(event, post._id)}>
                    <input
                      value={comments[post._id] || ""}
                      onChange={(event) =>
                        setComments((current) => ({
                          ...current,
                          [post._id]: event.target.value,
                        }))
                      }
                      placeholder="Write a comment..."
                      maxLength={1000}
                      required
                    />
                    <button disabled={busyPost === post._id}>
                      Comment
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
