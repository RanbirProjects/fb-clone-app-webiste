import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { setPosts, likePost, addComment } from '../state/postsSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const [newPost, setNewPost] = useState('');
  const [picturePath, setPicturePath] = useState('');
  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const formData = new FormData();
      formData.append('picture', acceptedFiles[0]);
      try {
        const response = await axios.post('http://localhost:5000/api/upload', formData);
        setPicturePath(response.data.picturePath);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  });

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(setPosts(response.data));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        {
          description: newPost,
          picturePath,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      dispatch(setPosts([response.data, ...posts]));
      setNewPost('');
      setPicturePath('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      dispatch(likePost({ postId, userId: user._id }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      dispatch(addComment({ postId, comment: response.data.comments[response.data.comments.length - 1] }));
      setComment('');
      setSelectedPost(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar src={user?.profilePicture} alt={user?.firstName} />
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </Box>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 2,
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                {picturePath ? 'Image uploaded' : 'Drop an image here or click to select'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handlePost}
              disabled={!newPost && !picturePath}
            >
              Post
            </Button>
          </Paper>

          {posts.map((post) => (
            <Paper key={post._id} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={post.userId.profilePicture} alt={post.userId.firstName} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1">
                    {post.userId.firstName} {post.userId.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ mb: 2 }}>{post.description}</Typography>
              {post.picturePath && (
                <Box
                  component="img"
                  src={post.picturePath}
                  alt="Post"
                  sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                />
              )}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <IconButton onClick={() => handleLike(post._id)}>
                  {post.likes.includes(user._id) ? (
                    <ThumbUpIcon color="primary" />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                </IconButton>
                <IconButton onClick={() => setSelectedPost(selectedPost === post._id ? null : post._id)}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {post.likes.length} likes
              </Typography>
              <Divider sx={{ my: 2 }} />
              {selectedPost === post._id && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleComment(post._id)}
                    disabled={!comment}
                  >
                    Comment
                  </Button>
                </Box>
              )}
              {post.comments.map((comment, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Avatar src={comment.userId.profilePicture} alt={comment.userId.firstName} />
                  <Box>
                    <Typography variant="subtitle2">
                      {comment.userId.firstName} {comment.userId.lastName}
                    </Typography>
                    <Typography variant="body2">{comment.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 