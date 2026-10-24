
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("techorbit-theme") || "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("techorbit-theme", theme);
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="topbar premium-navbar">
      <div className="topbar-inner premium-navbar-inner">
        <Link to="/" className="brand premium-brand" onClick={closeMenu}>
          <span className="brand-mark premium-brand-mark">T</span>
          <span className="premium-brand-name">
            Tech<span className="brand-accent">Orbit</span>
            <span className="premium-brand-caption">
              DEVELOPER COMMUNITY
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`nav-links premium-nav-links${menuOpen ? " menu-open" : ""}`}
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navClass} onClick={closeMenu}>
            Overview
          </NavLink>

          <NavLink to="/users" className={navClass} onClick={closeMenu}>
            Developers
          </NavLink>

          <NavLink to="/posts" className={navClass} onClick={closeMenu}>
            Community
          </NavLink>

          <NavLink to="/projects" className={navClass} onClick={closeMenu}>
            Projects
          </NavLink>

          <NavLink to="/resources" className={navClass} onClick={closeMenu}>
            Resources
          </NavLink>
        </nav>

        <div
          className={`nav-actions premium-nav-actions${menuOpen ? " menu-open" : ""}`}
        >
          <button
            type="button"
            className="theme-toggle premium-theme-toggle"
            onClick={() =>
              setTheme((current) =>
                current === "dark" ? "light" : "dark"
              )
            }
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Change appearance"
          >
            <span aria-hidden="true">
              {theme === "dark" ? "☼" : "☾"}
            </span>
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {user ? (
            <>
              <Link
                to="/profile"
                className="signin-link premium-text-link"
                onClick={closeMenu}
              >
                Profile
              </Link>

              <span className="nav-user premium-user">
                <span className="premium-user-dot" />
                {user.name}
              </span>

              <button
                type="button"
                className="signin-link logout-button premium-logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="signin-link premium-text-link"
                onClick={closeMenu}
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="signup-link premium-signup"
                onClick={closeMenu}
              >
                Get started <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
