const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// In-memory storage for posts (replace with database in production)
let posts = [
  {
    id: 1,
    user: 'John Doe',
    userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: 'Just had an amazing day at the beach! 🌊☀️',
    image: 'https://source.unsplash.com/random/800x600?beach',
    likes: 120,
    comments: [],
    time: '2 hours ago'
  },
  {
    id: 2,
    user: 'Jane Smith',
    userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    content: 'Check out my new project! #coding #webdev',
    likes: 85,
    comments: [],
    time: '4 hours ago'
  }
];

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Create a new post
app.post('/api/posts', upload.single('image'), (req, res) => {
  const { content, user, userImage } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const newPost = {
    id: posts.length + 1,
    user: user || 'Anonymous',
    userImage: userImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
    content,
    image,
    likes: 0,
    comments: [],
    time: 'Just now'
  };

  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// Like a post
app.post('/api/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    post.likes += 1;
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Add a comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const { content, user, userImage } = req.body;
  
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    const newComment = {
      id: post.comments.length + 1,
      user: user || 'Anonymous',
      userImage: userImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
      content,
      time: 'Just now'
    };
    
    post.comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 