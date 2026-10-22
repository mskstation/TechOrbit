
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../services/userApi";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userApi.get("/profile");
        const user = response.data.user;

        setForm({
          bio: user.bio || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          location: user.location || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Profile load nahi hui. Pehle login karke try karein."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const skills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      await userApi.put("/profile", {
        bio: form.bio,
        skills,
        github: form.github,
        linkedin: form.linkedin,
        location: form.location,
      });

      setMessage("Profile successfully update ho gayi!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Profile update nahi hui. Dobara try karein."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="edit-profile-page">Profile load ho rahi hai...</main>;
  }

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

        <p className="edit-profile-eyebrow">TECHORBIT · YOUR PROFILE</p>
        <h1>Edit Professional Profile</h1>
        <p className="edit-profile-subtitle">
          Apni developer identity, skills aur professional links update karo.
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
            placeholder="https://linkedin.com/in/username"
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
