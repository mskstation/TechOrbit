
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET: Public developer directory
router.get("/", async (req, res) => {
  try {
    const users = await User.find({})
      .select(
        "name email bio profileImage skills github linkedin location createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        skills: user.skills || [],
        github: user.github || "",
        linkedin: user.linkedin || "",
        location: user.location || "",
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Developer directory error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load developers",
    });
  }
});

// GET: Logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        skills: user.skills || [],
        github: user.github || "",
        linkedin: user.linkedin || "",
        location: user.location || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not load profile",
    });
  }
});

// PUT: Update logged-in user's professional profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { bio, skills, github, linkedin, location } = req.body;

    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({
        success: false,
        message: "Bio must be text",
      });
    }

    if (bio && bio.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Bio cannot exceed 300 characters",
      });
    }

    if (skills !== undefined && !Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array",
      });
    }

    if (
      skills &&
      (skills.length > 30 ||
        skills.some(
          (skill) =>
            typeof skill !== "string" || skill.trim().length > 40
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum 30 skills allowed, 40 characters per skill",
      });
    }

    const updates = {};

    if (bio !== undefined) updates.bio = bio.trim();

    if (skills !== undefined) {
      updates.skills = skills.map((skill) => skill.trim()).filter(Boolean);
    }

    for (const field of ["github", "linkedin", "location"]) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} must be text`,
          });
        }

        updates[field] = req.body[field].trim();
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        skills: user.skills || [],
        github: user.github || "",
        linkedin: user.linkedin || "",
        location: user.location || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not update profile",
    });
  }
});

module.exports = router;
