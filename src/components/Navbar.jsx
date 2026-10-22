
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">T</span>
          <span>
            Tech<span className="brand-accent">Orbit</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Developers
          </NavLink>

          <NavLink
            to="/posts"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Community
          </NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/edit-profile" className="signin-link">
                Edit Profile
              </Link>

              <span className="nav-user">Hi, {user.name}</span>

              <button
                type="button"
                className="signin-link logout-button"
                onClick={handleLogout}
              >
                Logout <span aria-hidden="true">↗</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="signin-link">
                Sign in <span aria-hidden="true">↗</span>
              </Link>

              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
