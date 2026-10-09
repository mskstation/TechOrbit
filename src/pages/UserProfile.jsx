
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserById, getUserPosts } from '../services/postService';
import './UserProfile.css';

function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const [userResponse, postsResponse] = await Promise.all([
          getUserById(id),
          getUserPosts(id),
        ]);

        if (!isMounted) return;

        setUser(userResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        if (!isMounted) return;

        console.error('Failed to load developer profile:', err);
        setError(
          'Developer profile load nahi ho payi. Internet connection check karke dobara try karein.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <p className="profile-status">Loading developer profile...</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-message profile-error">
            <h2>Profile unavailable</h2>
            <p>{error || 'Developer not found.'}</p>
            <Link to="/users" className="profile-back-button">
              ← Back to Developers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const location = [
    user.address?.city,
    user.address?.state,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <main className="profile-page">
      <div className="profile-container">
        <Link to="/users" className="profile-back-link">
          ← Back to Developers
        </Link>

        <section className="profile-hero">
          <div className="profile-avatar-wrap">
            {user.picture ? (
              <img
                src={user.picture}
                alt={`${user.name}'s profile`}
                className="profile-avatar"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.nextElementSibling?.removeAttribute(
                    'hidden'
                  );
                }}
              />
            ) : null}

            <div
              className="profile-avatar-fallback"
              hidden={Boolean(user.picture)}
            >
              {user.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
          </div>

          <div className="profile-heading">
            <span className="profile-eyebrow">DEVELOPER PROFILE</span>
            <h1>{user.name}</h1>
            <p className="profile-username">@{user.username}</p>

            <p className="profile-specialization">
              {user.company?.bs || 'Software Developer'}
            </p>

            {location && (
              <p className="profile-location">📍 {location}</p>
            )}
          </div>
        </section>

        <section className="profile-details-section">
          <h2>Contact Information</h2>

          <div className="profile-info-grid">
            <article className="profile-info-card">
              <span className="profile-info-label">EMAIL</span>
              <p>{user.email || 'Not provided'}</p>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-label">PHONE</span>
              <p>{user.phone || 'Not provided'}</p>
              <small>
                API-provided demo data; number is not verified.
              </small>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-label">LOCATION</span>
              <p>{location || 'Not provided'}</p>
              {user.address?.street && (
                <small>{user.address.street}</small>
              )}
            </article>

            <article className="profile-info-card">
              <span className="profile-info-label">WEBSITE</span>
              {user.website ? (
                <p className="profile-website">{user.website}</p>
              ) : (
                <p>Not provided</p>
              )}
            </article>
          </div>
        </section>

        <section className="profile-details-section">
          <h2>Company</h2>

          <article className="profile-company-card">
            <div className="profile-company-icon">⌘</div>

            <div>
              <h3>{user.company?.name || 'Company not provided'}</h3>
              <p>
                {user.company?.catchPhrase ||
                  'Building better digital experiences'}
              </p>
              <span>
                {user.company?.bs || 'Software Development'}
              </span>
            </div>
          </article>
        </section>

        <section className="profile-details-section">
          <div className="profile-posts-heading">
            <div>
              <h2>Articles & Posts</h2>
              <p>Articles associated with this demo profile.</p>
            </div>

            <span className="profile-post-count">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </span>
          </div>

          {posts.length > 0 ? (
            <div className="profile-posts-grid">
              {posts.map((post) => (
                <article className="profile-post-card" key={post.id}>
                  <span className="profile-post-tag">ARTICLE</span>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-message">
              No articles available for this profile.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default UserProfile;
