
const mongoose = require("mongoose");

const githubDeveloperSchema = new mongoose.Schema(
  {
    githubId: { type: Number, required: true, unique: true },
    login: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    profileUrl: { type: String, default: "" },
    accountType: { type: String, default: "User" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    followers: { type: Number, default: 0 },
    publicRepos: { type: Number, default: 0 },
    cachedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "GitHubDeveloper",
  githubDeveloperSchema
);
