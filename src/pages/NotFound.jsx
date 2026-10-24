
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-orbit not-found-orbit-one" />
      <div className="not-found-orbit not-found-orbit-two" />

      <section className="not-found-content">
        <span className="not-found-badge">
          <span className="status-dot" />
          SYSTEM MESSAGE · 404
        </span>

        <h1>4<span>0</span>4</h1>

        <h2>Lost in the orbit?</h2>

        <p>
          This page doesn't exist or may have moved.
          Let's get you back to the TechOrbit community.
        </p>

        <Link to="/" className="not-found-button">
          <span>←</span> Return to homepage
        </Link>

        <Link to="/users" className="not-found-secondary">
          Explore developers ↗
        </Link>
      </section>

      <div className="not-found-footer">
        TECHORBIT <span>·</span> CONNECT. LEARN. GROW.
      </div>
    </main>
  );
}
