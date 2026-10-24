import React from "react";
import { Link } from "react-router-dom";
import "./UserCard.css";

function UserCard({ user }) {
  const imageUrl = user?.picture || "";
  const name = user?.name || "Developer";
  const email = user?.email || "Email not available";
  const phone = user?.phone || "Phone not available";
  const location = [
    user?.address?.city,
    user?.address?.state,
    user?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="user-card">
      <div className="user-card-avatar">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="user-card-avatar-fallback"
          style={{ display: imageUrl ? "none" : "flex" }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="user-card-content">
        <h3>{name}</h3>
        <p>{email}</p>
        <p>{phone}</p>
        {location && <p>{location}</p>}

        <Link to={`/users/${user?.id}`}>
          View Profile →
        </Link>
      </div>
    </article>
  );
}

export default UserCard;