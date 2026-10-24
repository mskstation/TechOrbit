
import React, { useMemo, useState } from "react";

const resources = [
  {
    title: "HTML Fundamentals",
    category: "Frontend",
    description: "Learn page structure, semantic HTML and forms.",
    level: "Beginner",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
  },
  {
    title: "CSS Styling",
    category: "Frontend",
    description: "Learn layouts, responsive design, Flexbox and Grid.",
    level: "Beginner",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
  },
  {
    title: "JavaScript Guide",
    category: "JavaScript",
    description: "Understand variables, functions, objects and async code.",
    level: "Beginner",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  },
  {
    title: "React Documentation",
    category: "Frontend",
    description: "Learn components, props, state and hooks.",
    level: "Intermediate",
    url: "https://react.dev/learn",
  },
  {
    title: "Git Handbook",
    category: "Tools",
    description: "Understand version control and everyday Git commands.",
    level: "Beginner",
    url: "https://guides.github.com/introduction/git-handbook/",
  },
  {
    title: "GitHub Skills",
    category: "Tools",
    description: "Practise GitHub workflows with interactive exercises.",
    level: "Beginner",
    url: "https://skills.github.com/",
  },
  {
    title: "Web Accessibility",
    category: "Web Design",
    description: "Build more inclusive and accessible web experiences.",
    level: "Intermediate",
    url: "https://www.w3.org/WAI/fundamentals/",
  },
  {
    title: "Web Performance",
    category: "Web Design",
    description: "Learn practical techniques for faster websites.",
    level: "Intermediate",
    url: "https://web.dev/learn/performance/",
  },
];

const categories = [
  "All",
  "Frontend",
  "JavaScript",
  "Tools",
  "Web Design",
];

export default function Resources() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        category === "All" || resource.category === category;

      const matchesSearch = [
        resource.title,
        resource.description,
        resource.category,
        resource.level,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="resources-page">
      <section className="resources-hero">
        <span className="resources-eyebrow">LEARN · PRACTISE · GROW</span>
        <h1>Your developer <span>toolkit.</span></h1>
        <p>
          A curated collection of learning guides and official documentation
          to help you grow as a developer.
        </p>
        <div className="resources-hero-count">
          <strong>{resources.length}</strong>
          <span>learning resources to explore</span>
        </div>
      </section>

      <section className="resources-content">
        <div className="resources-heading">
          <div>
            <h2>Learning library</h2>
            <p>Explore official guides and practical learning tools.</p>
          </div>
        </div>

        <div className="resources-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search learning resources..."
            aria-label="Search learning resources"
          />
          <span>{filteredResources.length} results</span>
        </div>

        <div className="resources-filters">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={`resources-filter ${category === item ? "selected" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredResources.length > 0 ? (
          <div className="resources-grid">
            {filteredResources.map((resource) => (
              <article className="resource-card" key={resource.title}>
                <div className="resource-card-top">
                  <span className="resource-category">
                    {resource.category}
                  </span>
                  <span className="resource-level">{resource.level}</span>
                </div>

                <h3>{resource.title}</h3>
                <p>{resource.description}</p>

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  Open learning resource ↗
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="resources-empty">
            <h3>No resources found</h3>
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
      </section>
    </main>
  );
}
