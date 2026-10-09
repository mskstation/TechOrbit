
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';

const technologies = [
  { name: 'React', icon: '⚛', color: '#087ea4' },
  { name: 'JavaScript', icon: 'JS', color: '#b68b00' },
  { name: 'Python', icon: 'Py', color: '#3572a5' },
  { name: 'Node.js', icon: '⬡', color: '#39804a' },
  { name: 'TypeScript', icon: 'TS', color: '#3178c6' },
  { name: 'Next.js', icon: 'N', color: '#17152d' },
  { name: 'MongoDB', icon: '◉', color: '#39804a' },
  { name: 'Docker', icon: '▤', color: '#2496ed' },
];

const features = [
  {
    icon: '⌕',
    title: 'Discover Developers',
    description: 'Find talented developers, explore their profiles and discover new skills.',
  },
  {
    icon: '</>',
    title: 'Share Knowledge',
    description: 'Publish technical articles, share ideas and learn from the community.',
  },
  {
    icon: '↗',
    title: 'Grow Together',
    description: 'Explore new technologies and get inspired by other developers’ work.',
  },
];

function Home() {
  const [userCount, setUserCount] = useState(null);
  const [postCount, setPostCount] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [usersResponse, postsResponse] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/posts'),
        ]);

        if (active) {
          setUserCount(Array.isArray(usersResponse.data) ? usersResponse.data.length : 0);
          setPostCount(Array.isArray(postsResponse.data) ? postsResponse.data.length : 0);
          setApiOnline(true);
        }
      } catch (error) {
        if (active) setApiOnline(false);
        console.error('Unable to load TechOrbit stats:', error);
      }
    };

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="premium-home">
      <section className="premium-hero">
        <div className="premium-hero-copy">
          <div className="premium-eyebrow">
            <span className="premium-live-dot" />
            ENGINEERING COMMUNITY PLATFORM
          </div>

          <h1>
            Connect.
            <br />
            Learn.
            <br />
            Grow <span>Together.</span>
          </h1>

          <p className="premium-description">
            Discover talented developers, explore their work, share your
            projects, and be part of a growing tech community.
          </p>

          <div className="premium-actions">
            <Link to="/users" className="premium-button premium-button-primary">
              Explore Developers <span>→</span>
            </Link>
            <Link to="/login" className="premium-button premium-button-secondary">
              Get Started
            </Link>
          </div>

          <div className="premium-trust">
            <div className="premium-avatar-stack" aria-hidden="true">
              <span>M</span>
              <span>D</span>
              <span>R</span>
            </div>
            <p>
              <strong>Made for developers</strong>
              <small>Connect · Create · Grow</small>
            </p>
          </div>
        </div>

        <div className="premium-artwork" aria-label="Developer workspace illustration">
          <div className="premium-art-glow" />
          <div className="premium-orbit premium-orbit-one" />
          <div className="premium-orbit premium-orbit-two" />

          <div className="premium-code-window">
            <div className="premium-window-top">
              <span />
              <span />
              <span />
              <small>your-next-project.jsx</small>
            </div>
            <div className="premium-code-lines">
              <p><i>01</i> <b>const</b> developer = {'{'}</p>
              <p><i>02</i> &nbsp; creativity: <em>'unlimited'</em>,</p>
              <p><i>03</i> &nbsp; community: <strong>true</strong>,</p>
              <p><i>04</i> &nbsp; learning: <em>'everyday'</em></p>
              <p><i>05</i> {'}'}</p>
              <p><i>06</i> <b>build</b>(developer); <span>✦</span></p>
            </div>
          </div>

          <div className="premium-center-card">
            <div className="premium-center-icon">T</div>
            <span className="premium-center-caption">Your next idea starts here</span>
          </div>

          <div className="premium-float-card premium-float-top">
            <span className="premium-float-icon purple-icon">⌘</span>
            <span><strong>Discover</strong><small>Meet your community</small></span>
          </div>

          <div className="premium-float-card premium-float-bottom">
            <span className="premium-float-icon blue-icon">↗</span>
            <span><strong>Share knowledge</strong><small>Ideas become projects</small></span>
          </div>

          <div className="premium-spark premium-spark-one">✦</div>
          <div className="premium-spark premium-spark-two">✧</div>
          <div className="premium-art-label">BUILD SOMETHING GREAT</div>
        </div>
      </section>

      <section className="premium-stats" aria-label="Community statistics">
        <div className="premium-stat">
          <span className="premium-stat-icon">♙</span>
          <div>
            <strong>{userCount === null ? '—' : userCount.toLocaleString() + '+'}</strong>
            <span>Developers</span>
          </div>
        </div>
        <div className="premium-stat">
          <span className="premium-stat-icon">▤</span>
          <div>
            <strong>{postCount === null ? '—' : postCount.toLocaleString() + '+'}</strong>
            <span>Publications</span>
          </div>
        </div>
        <div className="premium-stat">
          <span className="premium-stat-icon">⌘</span>
          <div>
            <strong>8+</strong>
            <span>Popular technologies</span>
          </div>
        </div>
        <div className="premium-stat">
          <span className={`premium-status ${apiOnline ? 'is-online' : ''}`} />
          <div>
            <strong>{apiOnline ? 'Connected' : 'Checking'}</strong>
            <span>Community API</span>
          </div>
        </div>
      </section>

      <section className="premium-tech-section">
        <div className="premium-section-heading">
          <div>
            <span className="premium-section-label">YOUR TOOLKIT</span>
            <h2>Built around your stack.</h2>
            <p>Explore technologies developers love working with.</p>
          </div>
          <Link to="/users" className="premium-text-link">
            Meet developers <span>→</span>
          </Link>
        </div>

        <div className="premium-tech-list">
          {technologies.map((technology) => (
            <div className="premium-tech-pill" key={technology.name}>
              <span style={{ color: technology.color }}>{technology.icon}</span>
              {technology.name}
            </div>
          ))}
        </div>
      </section>

      <section className="premium-features-section">
        <div className="premium-section-heading">
          <div>
            <span className="premium-section-label">WHY TECHORBIT</span>
            <h2>A community that moves you forward.</h2>
            <p>Everything you need to discover, share and keep learning.</p>
          </div>
        </div>

        <div className="premium-feature-grid">
          {features.map((feature, index) => (
            <article className="premium-feature-card" key={feature.title}>
              <div className={`premium-feature-icon feature-color-${index}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link to={index === 0 ? '/users' : '/login'} className="premium-feature-link">
                Explore <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-cta">
        <div>
          <span className="premium-section-label">YOUR NEXT CHAPTER</span>
          <h2>Good things happen when developers connect.</h2>
          <p>Discover people, share what you build and keep growing.</p>
        </div>
        <Link to="/users" className="premium-button premium-button-primary">
          Explore the community <span>→</span>
        </Link>
      </section>

      <footer className="premium-footer">
        <Link to="/" className="premium-footer-brand">
          <span>T</span> TechOrbit
        </Link>
        <p>Built for curious minds and creative developers.</p>
        <span>© {new Date().getFullYear()} TechOrbit</span>
      </footer>
    </main>
  );
}

export default Home;
