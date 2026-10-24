
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDirectory.css";

const API_URL =
  "https://api.github.com/search/users?q=type:user&per_page=30";

const CACHE_KEY = "techorbit_github_developers";
const CACHE_TIME = 6 * 60 * 60 * 1000;

function readCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);

    if (Array.isArray(parsed.profiles)) {
      return parsed;
    }
  } catch {
    // Invalid cache ko ignore karo.
  }

  return null;
}

export default function UserDirectory() {
  const [profiles, setProfiles] = useState(() => {
    return readCache()?.profiles || [];
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(() => !readCache());
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const cached = readCache();
    const isFresh =
      cached && Date.now() - cached.savedAt < CACHE_TIME;

    if (isFresh) {
      setLoading(false);
      return;
    }

    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading((current) => profiles.length === 0 ? true : current);
    setRefreshing(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (response.status === 403 || response.status === 429) {
        throw new Error(
          "GitHub API limit poori hai. Available cached profiles dikha rahe hain."
        );
      }

      if (!response.ok) {
        throw new Error("Developers load nahi ho paaye.");
      }

      const data = await response.json();

      const users = (data.items || []).map((item) => ({
        id: item.id,
        username: item.login,
        name: item.login,
        avatar: item.avatar_url,
        bio: "Public GitHub developer profile.",
        location: "",
        github: item.html_url,
      }));

      setProfiles(users);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          profiles: users,
          savedAt: Date.now(),
        })
      );

      if (users.length === 0) {
        setError("Koi developer nahi mila.");
      }
    } catch (err) {
      const cached = readCache();

      if (cached?.profiles?.length) {
        setProfiles(cached.profiles);
        setError(
          "GitHub se naya data nahi mil saka. Pehle se saved profiles dikha rahe hain."
        );
      } else {
        setError(
          err.message || "Developers load nahi ho paaye."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return profiles.filter((profile) =>
      [profile.name, profile.username, profile.bio]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [profiles, search]);

  return (
    <main className="premium-directory">
      <section className="directory-hero">
        <span className="premium-section-label">THE COMMUNITY</span>
        <h1>Meet the developers.</h1>
        <p>Discover public GitHub developers and explore their work.</p>

        <div className="directory-total">
          <span className="directory-total-icon">♙</span>
          <strong>{loading ? "..." : profiles.length}</strong>
          <span>public developer profiles</span>
        </div>
      </section>

      <section className="directory-browser">
        <div className="directory-browser-heading">
          <div>
            <h2>Discover developers</h2>
            <p>Search by name or username.</p>
          </div>

          <Link to="/" className="directory-home-link">
            ← Back home
          </Link>
        </div>

        <div className="premium-directory-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search GitHub developers..."
            aria-label="Search GitHub developers"
          />

          {search && (
            <button type="button" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>

        <div className="directory-results-line">
          <span>
            {loading
              ? "Loading public GitHub profiles..."
              : `Showing ${filteredProfiles.length} of ${profiles.length} profiles`}
          </span>
          <span className="directory-live-label">
            <i /> Public GitHub
          </span>
        </div>

        {loading && (
          <div className="directory-message">
            Developers load ho rahe hain...
          </div>
        )}

        {!loading && error && (
          <div className="directory-message directory-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && filteredProfiles.length > 0 && (
          <div className="user-grid premium-user-grid">
            {filteredProfiles.map((profile) => (
              <article
                className="directory-profile-card"
                key={profile.id}
              >
                <div className="directory-profile-header">
                  <img
                    className="directory-avatar"
                    src={profile.avatar}
                    alt={`${profile.username} avatar`}
                    loading="lazy"
                  />

                  <div className="directory-profile-identity">
                    <span className="directory-profile-type">
                      PUBLIC GITHUB PROFILE
                    </span>
                    <h3>{profile.name}</h3>
                    <p>@{profile.username}</p>
                  </div>
                </div>

                <p className="directory-profile-bio">{profile.bio}</p>

                <div className="directory-profile-links">
                  <Link
                    to={`/users/${encodeURIComponent(profile.username)}`}
                    state={{
                      profile: {
                        login: profile.username,
                        name: profile.name,
                        avatar_url: profile.avatar,
                        html_url: profile.github,
                        bio: profile.bio,
                        location: profile.location,
                      },
                    }}
                    className="directory-internal-profile-link"
                  >
                    View Profile →
                  </Link>

                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View GitHub Profile ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredProfiles.length === 0 && (
          <div className="directory-empty premium-empty">
            <h3>No developers found</h3>
            <p>Try another username.</p>
            <button
              type="button"
              className="premium-button premium-button-primary"
              onClick={() => setSearch("")}
            >
              Clear search
            </button>
          </div>
        )}

        <div className="directory-refresh-area">
          <button
            type="button"
            className="premium-button premium-button-secondary"
            disabled={loading || refreshing}
            onClick={loadProfiles}
          >
            {refreshing ? "Refreshing..." : "Refresh profiles"}
          </button>
        </div>

        <p className="directory-demo-notice">
          Developer usernames and avatars are provided by GitHub.
          Cached profiles may be shown when the API is unavailable.
        </p>
      </section>
    </main>
  );
}
