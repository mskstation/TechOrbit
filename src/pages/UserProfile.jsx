
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const { id } = useParams();
  const location = useLocation();
  const initialProfile = location.state?.profile || null;

  const [user, setUser] = useState(initialProfile);
  const [repos, setRepos] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsMessage, setDetailsMessage] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadDetails() {
      setDetailsLoading(true);
      setDetailsMessage("");

      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(id || "")}`,
          { signal: controller.signal }
        );

        if (response.status === 403 || response.status === 429) {
          throw new Error("GitHub API limit poori hai. Basic profile dikh rahi hai; detailed statistics baad mein try karein.");
        }

        if (!response.ok) {
          throw new Error("GitHub ki detailed information abhi available nahi hai.");
        }

        const profile = await response.json();
        if (!active) return;

        setUser((previous) => ({ ...previous, ...profile }));

        const repoResponse = await fetch(
          `https://api.github.com/users/${encodeURIComponent(id || "")}/repos?sort=updated&per_page=6`,
          { signal: controller.signal }
        );

        if (repoResponse.status === 403 || repoResponse.status === 429) {
          throw new Error("Profile load ho gayi, lekin repositories ke liye GitHub API limit poori hai.");
        }

        if (!repoResponse.ok) {
          throw new Error("Repositories abhi load nahi ho paayi.");
        }

        const repoData = await repoResponse.json();
        if (active && Array.isArray(repoData)) {
          setRepos(repoData);
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setDetailsMessage(error.message || "Detailed information abhi available nahi hai.");
        }
      } finally {
        if (active) setDetailsLoading(false);
      }
    }

    loadDetails();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-message profile-error">
            <h2>Profile information unavailable</h2>
            <p>Developers page se dobara profile open karein.</p>
            <Link to="/users" className="profile-back-button">
              ← Back to Developers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const username = user.login || id;
  const githubUrl = user.html_url || `https://github.com/${encodeURIComponent(username)}`;
  const websiteUrl = user.blog
    ? /^https?:\/\//i.test(user.blog)
      ? user.blog
      : `https://${user.blog}`
    : "";

  return (
    <main className="profile-page">
      <div className="profile-container">
        <Link to="/users" className="profile-back-link">
          ← All Developers
        </Link>

        <section className="profile-hero">
          <div className="profile-avatar-wrap">
            <img
              src={user.avatar_url || `https://github.com/${encodeURIComponent(username)}.png`}
              alt={`${username} avatar`}
              className="profile-avatar"
            />
          </div>

          <div className="profile-heading">
            <span className="profile-eyebrow">
              <span className="profile-status-dot" />
              PUBLIC GITHUB PROFILE
            </span>

            <h1>{user.name || username}</h1>
            <p className="profile-username">@{username}</p>
            <p className="profile-specialization">
              {user.bio || "Public GitHub developer profile."}
            </p>

            <p className="profile-location">
              ⌖ {user.location || "Location not provided"}
            </p>

            <div className="profile-hero-actions">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-primary-action"
              >
                Open GitHub ↗
              </a>

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-secondary-action"
                >
                  Personal Website ↗
                </a>
              )}
            </div>
          </div>

          <div className="profile-hero-stat">
            <span className="profile-stat-number">
              {Number.isFinite(user.public_repos) ? user.public_repos : "—"}
            </span>
            <span className="profile-stat-label">Repositories</span>
          </div>
        </section>

        {detailsMessage && (
          <div className="profile-message">
            <p>{detailsMessage}</p>
          </div>
        )}

        <section className="profile-details-section">
          <div className="profile-section-heading">
            <span className="profile-section-index">01</span>
            <div>
              <h2>Developer Overview</h2>
              <p>Public information provided by GitHub.</p>
            </div>
          </div>

          <div className="profile-info-grid">
            <article className="profile-info-card">
              <span className="profile-info-icon">♙</span>
              <span className="profile-info-label">FOLLOWERS</span>
              <p>{Number.isFinite(user.followers) ? user.followers : "—"}</p>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-icon">↗</span>
              <span className="profile-info-label">FOLLOWING</span>
              <p>{Number.isFinite(user.following) ? user.following : "—"}</p>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-icon">▤</span>
              <span className="profile-info-label">PUBLIC REPOSITORIES</span>
              <p>{Number.isFinite(user.public_repos) ? user.public_repos : "—"}</p>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-icon">@</span>
              <span className="profile-info-label">COMPANY</span>
              <p>{user.company || "Not provided"}</p>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-icon">⌖</span>
              <span className="profile-info-label">LOCATION</span>
              <p>{user.location || "Not provided"}</p>
            </article>

            <article className="profile-info-card">
              <span className="profile-info-icon">✉</span>
              <span className="profile-info-label">PUBLIC EMAIL</span>
              {user.email ? (
                <a href={`mailto:${user.email}`}>{user.email}</a>
              ) : (
                <p>Not publicly provided</p>
              )}
            </article>
          </div>
        </section>

        <section className="profile-details-section">
          <div className="profile-section-heading">
            <span className="profile-section-index">02</span>
            <div>
              <h2>Public Repositories</h2>
              <p>Recently updated public projects from GitHub.</p>
            </div>
          </div>

          {detailsLoading && (
            <div className="profile-message">GitHub details load ho rahi hain...</div>
          )}

          {repos.length > 0 ? (
            <div className="profile-posts-grid">
              {repos.map((repo) => (
                <article className="profile-post-card" key={repo.id}>
                  <div className="profile-post-card-top">
                    <span className="profile-post-tag">
                      {repo.language || "PROJECT"}
                    </span>
                    <span className="profile-post-arrow">↗</span>
                  </div>

                  <h3>{repo.name}</h3>
                  <p>{repo.description || "No description provided."}</p>

                  <div className="profile-repo-stats">
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count} forks</span>
                  </div>

                  <a
                    className="profile-repo-link"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository ↗
                  </a>
                </article>
              ))}
            </div>
          ) : (
            !detailsLoading && (
              <div className="profile-message profile-empty">
                <h3>Repository details unavailable</h3>
                <p>
                  API limit hone ya public projects unavailable hone par
                  yeh section khaali reh sakta hai.
                </p>
                <a
                  className="profile-secondary-action"
                  href={`${githubUrl}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View All Repositories ↗
                </a>
              </div>
            )
          )}
        </section>

        <div className="profile-bottom-link">
          <Link to="/users" className="profile-back-button">
            ← Explore More Developers
          </Link>
        </div>
      </div>
    </main>
  );
}
