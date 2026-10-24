
import React, { useCallback, useEffect, useState } from "react";
import postsApi from "../services/postsApi";
import { useAuth } from "../context/AuthContext";
import "./Posts.css";

const STORAGE_KEY = "techorbit-demo-posts-v1";

const initialDemoPosts = [
  {
    _id: "demo-1",
    author: { name: "Aarav Sharma" },
    content:
      "Just finished building my first React dashboard! Learning component design and responsive layouts has been a great experience. What are you building this week?",
    tags: ["React", "JavaScript", "WebDev"],
    likes: [],
    comments: [
      {
        _id: "demo-comment-1",
        author: { name: "Priya Verma" },
        text: "Looks like a great project to learn from!",
      },
    ],
    createdAt: "2026-10-22T09:30:00.000Z",
  },
  {
    _id: "demo-2",
    author: { name: "Priya Verma" },
    content:
      "A reminder for every developer: build small projects consistently. One finished project teaches you more than a dozen unfinished tutorials.",
    tags: ["Coding", "Learning", "DeveloperLife"],
    likes: [],
    comments: [],
    createdAt: "2026-10-21T12:15:00.000Z",
  },
  {
    _id: "demo-3",
    author: { name: "Rahul Meena" },
    content:
      "Exploring Node.js APIs and improving my frontend skills. My next goal is to connect a React application with a backend and understand the complete data flow.",
    tags: ["NodeJS", "API", "FullStack"],
    likes: [],
    comments: [],
    createdAt: "2026-10-20T07:45:00.000Z",
  },
];

function readDemoPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialDemoPosts;
  } catch {
    return initialDemoPosts;
  }
}

function saveDemoPosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // The page can still work if browser storage is unavailable.
  }
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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
  const [demoMode, setDemoMode] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await postsApi.get("/");
      const serverPosts = response.data?.posts;

      if (!Array.isArray(serverPosts)) {
        throw new Error("Invalid posts response");
      }

      setPosts(serverPosts);
      setDemoMode(false);
    } catch {
      // If the backend is unavailable, use local demo data.
      setPosts(readDemoPosts());
      setDemoMode(true);
      setError("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (demoMode) {
      saveDemoPosts(posts);
    }
  }, [posts, demoMode]);

  async function createPost(event) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent || posting) return;

    setPosting(true);
    setError("");

    const postTags = tags
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean)
      .slice(0, 10);

    try {
      if (demoMode) {
        const demoPost = {
          _id: createId(),
          author: { name: user?.name || "Demo Developer" },
          content: trimmedContent,
          tags: postTags,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString(),
        };

        setPosts((current) => [demoPost, ...current]);
      } else {
        const response = await postsApi.post("/", {
          content: trimmedContent,
          tags: postTags,
        });

        if (!response.data?.post) {
          throw new Error("Post response was incomplete");
        }

        setPosts((current) => [response.data.post, ...current]);
      }

      setContent("");
      setTags("");
    } catch {
      setError(
        "Post publish nahi hui. Login ya backend connection check karein."
      );
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(postId) {
    if (busyPost === postId) return;

    setBusyPost(postId);
    setError("");

    try {
      if (demoMode) {
        setPosts((current) =>
          current.map((post) => {
            if (post._id !== postId) return post;

            const likes = post.likes || [];
            const alreadyLiked = likes.includes("demo-user");

            return {
              ...post,
              likes: alreadyLiked
                ? likes.filter((id) => id !== "demo-user")
                : [...likes, "demo-user"],
            };
          })
        );
      } else {
        await postsApi.post(`/${postId}/like`);
        await loadPosts();
      }
    } catch {
      setError("Like nahi ho paya. Dobara try karein.");
    } finally {
      setBusyPost("");
    }
  }

  async function addComment(event, postId) {
    event.preventDefault();

    const text = (comments[postId] || "").trim();
    if (!text || busyPost === postId) return;

    setBusyPost(postId);
    setError("");

    try {
      if (demoMode) {
        const newComment = {
          _id: createId(),
          author: { name: user?.name || "Demo Developer" },
          text,
        };

        setPosts((current) =>
          current.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: [...(post.comments || []), newComment],
                }
              : post
          )
        );
      } else {
        await postsApi.post(`/${postId}/comments`, { text });
        await loadPosts();
      }

      setComments((current) => ({ ...current, [postId]: "" }));
    } catch {
      setError("Comment add nahi hua. Login ya backend connection check karein.");
    } finally {
      setBusyPost("");
    }
  }

  return (
    <main className="posts-page">
      <header className="posts-heading">
        <span className="posts-eyebrow">TECHORBIT COMMUNITY</span>
        <h1>
          Developer Feed<span>.</span>
        </h1>
        <p>Share your ideas, projects and coding journey.</p>
      </header>

      {demoMode && !loading && (
        <div className="posts-demo-notice" role="status">
          <strong>Demo Mode</strong>
          <span>
            Sample posts are shown locally. Likes and comments are saved in
            this browser, not on a server.
          </span>
          <button type="button" onClick={loadPosts}>
            Retry connection
          </button>
        </div>
      )}

      {error && (
        <p className="posts-error" role="alert">
          {error}
        </p>
      )}

      {(user || demoMode) && (
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

      <section className="posts-list" aria-live="polite">
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
                  aria-label={`Like post by ${post.author?.name || "Developer"}`}
                >
                  ❤️ Like ({post.likes?.length || 0})
                </button>
                <span>💬 {post.comments?.length || 0} comments</span>
              </div>

              <div className="post-comments">
                {post.comments?.map((comment, index) => (
                  <div
                    className="post-comment"
                    key={comment._id || `${post._id}-comment-${index}`}
                  >
                    <strong>{comment.author?.name || "Developer"}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}

                {(user || demoMode) && (
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
                    <button
                      type="submit"
                      disabled={busyPost === post._id}
                    >
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
