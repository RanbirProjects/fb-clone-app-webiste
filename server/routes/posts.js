const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const { description, picturePath, location } = req.body;
    const post = new Post({
      userId: req.user._id,
      description,
      picturePath,
      location
    });

    await post.save();
    await post.getPostWithUser();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feed posts
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = await Post.find({
      userId: { $in: [...user.friends, user._id] }
    })
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName profilePicture')
    .populate('comments.userId', 'firstName lastName profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user posts
router.get('/:userId/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName profilePicture')
      .populate('comments.userId', 'firstName lastName profilePicture');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike a post
router.patch('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.getPostWithUser();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment to post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.comments.push({
      userId: req.user._id,
      text
    });

    await post.save();
    await post.getPostWithUser();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    await post.remove();
    res.json({ message: 'Post deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 