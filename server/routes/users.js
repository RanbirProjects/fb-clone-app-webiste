const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile.' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'bio', 'location', 'occupation', 'profilePicture', 'coverPicture'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates.' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send friend request
router.post('/:id/friend-request', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    user.friendRequests.push(req.user._id);
    await user.save();

    res.json({ message: 'Friend request sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept friend request
router.post('/:id/accept-friend', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!req.user.friendRequests.includes(user._id)) {
      return res.status(400).json({ message: 'No friend request from this user.' });
    }

    // Add each user to the other's friends list
    req.user.friends.push(user._id);
    user.friends.push(req.user._id);

    // Remove friend request
    req.user.friendRequests = req.user.friendRequests.filter(
      id => id.toString() !== user._id.toString()
    );

    await req.user.save();
    await user.save();

    res.json({ message: 'Friend request accepted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's friends
router.get('/:id/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', 'firstName lastName profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 