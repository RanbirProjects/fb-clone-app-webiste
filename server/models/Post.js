const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  picturePath: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Method to get post with populated user data
postSchema.methods.getPostWithUser = async function() {
  await this.populate('userId', 'firstName lastName profilePicture');
  await this.populate('comments.userId', 'firstName lastName profilePicture');
  return this;
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 