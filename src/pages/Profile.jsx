
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("techorbit_profile");

      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      setProfile(null);
    }
  }, []);

  const hasProfile = Boolean(
    profile &&
    (
      profile.bio?.trim() ||
      profile.location?.trim() ||
      profile.github?.trim() ||
      profile.linkedin?.trim() ||
      (Array.isArray(profile.skills) && profile.skills.length > 0)
    )
  );

  const skills = Array.isArray(profile?.skills)
    ? profile.skills
    : [];

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-heading">
          <div className="profile-avatar">
            <span>👤</span>
          </div>

          <div>
            <p className="profile-eyebrow">TECHORBIT · YOUR ACCOUNT</p>
            <h1>My Profile</h1>
            <p className="profile-description">
              {hasProfile
                ? "Yahan tumhari professional profile details hain."
                : "Apni developer profile banao aur apni details save karo."}
            </p>
          </div>
        </div>

        {!hasProfile ? (
          <div className="profile-empty">
            <h2>Apni profile banao</h2>
            <p>
              Abhi profile details save nahi hui hain. Pehle apni
              information bharo aur Save Profile par click karo.
            </p>

            <button
              type="button"
              className="profile-edit-button"
              onClick={() => navigate("/edit-profile")}
            >
              + Create Profile
            </button>
          </div>
        ) : (
          <>
            <div className="profile-details">
              <div className="profile-field">
                <span>Professional Bio</span>
                <p>{profile.bio || "Bio add nahi ki gayi."}</p>
              </div>

              <div className="profile-field">
                <span>Skills</span>
                {skills.length > 0 ? (
                  <div className="profile-skills">
                    {skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="profile-skill"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>Skills add nahi ki gayi hain.</p>
                )}
              </div>

              <div className="profile-field">
                <span>Location</span>
                <p>{profile.location || "Location add nahi ki gayi."}</p>
              </div>

              <div className="profile-field">
                <span>GitHub</span>
                {profile.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.github}
                  </a>
                ) : (
                  <p>GitHub link add nahi hai.</p>
                )}
              </div>

              <div className="profile-field">
                <span>LinkedIn</span>
                {profile.linkedin ? (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.linkedin}
                  </a>
                ) : (
                  <p>LinkedIn link add nahi hai.</p>
                )}
              </div>
            </div>

            <button
              type="button"
              className="profile-edit-button"
              onClick={() => navigate("/edit-profile")}
            >
              ✏️ Edit Profile
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default Profile;
