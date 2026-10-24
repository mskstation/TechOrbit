
const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new developer post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    const post = await Post.create({
      author: req.userId,
      content: content.trim(),
      tags: Array.isArray(tags)
        ? tags.filter((tag) => typeof tag === "string").slice(0, 10)
        : [],
    });

    await post.populate("author", "name email");

    return res.status(201).json({
      success: true,
      message: "Post published successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not publish post",
    });
  }
});

// Get all developer posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Fetch posts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not fetch posts",
    });
  }
});

/* Like / Unlike a post */
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.userId.toString();

    const alreadyLiked = post.likes.some(
      (likedUserId) => likedUserId.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (likedUserId) => likedUserId.toString() !== userId
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like post error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not like post",
    });
  }
});

/* Add a comment to a post */
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 1000 characters",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      author: req.userId,
      text: text.trim(),
    });

    await post.save();
    await post.populate("comments.author", "name");

    const comment = post.comments[post.comments.length - 1];

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not add comment",
    });
  }
});

module.exports = router;
