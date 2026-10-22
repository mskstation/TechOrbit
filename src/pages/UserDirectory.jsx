
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AlertBanner from "../components/AlertBanner";
import SkeletonLoader from "../components/SkeletonLoader";
import useDebounce from "../hooks/useDebounce";
import usersApi from "../services/usersApi";
import githubApi from "../services/githubApi";

export default function UserDirectory() {
  const [members, setMembers] = useState([]);
  const [githubDevelopers, setGithubDevelopers] = useState([]);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [skill, setSkill] = useState("All skills");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const loadDirectory = useCallback(async (refresh = false) => {
    setLoading(true);
    setError("");

    const [memberResult, githubResult] = await Promise.allSettled([
      usersApi.get("/"),
      githubApi.get("/developers", {
        params: refresh ? { refresh: "true" } : {},
      }),
    ]);

    if (memberResult.status === "fulfilled") {
      const data = memberResult.value.data;
      setMembers(Array.isArray(data.users) ? data.users : []);
    } else {
      setMembers([]);
    }

    if (githubResult.status === "fulfilled") {
      const data = githubResult.value.data;
      setGithubDevelopers(
        Array.isArray(data.developers) ? data.developers : []
      );
    } else {
      setGithubDevelopers([]);
    }

    if (
      memberResult.status === "rejected" &&
      githubResult.status === "rejected"
    ) {
      setError(
        "Directory load nahi hui. Backend aur internet connection check karein."
      );
    } else if (githubResult.status === "rejected") {
      setError(
        "GitHub profiles load nahi hui. TechOrbit members phir bhi available ho sakte hain."
      );
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const allProfiles = useMemo(() => {
    const memberProfiles = members.map((user) => ({
      id: `member-${user.id}`,
      name: user.name || "TechOrbit Member",
      bio: user.bio || "",
      email: user.email || "",
      location: user.location || "",
      avatar: user.profileImage || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      skills: Array.isArray(user.skills) ? user.skills : [],
      type: "TechOrbit Member",
      isGitHub: false,
    }));

    const linkedGitHub = new Set(
      memberProfiles
        .map((user) => user.github.toLowerCase().replace(/\/+$/, ""))
        .filter(Boolean)
    );

    const externalProfiles = githubDevelopers
      .filter((user) => user.accountType !== "Organization")
      .filter((user) => {
        const url = (user.profileUrl || "").toLowerCase().replace(/\/+$/, "");
        return !linkedGitHub.has(url);
      })
      .map((user) => ({
        id: `github-${user.githubId}`,
        name: user.login,
        bio: user.bio || "",
        email: "",
        location: user.location || "",
        avatar: user.avatarUrl || "",
        github: user.profileUrl || "",
        linkedin: "",
        skills: [],
        type: "Public GitHub Profile",
        isGitHub: true,
      }));

    if (source === "members") return memberProfiles;
    if (source === "github") return externalProfiles;

    return [...memberProfiles, ...externalProfiles];
  }, [members, githubDevelopers, source]);

  const skills = useMemo(() => {
    const values = members.flatMap((user) =>
      Array.isArray(user.skills) ? user.skills : []
    );

    return [
      "All skills",
      ...Array.from(new Set(values.filter(Boolean))).sort(),
    ];
  }, [members]);

  const filteredProfiles = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return allProfiles.filter((profile) => {
      const text = [
        profile.name,
        profile.bio,
        profile.location,
        profile.email,
        profile.github,
        profile.linkedin,
        ...profile.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatches = text.includes(query);
      const skillMatches =
        skill === "All skills" ||
        profile.skills.some(
          (item) => item.toLowerCase() === skill.toLowerCase()
        );

      return searchMatches && skillMatches;
    });
  }, [allProfiles, debouncedSearch, skill]);

  return (
    <main className="premium-directory">
      <section className="directory-hero">
        <span className="premium-section-label">THE COMMUNITY</span>
        <h1>Meet the developers.</h1>
        <p>
          Discover TechOrbit members and real public GitHub profiles.
        </p>

        <div className="directory-total">
          <span className="directory-total-icon">♙</span>
          <strong>{loading ? "…" : allProfiles.length}</strong>
          <span>developer profiles</span>
        </div>
      </section>

      <section className="directory-browser">
        <div className="directory-browser-heading">
          <div>
            <h2>Discover people</h2>
            <p>Search by username, name, skills or location.</p>
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
            placeholder="Search developers..."
            aria-label="Search developers"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div style={styles.toolbar}>
          <label htmlFor="profile-source">Show</label>
          <select
            id="profile-source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            style={styles.select}
          >
            <option value="all">All profiles</option>
            <option value="members">TechOrbit members</option>
            <option value="github">GitHub public profiles</option>
          </select>

          <label htmlFor="profile-skill">Skill</label>
          <select
            id="profile-skill"
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
            style={styles.select}
          >
            {skills.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <button
            type="button"
            className="premium-button premium-button-secondary"
            disabled={loading || refreshing}
            onClick={() => {
              setRefreshing(true);
              loadDirectory(true);
            }}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="directory-results-line">
          <span>
            {loading
              ? "Loading developers..."
              : `Showing ${filteredProfiles.length} of ${allProfiles.length} profiles`}
          </span>
          <span className="directory-live-label"><i /> Directory</span>
        </div>

        {error && (
          <div className="directory-error">
            <AlertBanner message={error} />
            <button
              type="button"
              className="premium-button premium-button-secondary"
              onClick={() => loadDirectory()}
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="directory-loading"><SkeletonLoader /></div>
        ) : filteredProfiles.length > 0 ? (
          <div className="user-grid premium-user-grid">
            {filteredProfiles.map((profile) => (
              <article key={profile.id} style={styles.card}>
                <div style={styles.header}>
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={`${profile.name} avatar`}
                      loading="lazy"
                      style={styles.avatar}
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <div style={styles.avatarFallback}>
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <span style={styles.type}>{profile.type}</span>
                    <h3 style={styles.name}>{profile.name}</h3>
                    <p style={styles.location}>
                      {profile.location || "Location not provided"}
                    </p>
                  </div>
                </div>

                <p style={styles.bio}>
                  {profile.bio ||
                    (profile.isGitHub
                      ? "Public GitHub profile. Visit GitHub to learn more."
                      : "No professional bio added yet.")}
                </p>

                <div style={styles.skills}>
                  {profile.skills.length > 0 ? (
                    profile.skills.map((item) => (
                      <button
                        key={item}
                        type="button"
                        style={styles.skill}
                        onClick={() => setSkill(item)}
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <span style={styles.muted}>
                      {profile.isGitHub
                        ? "Skills not included in search results"
                        : "No skills added"}
                    </span>
                  )}
                </div>

                <div style={styles.links}>
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn ↗
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`}>Email ↗</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : !error ? (
          <div className="directory-empty premium-empty">
            <span>⌕</span>
            <h3>No developers found</h3>
            <p>Try another search or clear the filters.</p>
            <button
              type="button"
              className="premium-button premium-button-primary"
              onClick={() => {
                setSearch("");
                setSkill("All skills");
                setSource("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "18px",
    marginBottom: "10px",
    fontSize: "13px",
    fontWeight: 600,
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #d5e2e4",
    borderRadius: "10px",
    background: "#fff",
    color: "#142e35",
    maxWidth: "100%",
  },
  card: {
    minWidth: 0,
    padding: "22px",
    border: "1px solid #dce9e9",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 8px 24px rgba(17,60,67,0.05)",
    overflowWrap: "anywhere",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    background: "#dff4f2",
  },
  avatarFallback: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: "#dff4f2",
    color: "#087e8b",
    fontWeight: 800,
    fontSize: "20px",
  },
  type: {
    color: "#087e8b",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  name: { margin: "5px 0", fontSize: "17px" },
  location: { margin: 0, color: "#64777c", fontSize: "13px" },
  bio: {
    minHeight: "44px",
    margin: "18px 0",
    color: "#52676d",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginBottom: "20px",
  },
  skill: {
    padding: "6px 10px",
    border: "1px solid #c9e9e7",
    borderRadius: "20px",
    background: "#effaf9",
    color: "#086b73",
    fontSize: "12px",
    cursor: "pointer",
  },
  muted: { color: "#718489", fontSize: "13px" },
  links: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    paddingTop: "14px",
    borderTop: "1px solid #e6eeee",
    fontSize: "13px",
    fontWeight: 700,
  },
};
