
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "Task Nova",
    category: "Productivity",
    language: "React",
    description: "Organize tasks and manage daily work in one place.",
    icon: "✓",
    color: "teal",
    tags: ["React", "CSS", "JavaScript"],
    url: "https://github.com/topics/todo-app",
  },
  {
    title: "News Explorer",
    category: "Web Development",
    language: "React",
    description: "Explore news articles and build a modern news interface.",
    icon: "◉",
    color: "blue",
    tags: ["React", "API", "CSS"],
    url: "https://github.com/topics/news-app",
  },
  {
    title: "Quiz Master",
    category: "Education",
    language: "JavaScript",
    description: "Practise questions and create interactive quizzes.",
    icon: "?",
    color: "purple",
    tags: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/topics/quiz-app",
  },
  {
    title: "Portfolio Studio",
    category: "Portfolio",
    language: "React",
    description: "Create a personal portfolio to showcase your skills.",
    icon: "⌘",
    color: "orange",
    tags: ["React", "Responsive UI"],
    url: "https://github.com/topics/portfolio",
  },
  {
    title: "Weather Dashboard",
    category: "Utilities",
    language: "JavaScript",
    description: "A weather dashboard concept for learning API integration.",
    icon: "☼",
    color: "blue",
    tags: ["JavaScript", "API", "HTML"],
    url: "https://github.com/topics/weather-app",
  },
  {
    title: "Developer Hub",
    category: "Community",
    language: "React",
    description: "A starting point for building a developer community.",
    icon: "</>",
    color: "teal",
    tags: ["React", "Community", "CSS"],
    url: "https://github.com/topics/developer-community",
  },
];

const categories = [
  "All",
  "Web Development",
  "Productivity",
  "Education",
  "Portfolio",
  "Utilities",
  "Community",
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        category === "All" || project.category === category;

      const matchesSearch = [
        project.title,
        project.description,
        project.language,
        project.category,
        ...project.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <span className="projects-eyebrow">BUILD · SHARE · EXPLORE</span>
        <h1>Ideas become <span>projects.</span></h1>
        <p>
          Discover project ideas, explore technologies and get inspired
          to build something of your own.
        </p>

        <div className="projects-hero-stats">
          <div><strong>{projects.length}</strong><span>Project ideas</span></div>
          <div><strong>{categories.length - 1}</strong><span>Categories</span></div>
          <div><strong>∞</strong><span>Ideas to build</span></div>
        </div>
      </section>

      <section className="projects-content">
        <div className="projects-heading">
          <div>
            <h2>Explore projects</h2>
            <p>Find inspiration for your next build.</p>
          </div>
          <Link to="/users" className="projects-text-link">
            Meet developers ↗
          </Link>
        </div>

        <div className="projects-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects or technologies..."
            aria-label="Search projects"
          />
          <span>{filteredProjects.length} results</span>
        </div>

        <div className="projects-filters">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={`projects-filter ${category === item ? "selected" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className={`project-icon ${project.color}`}>
                  {project.icon}
                </div>

                <div className="project-card-meta">
                  <span>{project.category}</span>
                  <span>{project.language}</span>
                </div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <a
                  className="project-explore-link"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore on GitHub ↗
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="projects-empty">
            <h3>No projects found</h3>
            <p>Try a different search or category.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        <p className="projects-disclaimer">
          These are sample project ideas linking to GitHub topic pages.
          They are not verified individual repositories or registered
          TechOrbit member submissions.
        </p>
      </section>
    </main>
  );
}
