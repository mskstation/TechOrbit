
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPost, getUsers } from '../services/postService';

export default function AddPost() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: '',
    title: '',
    body: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  useEffect(() => {
    getUsers()
      .then((response) => setUsers(response.data))
      .catch(() =>
        setStatus({
          type: 'error',
          msg: 'Unable to load authors. Please try again.',
        })
      )
      .finally(() => setLoadingAuthors(false));
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const titleOk =
    form.title.trim().length >= 5 &&
    form.title.trim().length <= 80;

  const bodyOk =
    form.body.trim().length >= 20 &&
    form.body.trim().length <= 500;

  const valid = Boolean(form.userId && titleOk && bodyOk);

  const submit = async (event) => {
    event.preventDefault();

    if (!valid || saving) return;

    setSaving(true);
    setStatus({ type: '', msg: '' });

    try {
      const response = await createPost({
        title: form.title.trim(),
        body: form.body.trim(),
        userId: Number(form.userId),
      });

      if (response.status === 201) {
        setStatus({
          type: 'success',
          msg: 'Article published successfully.',
        });

        setForm({ userId: '', title: '', body: '' });
      } else {
        setStatus({
          type: 'error',
          msg: 'The article could not be published. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        msg: 'Publishing failed. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="publish-page">
      <div className="publish-container">
        <Link to="/" className="publish-back">
          ← Back to overview
        </Link>

        <section className="publish-heading">
          <span className="eyebrow">
            <span className="status-dot" />
            COMMUNITY CONTRIBUTIONS
          </span>

          <h1>
            Share with the <span>team.</span>
          </h1>

          <p>
            Turn your ideas into a technical update.
            Share knowledge with the TechOrbit community.
          </p>
        </section>

        <div className="publish-layout">
          <section className="publish-form-panel">
            <div className="publish-panel-heading">
              <div>
                <span className="publish-step">ARTICLE EDITOR / 01</span>
                <h2>Create publication</h2>
              </div>
              <span className="publish-symbol">✎</span>
            </div>

            {status.msg && (
              <div
                className={`publish-alert ${status.type}`}
                role="status"
              >
                <span>{status.type === 'success' ? '✓' : '!'}</span>
                {status.msg}
              </div>
            )}

            <form className="publish-form" onSubmit={submit}>
              <label htmlFor="author">
                Author
                <select
                  id="author"
                  name="userId"
                  value={form.userId}
                  onChange={update}
                  required
                  disabled={loadingAuthors}
                >
                  <option value="">
                    {loadingAuthors
                      ? 'Loading authors...'
                      : 'Select an author'}
                  </option>

                  {users.map((user) => (
                    <option value={user.id} key={user.id}>
                      {user.name}
                      {user.company?.name
                        ? ` · ${user.company.name}`
                        : ''}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="article-title">
                Article title
                <input
                  id="article-title"
                  name="title"
                  value={form.title}
                  onChange={update}
                  maxLength={80}
                  minLength={5}
                  placeholder="e.g. Improving API reliability with retries"
                  required
                />
                <small className={titleOk ? 'valid-count' : ''}>
                  {form.title.length}/80 characters · Minimum 5
                </small>
              </label>

              <label htmlFor="article-body">
                Article content
                <textarea
                  id="article-body"
                  name="body"
                  value={form.body}
                  onChange={update}
                  maxLength={500}
                  minLength={20}
                  rows={8}
                  placeholder="Share your technical insight, what you learned, or an idea worth exploring..."
                  required
                />
                <small className={bodyOk ? 'valid-count' : ''}>
                  {form.body.length}/500 characters · Minimum 20
                </small>
              </label>

              <button
                type="submit"
                className="publish-submit"
                disabled={!valid || saving}
              >
                {saving ? 'Publishing...' : 'Publish article'}
                <span>{saving ? '…' : '→'}</span>
              </button>

              <p className="publish-form-note">
                Check your title and content before publishing.
              </p>
            </form>
          </section>

          <aside className="publish-sidebar">
            <div className="publish-tip">
              <span className="publish-tip-icon">✦</span>
              <span className="publish-step">WRITING GUIDE</span>
              <h3>Make it valuable.</h3>
              <p>
                Great technical updates are clear, useful,
                and easy for other developers to understand.
              </p>
            </div>

            <div className="publish-checklist">
              <h3>Before you publish</h3>
              <div className="check-row">
                <span className={titleOk ? 'check-done' : ''}>
                  {titleOk ? '✓' : '01'}
                </span>
                <p>Write a descriptive title</p>
              </div>
              <div className="check-row">
                <span className={bodyOk ? 'check-done' : ''}>
                  {bodyOk ? '✓' : '02'}
                </span>
                <p>Include useful details</p>
              </div>
              <div className="check-row">
                <span className={form.userId ? 'check-done' : ''}>
                  {form.userId ? '✓' : '03'}
                </span>
                <p>Select your author profile</p>
              </div>
            </div>

            <div className="publish-demo-note">
              <span>ⓘ</span>
              <p>
                This student project uses a demo API.
                A successful response may not persist permanently.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
