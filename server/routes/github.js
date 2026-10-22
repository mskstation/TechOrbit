
const express = require("express");
const GitHubDeveloper = require("../models/GitHubDeveloper");

const router = express.Router();

const CACHE_DURATION = 6 * 60 * 60 * 1000;

router.get("/developers", async (req, res) => {
  try {
    const refresh = req.query.refresh === "true";

    const cached = await GitHubDeveloper.find({})
      .sort({ cachedAt: -1 })
      .limit(100)
      .lean();

    const cacheIsFresh =
      cached.length >= 100 &&
      cached.every(
        (user) =>
          Date.now() - new Date(user.cachedAt).getTime() <
          CACHE_DURATION
      );

    if (!refresh && cacheIsFresh) {
      return res.json({
        success: true,
        source: "mongodb-cache",
        count: cached.length,
        developers: cached,
      });
    }

    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/search/users?q=type:user+repos:%3E0&sort=followers&order=desc&per_page=100",
      { headers }
    );

    if (!response.ok) {
      if (cached.length) {
        return res.json({
          success: true,
          source: "mongodb-cache",
          warning: `GitHub returned ${response.status}; showing cached profiles.`,
          count: cached.length,
          developers: cached,
        });
      }

      return res.status(502).json({
        success: false,
        message:
          response.status === 403
            ? "GitHub API rate limit reached. Try again later."
            : `GitHub API request failed (${response.status}).`,
      });
    }

    const data = await response.json();
    const now = new Date();

    const profiles = (data.items || []).map((user) => ({
      githubId: user.id,
      login: user.login,
      avatarUrl: user.avatar_url || "",
      profileUrl: user.html_url || "",
      accountType: user.type || "User",
      cachedAt: now,
    }));

    if (profiles.length) {
      await GitHubDeveloper.bulkWrite(
        profiles.map((profile) => ({
          updateOne: {
            filter: { githubId: profile.githubId },
            update: { $set: profile },
            upsert: true,
          },
        }))
      );
    }

    const developers = await GitHubDeveloper.find({
      githubId: { $in: profiles.map((user) => user.githubId) },
    })
      .sort({ followers: -1 })
      .lean();

    return res.json({
      success: true,
      source: "github-api",
      count: developers.length,
      developers,
    });
  } catch (error) {
    console.error("GitHub developers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not load GitHub developers.",
    });
  }
});

module.exports = router;
