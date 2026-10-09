
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserCard from '../components/UserCard';
import SkeletonLoader from '../components/SkeletonLoader';
import AlertBanner from '../components/AlertBanner';
import useDebounce from '../hooks/useDebounce';
import { getUsers } from '../services/postService';

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError('Developers could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((user) => {
    const text = [
      user.name,
      user.username,
      user.email,
      user.company?.name,
      user.address?.city,
    ].join(' ').toLowerCase();

    return text.includes(debouncedSearch.toLowerCase());
  });

  return (
    <main className="premium-directory">
      <section className="directory-hero">
        <span className="premium-section-label">THE COMMUNITY</span>
        <h1>Meet the developers.</h1>
        <p>
          Discover talented people, explore their work and find inspiration
          for what you build next.
        </p>

        <div className="directory-total">
          <span className="directory-total-icon">♙</span>
          <strong>{loading ? '…' : users.length}</strong>
          <span>community profiles</span>
        </div>
      </section>

      <section className="directory-browser">
        <div className="directory-browser-heading">
          <div>
            <h2>Discover people</h2>
            <p>Search developers by name, username, company or city.</p>
          </div>
          <Link to="/" className="directory-home-link">← Back home</Link>
        </div>

        <div className="premium-directory-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search developers, companies, locations..."
            aria-label="Search developers"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <div className="directory-results-line">
          <span>
            {loading
              ? 'Loading developers…'
              : `Showing ${filteredUsers.length} of ${users.length} developers`}
          </span>
          <span className="directory-live-label">
            <i /> Live directory
          </span>
        </div>

        {error && (
          <div className="directory-error">
            <AlertBanner message={error} />
            <button type="button" onClick={loadUsers} className="premium-button premium-button-secondary">
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="directory-loading">
            <SkeletonLoader />
          </div>
        ) : !error && filteredUsers.length > 0 ? (
          <div className="user-grid premium-user-grid">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : !error ? (
          <div className="directory-empty premium-empty">
            <span>⌕</span>
            <h3>No developers found</h3>
            <p>Try another name, company or location.</p>
            <button
              type="button"
              onClick={() => setSearch('')}
              className="premium-button premium-button-primary"
            >
              Clear search
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
