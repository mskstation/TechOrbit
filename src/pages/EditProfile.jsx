
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const STORAGE_KEY = "techorbit_profile";

const emptyForm = {
  bio: "",
  skills: "",
  github: "",
  linkedin: "",
  location: "",
};

function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);

      if (savedProfile) {
        const user = JSON.parse(savedProfile);

        setForm({
          bio: user.bio || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : user.skills || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          location: user.location || "",
        });
      }
    } catch {
      setError("Saved profile read nahi ho paayi.");
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const skills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const profile = {
        bio: form.bio.trim(),
        skills,
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
        location: form.location.trim(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

      setForm((previous) => ({
        ...previous,
        skills: skills.join(", "),
      }));

      setMessage("Profile successfully save ho gayi!");
    } catch {
      setError("Profile save nahi hui. Browser storage check karein.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="edit-profile-page">
      <section className="edit-profile-card">
        <button
          type="button"
          className="edit-profile-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <p className="edit-profile-eyebrow">
          TECHORBIT · YOUR PROFILE
        </p>

        <h1>Edit Professional Profile</h1>

        <p className="edit-profile-subtitle">
          Apni developer identity, skills aur professional links update karo.
          Tumhari details isi browser mein save hongi.
        </p>

        {message && (
          <div className="edit-profile-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="edit-profile-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="bio">Professional Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            maxLength={300}
            rows={4}
            placeholder="Apne baare mein likho..."
          />
          <small>{form.bio.length}/300 characters</small>

          <label htmlFor="skills">Skills</label>
          <input
            id="skills"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, JavaScript, Node.js"
          />
          <small>Skills ko comma se separate karo.</small>

          <label htmlFor="github">GitHub Profile URL</label>
          <input
            id="github"
            name="github"
            type="url"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />

          <label htmlFor="linkedin">LinkedIn Profile URL</label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://www.linkedin.com/in/username"
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            maxLength={100}
            placeholder="Jaipur, Rajasthan"
          />

          <button
            type="submit"
            className="edit-profile-save"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditProfile;
